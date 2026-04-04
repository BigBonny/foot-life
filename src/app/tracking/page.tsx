'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Search } from 'lucide-react'

export default function TrackingPage() {
  const { isSignedIn } = useUser()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!trackingNumber) {
      alert('Veuillez entrer un numéro de suivi')
      return
    }

    setLoading(true)
    
    try {
      // Here you would fetch from your backend
      const response = await fetch(`/api/tracking/${trackingNumber}`)
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        alert('Numéro de suivi non trouvé')
      }
    } catch (error) {
      console.error('Tracking error:', error)
      alert('Erreur lors du suivi de votre commande')
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600">Veuillez vous connecter pour suivre votre commande.</p>
          <Button asChild>
            <a href="/sign-in">Se connecter</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Suivre votre commande</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  Suivi de commande
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de suivi
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Entrez votre numéro de suivi"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button 
                        onClick={handleTrack}
                        disabled={loading}
                        className="px-4 py-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status */}
          <div className="lg:col-span-2">
            {order ? (
              <Card>
                <CardHeader>
                  <CardTitle>Statut de la commande</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Numéro de suivi</p>
                        <p className="font-bold">{order.trackingNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'delivered' ? 'Livré' :
                           order.status === 'shipped' ? 'Expédié' :
                           order.status === 'processing' ? 'En traitement' :
                           order.status === 'pending' ? 'En attente' : 'Inconnu'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Détails de la commande</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date de commande:</span>
                          <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut actuel:</span>
                          <span className="font-medium capitalize">{order.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">{order.total.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucune commande trouvée
                  </h3>
                  <p className="text-gray-600">
                    Vérifiez votre numéro de suivi et réessayez.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
