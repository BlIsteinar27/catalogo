"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { validateCategoryName } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { revalidateCategoryAndDashboard, revalidateCategoryChange, revalidateAll } from "@/server/cache";
import type { Category, CategoryInsert, ActionResult } from "@/lib/supabase/types";

export async function getCategoryList(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      logger.error("getCategoryList", "Error fetching categories", error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error("getCategoryList", "Unexpected error fetching categories", error);
    return [];
  }
}

export async function getCategoryListWithProductCount(): Promise<(Category & { product_count: number })[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*, products(count)")
      .order("name", { ascending: true });

    if (error) {
      logger.error("getCategoryListWithProductCount", "Error fetching categories with product count", error);
      return [];
    }

    return (data || []).map(cat => ({
      ...cat,
      product_count: (cat.products as any)?.[0]?.count || 0
    }));
  } catch (error) {
    logger.error("getCategoryListWithProductCount", "Unexpected error fetching categories with product count", error);
    return [];
  }
}

export async function getCategoryStats() {
  try {
    const supabase = await createClient();
    
    // Obtener categorías con conteo de productos
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*, products(count)")
      .order("name", { ascending: true });

    if (categoriesError) {
      logger.error("getCategoryStats", "Error fetching categories stats", categoriesError);
      return {
        totalCategories: 0,
        categoryWithMostProducts: null,
        productsWithoutCategory: 0
      };
    }

    const categoriesWithCount = (categories || []).map(cat => ({
      ...cat,
      product_count: (cat.products as any)?.[0]?.count || 0
    }));

    // Encontrar categoría con más productos
    const categoryWithMostProducts = categoriesWithCount
      .filter(cat => cat.product_count > 0)
      .sort((a, b) => b.product_count - a.product_count)[0] || null;

    // Obtener productos sin categoría (category = null o vacío)
    const { count: productsWithoutCategory, error: uncategorizedError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .or("category.is.null,category.eq.''");

    if (uncategorizedError) {
      logger.error("getCategoryStats", "Error counting uncategorized products", uncategorizedError);
    }

    return {
      totalCategories: categoriesWithCount.length,
      categoryWithMostProducts: categoryWithMostProducts ? {
        name: categoryWithMostProducts.name,
        count: categoryWithMostProducts.product_count
      } : null,
      productsWithoutCategory: productsWithoutCategory || 0
    };
  } catch (error) {
    logger.error("getCategoryStats", "Unexpected error fetching category stats", error);
    return {
      totalCategories: 0,
      categoryWithMostProducts: null,
      productsWithoutCategory: 0
    };
  }
}

export async function createCategory(
  payload: CategoryInsert,
): Promise<ActionResult<Category>> {
  const user = await getCurrentUser();
  if (!user) {
    logger.warn("createCategory", "Unauthorized attempt to create category");
    return { success: false, error: "No autorizado" };
  }

  const validationError = validateCategoryName(payload.name);
  if (validationError) return { success: false, error: validationError };

  const trimmedName = payload.name.trim();

  try {
    const supabase = await createClient();

    // Validar límite de categorías (máximo 10)
    const { count, error: countError } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    if (countError) {
      logger.error("createCategory", "Error counting categories", countError);
      return { success: false, error: "Error al verificar el límite de categorías" };
    }

    if (count && count >= 10) {
      return { success: false, error: "Has alcanzado el límite máximo de 10 categorías" };
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: trimmedName })
      .select()
      .single();

    if (error) {
      if (error.code === "23505" || error.message.includes("duplicate key")) {
        return { success: false, error: "Ya existe una categoría con ese nombre" };
      }
      logger.error("createCategory", "Error creating category", error);
      return { success: false, error: error.message };
    }

    revalidateAll();

    return { success: true, data };
  } catch (error) {
    logger.error("createCategory", "Unexpected error creating category", error);
    return { success: false, error: "Error inesperado al crear categoría" };
  }
}

export async function updateCategory(
  oldName: string,
  newName: string,
): Promise<ActionResult<Category>> {
  const user = await getCurrentUser();
  if (!user) {
    logger.warn("updateCategory", "Unauthorized attempt to update category");
    return { success: false, error: "No autorizado" };
  }

  const validationError = validateCategoryName(newName);
  if (validationError) return { success: false, error: validationError };

  const trimmedOldName = oldName.trim();
  const trimmedNewName = newName.trim();

  if (trimmedOldName === trimmedNewName) {
    return { success: false, error: "La nueva categoría es igual a la actual" };
  }

  try {
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("categories")
      .select("name")
      .eq("name", trimmedNewName)
      .single();

    if (existing) {
      return { success: false, error: "Ya existe una categoría con ese nombre" };
    }

    const { data: newCategory, error: insertError } = await supabase
      .from("categories")
      .insert({ name: trimmedNewName })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505" || insertError.message.includes("duplicate key")) {
        return { success: false, error: "Ya existe una categoría con ese nombre" };
      }
      logger.error("updateCategory", `Error creating new category ${trimmedNewName}`, insertError);
      return { success: false, error: insertError.message };
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ category: trimmedNewName })
      .eq("category", trimmedOldName);

    if (updateError) {
      logger.error(
        "updateCategory",
        `Error updating products from ${trimmedOldName} to ${trimmedNewName}`,
        updateError,
      );
      // Rollback new category to avoid orphaned records
      await supabase.from("categories").delete().eq("name", trimmedNewName);
      return { success: false, error: updateError.message };
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("name", trimmedOldName);

    if (deleteError) {
      logger.error(
        "updateCategory",
        `Error deleting old category ${trimmedOldName}`,
        deleteError,
      );
      return { success: false, error: deleteError.message };
    }

    revalidateAll();

    return { success: true, data: newCategory };
  } catch (error) {
    logger.error("updateCategory", "Unexpected error updating category", error);
    return { success: false, error: "Error inesperado al actualizar categoría" };
  }
}

export async function deleteCategory(name: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    logger.warn("deleteCategory", "Unauthorized attempt to delete category");
    return { success: false, error: "No autorizado" };
  }

  const validationError = validateCategoryName(name);
  if (validationError) return { success: false, error: validationError };

  const trimmedName = name.trim();

  try {
    const supabase = await createClient();

    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category", trimmedName);

    if (countError) {
      logger.error(
        "deleteCategory",
        `Error counting products for category ${trimmedName}`,
        countError,
      );
      return { success: false, error: countError.message };
    }

    if (count && count > 0) {
      return { success: false, error: "No se puede eliminar la categoría porque tiene productos asociados" };
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("name", trimmedName);

    if (error) {
      logger.error("deleteCategory", `Error deleting category ${trimmedName}`, error);
      return { success: false, error: error.message };
    }

    revalidateAll();

    return { success: true, data: undefined };
  } catch (error) {
    logger.error("deleteCategory", "Unexpected error deleting category", error);
    return { success: false, error: "Error inesperado al eliminar categoría" };
  }
}
