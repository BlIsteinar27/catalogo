import { NextRequest, NextResponse } from "next/server";
import { pingSupabase } from "@/server/keepalive";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logger.error("keepalive", "CRON_SECRET no está configurado en el entorno");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("keepalive", "Unauthorized keepalive request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pingSupabase();
  if (!result.ok) {
    logger.error("keepalive", "Supabase ping failed", result.message);
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
