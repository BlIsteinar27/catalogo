"use server";

import { getCurrentUser } from "@/lib/auth";
import { validateFile, ERROR_MESSAGES } from "@/lib/validations";
import { logger } from "@/lib/logger";
import type { ActionResult } from "@/lib/supabase/types";

export async function uploadProductImage(
  formData: FormData,
): Promise<ActionResult<string>> {
  const user = await getCurrentUser();
  if (!user) {
    logger.warn("uploadProductImage", "Unauthorized attempt to upload image");
    return { success: false, error: "No autorizado" };
  }

  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, error: ERROR_MESSAGES.FILE_NO_SELECTED };
  }

  const validationError = validateFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const ext = file.name
    .split(".")
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!ext) {
    return { success: false, error: ERROR_MESSAGES.FILE_INVALID_EXTENSION };
  }

  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  const filename = `${timestamp}-${random}.${ext}`;

  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = createServiceClient();

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filename, file, { contentType: file.type, upsert: false });

    if (error) {
      logger.error("uploadProductImage", "Error uploading image", error);
      return { success: false, error: error.message };
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filename);
    return { success: true, data: data.publicUrl };
  } catch (error) {
    logger.error(
      "uploadProductImage",
      "Unexpected error uploading image",
      error,
    );
    return { success: false, error: "Error inesperado al subir imagen" };
  }
}

export async function deleteProductImage(
  imageUrl: string,
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.warn("deleteProductImage", "Unauthorized attempt to delete image");
      return { success: false, error: "No autorizado" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!baseUrl) {
      logger.error("deleteProductImage", "NEXT_PUBLIC_SUPABASE_URL is not set");
      return { success: false, error: "Configuración de storage incompleta" };
    }

    const parsedUrl = new URL(imageUrl);
    const expectedPath = "/storage/v1/object/public/product-images/";
    if (!parsedUrl.pathname.startsWith(expectedPath)) {
      logger.warn("deleteProductImage", `Image URL does not belong to product-images bucket: ${imageUrl}`);
      return { success: false, error: "URL de imagen inválida" };
    }

    const filename = parsedUrl.pathname.split("/").pop();
    if (!filename || filename.includes("/") || filename === ".." || filename === ".") {
      logger.warn("deleteProductImage", `Invalid image filename: ${imageUrl}`);
      return { success: false, error: "URL de imagen inválida" };
    }

    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = createServiceClient();

    const { error } = await supabase.storage
      .from("product-images")
      .remove([filename]);

    if (error) {
      logger.error("deleteProductImage", "Error deleting image", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (error) {
    logger.error(
      "deleteProductImage",
      "Unexpected error deleting image",
      error,
    );
    return { success: false, error: "Error inesperado al eliminar imagen" };
  }
}
