import { logger } from "@/lib/logger";

export async function pingSupabase(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("products").select("id").limit(1);
    if (error) {
      logger.error("pingSupabase", "Supabase ping failed", error);
      return { ok: false, message: error.message };
    }
    return { ok: true, message: `Ping OK @ ${new Date().toISOString()}` };
  } catch (error) {
    logger.error("pingSupabase", "Unexpected ping error", error);
    return { ok: false, message: "Unexpected error" };
  }
}
