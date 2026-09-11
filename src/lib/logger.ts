type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  meta?: unknown;
}

function normalizeError(error: unknown): unknown {
  // Los errores de Supabase (PostgrestError, AuthError, StorageError) extienden
  // Error pero implementan su propio `toJSON`, así que `JSON.stringify` ya los
  // serializa correctamente. Solo normalizamos instancias de Error "genéricas"
  // (sin toJSON propio), donde JSON.stringify(error) produciría `{}`.
  if (error instanceof Error && typeof (error as { toJSON?: unknown }).toJSON !== "function") {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return error;
}

function log(
  level: LogLevel,
  context: string,
  message: string,
  error?: unknown,
) {
  if (typeof window !== "undefined") return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    ...(error ? { meta: normalizeError(error) } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (context: string, message: string) => log("info", context, message),
  warn: (context: string, message: string, error?: unknown) =>
    log("warn", context, message, error),
  error: (context: string, message: string, error?: unknown) =>
    log("error", context, message, error),
};
