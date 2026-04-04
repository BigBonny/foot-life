'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after sign out
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <LogOut className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2" suppressHydrationWarning>
            Déconnexion en cours...
          </h1>
          <p className="text-gray-600 mb-6" suppressHydrationWarning>
            Vous allez être redirigé vers la page d'accueil.
          </p>
          
          <Button 
            onClick={() => router.push('/sign-in')}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter maintenant
          </Button>
          
          <p className="text-sm text-gray-500 mt-4" suppressHydrationWarning>
            Ou patientez, redirection automatique...
          </p>
        </div>
      </div>
    </div>
  )
}
