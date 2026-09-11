/**
 * Configuración centralizada del negocio desde variables de entorno
 * Permite personalización sin tocar código
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Mi Catálogo",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Catálogo de productos en línea",
  logoUrl: process.env.NEXT_PUBLIC_SITE_LOGO_URL || null,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  defaultCurrency: (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY as "USD" | "EUR") || "USD",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
