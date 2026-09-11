"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { validateProductPayload, isValidUUID } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { deleteProductImage } from "@/server/storage";
import { revalidateHomeAndDashboard, revalidateProductDetail, revalidateAll } from "@/server/cache";
import type {
  Product,
  ProductInsert,
  ProductUpdate,
  ActionResult,
} from "@/lib/supabase/types";

async function ensureCategoryExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  category: string | undefined,
): Promise<void> {
  if (!category) return;
  await supabase
    .from("categories")
    .upsert({ name: category }, { onConflict: "name" });
}

export async function createProduct(
  payload: ProductInsert,
): Promise<ActionResult<Product>> {
  const user = await getCurrentUser();
  if (!user) {
    logger.warn("createProduct", "Unauthorized attempt to create product");
    return { success: false, error: "No autorizado" };
  }

  const validationError = validateProductPayload(payload, true);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = await createClient();

    // Validar límite de productos (máximo 30)
    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (countError) {
      logger.error("createProduct", "Error counting products", countError);
      return { success: false, error: "Error al verificar el límite de productos" };
    }

    if (count && count >= 30) {
      return { success: false, error: "Has alcanzado el límite máximo de 30 productos" };
    }

    await ensureCategoryExists(supabase, payload.category);

    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error) {
      logger.error("createProduct", "Error creating product", error);
      return { success: false, error: error.message };
    }

    revalidateAll();

    return { success: true, data };
  } catch (error) {
    logger.error("createProduct", "Unexpected error creating product", error);
    return { success: false, error: "Error inesperado al crear producto" };
  }
}

export async function updateProduct(
  id: string,
  payload: ProductUpdate,
): Promise<ActionResult<Product>> {
  const user = await getCurrentUser();
  if (!user) {
    logger.warn(
      "updateProduct",
      `Unauthorized attempt to update product ${id}`,
    );
    return { success: false, error: "No autorizado" };
  }

  if (!isValidUUID(id)) {
    logger.warn("updateProduct", `Invalid product id: ${id}`);
    return { success: false, error: "ID de producto inválido" };
  }

  const validationError = validateProductPayload(payload, false);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = await createClient();

    // Leer image_url actual antes de actualizar
    const { data: currentProduct, error: fetchError } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      logger.error("updateProduct", `Error fetching product ${id} before update`, fetchError);
      return { success: false, error: fetchError.message };
    }

    await ensureCategoryExists(supabase, payload.category);

    const { data, error } = await supabase
      .from("products")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("updateProduct", `Error updating product ${id}`, error);
      return { success: false, error: error.message };
    }

    // Eliminar imagen anterior si cambió y pertenece a product-images
    const oldImageUrl = currentProduct?.image_url;
    const newImageUrl = payload.image_url;

    if (
      oldImageUrl &&
      newImageUrl !== undefined &&
      oldImageUrl !== newImageUrl
    ) {
      const imageResult = await deleteProductImage(oldImageUrl);
      if (!imageResult.success) {
        logger.error(
          "updateProduct",
          `Error deleting old image for product ${id}`,
          imageResult.error,
        );
      }
    }

    revalidateAll();
    revalidateProductDetail(id);

    return { success: true, data };
  } catch (error) {
    logger.error(
      "updateProduct",
      `Unexpected error updating product ${id}`,
      error,
    );
    return { success: false, error: "Error inesperado al actualizar producto" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    logger.warn(
      "deleteProduct",
      `Unauthorized attempt to delete product ${id}`,
    );
    return { success: false, error: "No autorizado" };
  }

  if (!isValidUUID(id)) {
    logger.warn("deleteProduct", `Invalid product id: ${id}`);
    return { success: false, error: "ID de producto inválido" };
  }

  try {
    const supabase = await createClient();

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      logger.error(
        "deleteProduct",
        `Error fetching product ${id} before delete`,
        fetchError,
      );
      return { success: false, error: fetchError.message };
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      logger.error("deleteProduct", `Error deleting product ${id}`, error);
      return { success: false, error: error.message };
    }

    if (product?.image_url) {
      const imageResult = await deleteProductImage(product.image_url);
      if (!imageResult.success) {
        logger.error(
          "deleteProduct",
          `Error deleting image for product ${id}`,
          imageResult.error,
        );
      }
    }

    revalidateAll();
    revalidateProductDetail(id);

    return { success: true, data: undefined };
  } catch (error) {
    logger.error(
      "deleteProduct",
      `Unexpected error deleting product ${id}`,
      error,
    );
    return { success: false, error: "Error inesperado al eliminar producto" };
  }
}
