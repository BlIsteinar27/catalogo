import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

function validateRedirect(path: string | null): string {
  const fallback = "/dashboard";
  if (!path) return fallback;

  // Rechazar URLs absolutas, traversal, null bytes, CRLF, backslashes y atacantes comunes
  if (
    path.startsWith("//") ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.includes("\\") ||
    path.includes("../") ||
    path.includes("\0") ||
    path.includes("\r") ||
    path.includes("\n") ||
    path.includes("@") ||
    !path.startsWith("/")
  ) {
    return fallback;
  }

  return path;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = validateRedirect(searchParams.get("next"));

  if (!code) {
    logger.warn("auth/callback", "No code provided in callback");
    return NextResponse.redirect(
      `${origin}/login?error=auth&error_description=missing_code`,
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error(
        "auth/callback",
        "Error exchanging code for session",
        error,
      );
      const description = encodeURIComponent(error.message);
      return NextResponse.redirect(
        `${origin}/login?error=auth&error_description=${description}`,
      );
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    logger.error(
      "auth/callback",
      "Unexpected error exchanging code for session",
      error,
    );
    return NextResponse.redirect(new URL("/login?error=server_error", origin));
  }
}
