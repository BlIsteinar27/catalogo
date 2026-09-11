import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DM_Sans, Fraunces } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { CartShell } from '@/components/cart/cart-shell'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <CartProvider>
          {children}
          <Suspense fallback={null}>
            <CartShell />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  )
}
