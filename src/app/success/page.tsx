'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ShoppingBag } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="text-center max-w-md w-full mx-auto px-4">
        <Card>
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Paiement réussi !
            </h1>
            
            <p className="text-gray-600 mb-6">
              Merci pour votre commande. Votre paiement a été traité avec succès.
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              Vous allez être redirigé vers la page d'accueil dans quelques instants...
            </p>
            
            <div className="space-y-4">
              <Button className="w-full" asChild>
                <a href="/orders">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Voir mes commandes
                </a>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <a href="/">
                  Continuer mes achats
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
