'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-v2'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, CreditCard, User, Mail, Phone, MapPin, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'

export default function CheckoutPage() {
  const { isSignedIn, user } = useUser()
  const { items, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  
  // Guest information form
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  })
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  const handleGuestInfoChange = (field: string, value: string) => {
    setGuestInfo(prev => ({ ...prev, [field]: value }))
  }

  const validateGuestInfo = () => {
    if (!guestInfo.email || !guestInfo.firstName || !guestInfo.lastName || !guestInfo.phone || !guestInfo.address || !guestInfo.city || !guestInfo.postalCode) {
      toast({
        title: 'Information manquante',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  const applyPromoCode = () => {
    // Buy 3 Get 1 Free offer logic
    if (promoCode.toLowerCase() === 'yassou4') {
      setDiscount(0.25) // Free 4th jersey (25% off)
      setPromoApplied(true)
    } else {
      setDiscount(0)
      setPromoApplied(false)
    }
  }

  const getTotalWithDiscount = () => {
    const subtotal = getTotalPrice()
    return subtotal * (1 - discount)
  }

  const getDiscountAmount = () => {
    return getTotalPrice() * discount
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: 'Panier vide',
        description: 'Votre panier est vide.',
        variant: 'destructive',
      })
      return
    }

    // If guest, validate info first
    if (!isSignedIn && !validateGuestInfo()) {
      return
    }

    setLoading(true)

    try {
      // Call Stripe checkout API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo: isSignedIn ? {
            email: user?.emailAddresses?.[0]?.emailAddress,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: '',
          } : {
            email: guestInfo.email,
            firstName: guestInfo.firstName,
            lastName: guestInfo.lastName,
            phone: guestInfo.phone,
          },
          total: getTotalPrice(),
          userId: isSignedIn ? user?.id : undefined,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        if (url) {
          // Also save to database before redirecting
          if (isSignedIn && user) {
            await supabase
              .from('orders')
              .insert({
                user_id: user.id,
                items: items,
                total: getTotalPrice(),
                status: 'pending',
                created_at: new Date().toISOString(),
              })
          } else {
            await supabase
              .from('guest_orders')
              .insert({
                email: guestInfo.email,
                first_name: guestInfo.firstName,
                last_name: guestInfo.lastName,
                phone: guestInfo.phone,
                address: guestInfo.address,
                city: guestInfo.city,
                postal_code: guestInfo.postalCode,
                country: guestInfo.country,
                cart_items: items,
                total_amount: getTotalPrice(),
                status: 'pending',
                created_at: new Date().toISOString(),
              })
          }
          
          // Redirect to Stripe
          window.location.href = url
        } else {
          throw new Error('No checkout URL returned')
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Payment failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors du paiement.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  console.log('Checkout page - User:', user?.id)
  console.log('Checkout page - Items:', items)
  console.log('Checkout page - Is signed in:', isSignedIn)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-8">Votre panier est vide. Ajoutez des articles avant de continuer.</p>
          <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <a href="/products">Voir les produits</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Finaliser la commande</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          {isSignedIn ? 'Complétez votre commande' : 'Commande en tant qu\'invité'}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
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
                    <p className="font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{getTotalPrice().toFixed(2)} €</span>
                  </div>
                  
                  {/* Discount Applied */}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Réduction ({Math.round(discount * 100)}%)</span>
                      <span>-{getDiscountAmount().toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total avec réduction</span>
                    <span className="text-green-600">{getTotalWithDiscount().toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo Code Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Code Promo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code Promo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Entrez votre code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      onClick={applyPromoCode}
                      disabled={!promoCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
                {promoApplied && (
                  <div className="text-green-600 text-sm font-medium">
                    ✓ Code promo appliqué! 4ème maillot offert
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {isSignedIn ? 'Informations de paiement' : 'Informations personnelles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isSignedIn && (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    Vous n'êtes pas connecté. Remplissez vos informations ci-dessous pour finaliser votre commande en tant qu'invité.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {!isSignedIn && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Prénom *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={guestInfo.firstName}
                            onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
                            className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="Jean"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nom *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={guestInfo.lastName}
                            onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
                            className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="Dupont"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                          className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="jean.dupont@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Téléphone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                          className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={guestInfo.address}
                          onChange={(e) => handleGuestInfoChange('address', e.target.value)}
                          className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="123 rue de Paris"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ville *</label>
                        <input
                          type="text"
                          value={guestInfo.city}
                          onChange={(e) => handleGuestInfoChange('city', e.target.value)}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Code postal *</label>
                        <input
                          type="text"
                          value={guestInfo.postalCode}
                          onChange={(e) => handleGuestInfoChange('postalCode', e.target.value)}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="75001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Pays</label>
                      <input
                        type="text"
                        value={guestInfo.country}
                        onChange={(e) => handleGuestInfoChange('country', e.target.value)}
                        className="w-full p-2 border rounded bg-gray-100"
                        disabled
                      />
                    </div>
                  </>
                )}

                {isSignedIn && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">
                      Connecté en tant que: <span className="font-semibold">{user?.emailAddresses?.[0]?.emailAddress}</span>
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg mt-4"
                >
                  {loading ? 'Traitement...' : `Payer ${getTotalWithDiscount().toFixed(2)} €`}
                </Button>

                {!isSignedIn && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Déjà un compte?</p>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/sign-in">Se connecter</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
