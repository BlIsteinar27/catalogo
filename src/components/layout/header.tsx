"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { siteConfig } from "@/lib/site-config";

const MotionLink = motion(Link);

export function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-glass-border bg-glass/80 backdrop-blur-md shadow-sm">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
      >
        <MotionLink
          href="/"
          className="font-display text-xl font-bold text-ink"
          whileHover={{ color: "var(--color-brand)" }}
          transition={{ duration: 0.2 }}
        >
          {siteConfig.logoUrl ? (
            <img
              src={siteConfig.logoUrl}
              alt={siteConfig.name}
              className="h-8 w-auto"
            />
          ) : (
            siteConfig.name
          )}
        </MotionLink>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <MotionLink
              href="/dashboard"
              className="rounded-lg bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
              whileHover={{ opacity: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              Dashboard
            </MotionLink>
          ) : (
            <MotionLink
              href="/login"
              className="rounded-lg border border-glass-border bg-glass px-3 py-1.5 text-xs font-semibold text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              whileHover={{
                backgroundColor: "var(--color-surface-elevated)",
                color: "var(--color-ink)",
              }}
              transition={{ duration: 0.2 }}
            >
              Iniciar sesión
            </MotionLink>
          )}
        </div>
      </nav>
    </header>
  );
}
