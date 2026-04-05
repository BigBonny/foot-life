import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/enhanced-footer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

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
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
