'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-v2'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, CreditCard } from 'lucide-react'

export default function CheckoutPage() {
  const { isSignedIn, user } = useUser()
  const { items, getTotalPrice } = useCart()
  const [loading, setLoading] = useState(false)

  console.log('Checkout page - User:', user?.id)
  console.log('Checkout page - Items:', items)
  console.log('Checkout page - Is signed in:', isSignedIn)

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-8">Veuillez vous connecter pour finaliser votre commande.</p>
          <Button asChild>
            <a href="/sign-in">Se connecter</a>
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-8">Votre panier est vide. Ajoutez des articles avant de continuer.</p>
          <Button asChild>
            <a href="/products">Voir les produits</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Finaliser la commande</h1>
          <p className="text-xl text-gray-600">Complétez vos informations pour finaliser l'achat</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Récapitulatif de la commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Taille: {item.size} | Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{getTotalPrice().toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Informations de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.emailAddresses?.[0]?.emailAddress || ''}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="Nom"
                    />
                  </div>
                </div>

                <Button 
                  onClick={async () => {
                    setLoading(true)
                    try {
                      const response = await fetch('/api/create-checkout-session', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          items,
                          customerInfo: {
                            email: user?.emailAddresses?.[0]?.emailAddress || '',
                            firstName: 'Test',
                            lastName: 'User',
                            phone: '',
                            street: '',
                            city: '',
                            postalCode: '',
                            country: 'France',
                          },
                          total: getTotalPrice(),
                          userId: user?.id,
                        }),
                      })

                      if (response.ok) {
                        const { url } = await response.json()
                        window.location.href = url
                      } else {
                        throw new Error('Payment failed')
                      }
                    } catch (error) {
                      console.error('Checkout error:', error)
                      alert('Erreur de paiement')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="w-full py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : 'Payer avec Stripe'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
