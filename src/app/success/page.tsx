'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/use-cart-v2'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ShoppingBag, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [orderCreated, setOrderCreated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Clear the cart
        clearCart()
        
        // Verify order was created (optional - webhook handles this)
        if (sessionId) {
          const { data } = await supabase
            .from('orders')
            .select('*')
            .eq('stripe_session_id', sessionId)
            .single()
          
          if (data) {
            setOrderCreated(true)
          }
        }
      } catch (error) {
        console.error('Error handling success:', error)
      } finally {
        setLoading(false)
      }
    }

    handleSuccess()
  }, [sessionId, clearCart])

  useEffect(() => {
    // Auto-redirect after 5 seconds (increased from 3)
    if (!loading) {
      const timer = setTimeout(() => {
        router.push('/orders')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [router, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Traitement de votre commande...</p>
        </div>
      </div>
    )
  }

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
            
            {orderCreated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-medium">Commande créée avec succès</span>
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-8">
              Vous allez être redirigé vers vos commandes dans quelques instants...
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
