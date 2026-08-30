import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { ContactModal } from '@/components/contact-modal'
import { PerfumeDetailModal } from '@/components/perfume-detail-modal'
import { CartProvider } from '@/components/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import './globals.css'

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const body = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'ML Decants | Alta Perfumería en Formato Exclusivo',
  description:
    'Catálogo de fragancias de autor en decants de 3ml, 5ml y 10ml. Filtra por temporada (invierno, verano) y momento (día, noche).',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/logo.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#20180f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`bg-background ${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <ContactModal />
          <PerfumeDetailModal />
          <CartDrawer />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
