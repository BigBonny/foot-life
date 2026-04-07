import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { NavigationFinal } from '@/components/navigation-final'
import { Footer } from '@/components/enhanced-footer'
import { Toaster } from '@/components/ui/toaster'
import { CartSyncV2 } from '@/components/cart-sync-v2'
import { UserSyncClient } from '@/components/user-sync-client'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Prime Kicks - Maillots de Football Premium',
  description: 'Boutique spécialisée dans les maillots de football des plus grands clubs et équipes nationales',
  icons: {
    icon: '/primekicks-logo.png',
    shortcut: '/primekicks-logo.png',
    apple: '/primekicks-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-gray-50`}>
          <UserSyncClient />
          <NavigationFinal />
          <CartSyncV2 />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
