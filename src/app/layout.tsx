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
  title: {
    default: 'Prime Kicks - Maillots de Football Premium',
    template: '%s | Prime Kicks'
  },
  description: 'Découvrez notre collection premium de maillots de football des plus grands clubs européens et équipes nationales. Qualité exceptionnelle, livraison rapide, prix compétitifs.',
  keywords: ['maillots football', 'jerseys football', 'maillots clubs', 'maillots nationaux', 'Prime Kicks', 'football premium', 'maillots qualité'],
  authors: [{ name: 'Prime Kicks' }],
  creator: 'Prime Kicks',
  publisher: 'Prime Kicks',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://primekicks.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/fr',
      'en': '/en'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://primekicks.com',
    title: 'Prime Kicks - Maillots de Football Premium',
    description: 'Découvrez notre collection premium de maillots de football des plus grands clubs européens et équipes nationales.',
    siteName: 'Prime Kicks',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Prime Kicks - Maillots de Football Premium'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Kicks - Maillots de Football Premium',
    description: 'Découvrez notre collection premium de maillots de football des plus grands clubs européens et équipes nationales.',
    images: ['/banner.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/primekicks-logo.png',
    shortcut: '/primekicks-logo.png',
    apple: '/primekicks-logo.png',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code'
  }
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
