"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/supabase/types";

export async function sendMagicLink(email: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });
    if (error) {
      logger.error("sendMagicLink", "Error sending magic link", error);
      return { success: false, error: error.message };
    }
    return { success: true, data: undefined };
  } catch (error) {
    logger.error("sendMagicLink", "Unexpected error sending magic link", error);
    return { success: false, error: "Error inesperado al enviar el enlace" };
  }
}

export async function signUp(email: string, password: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      logger.error("signUp", "Error signing up", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (error) {
    logger.error("signUp", "Unexpected error", error);
    return { success: false, error: "Error inesperado al registrarse" };
  }
}

export async function signInWithPassword(email: string, password: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error("signInWithPassword", "Error signing in", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error) {
    logger.error("signInWithPassword", "Unexpected error", error);
    return { success: false, error: "Error inesperado al iniciar sesión" };
  }
}

export async function signOut(): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error("signOut", "Error signing out", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error) {
    logger.error("signOut", "Unexpected error", error);
    return { success: false, error: "Error inesperado al cerrar sesión" };
  }
}
