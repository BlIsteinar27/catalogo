"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { getCategoryList } from "@/server/categories";
import type { Product } from "@/lib/supabase/types";

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("getProducts", "Error fetching products", error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error("getProducts", "Unexpected error fetching products", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isValidUUID(id)) {
    logger.warn("getProductById", `Invalid product id: ${id}`);
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      logger.error("getProductById", `Error fetching product ${id}`, error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error(
      "getProductById",
      `Unexpected error fetching product ${id}`,
      error,
    );
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  const categories = await getCategoryList();
  return categories.map((c) => c.name);
}
