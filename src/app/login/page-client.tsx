"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signInWithPassword } from "@/server/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type Mode = "signin" | "signup";

export function LoginClient({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: urlError } = use(searchParams);
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result =
      mode === "signin"
        ? await signInWithPassword(email, password)
        : await signUp(email, password);

    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-canvas">
      <div className="w-full max-w-sm rounded-xl border border-glass-border bg-glass p-8 shadow-glass backdrop-blur-md">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">
            Panel Admin
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {mode === "signin"
              ? "Inicia sesión para acceder"
              : "Crea tu cuenta"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ejemplo.com"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-ink-secondary"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-10 w-full rounded-md border border-border-strong bg-surface px-3 pr-10 text-sm text-ink placeholder:text-ink-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
          </Button>
        </form>
        {/* Temporalmente comentado - modo single admin
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError(null)
            }}
            className="text-sm text-ink-secondary hover:text-ink"
          >
            {mode === 'signin'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
        */}
        <div className="mt-4 rounded-md bg-surface-elevated p-3 text-center">
          <p className="text-xs font-medium text-ink-secondary">
            Credenciales de prueba:
          </p>
          <p className="mt-1 text-sm text-ink">
            Email: <span className="font-mono">test@test.com</span>
          </p>
          <p className="text-sm text-ink">
            Password: <span className="font-mono">test123456</span>
          </p>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            Ver catálogo público
          </Link>
        </div>
      </div>
    </div>
  );
}
