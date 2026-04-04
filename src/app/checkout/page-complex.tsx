'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-final'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { ShoppingBag, CreditCard, Truck, User, Lock, Shield, Sparkles, ArrowRight } from 'lucide-react'

export default function CheckoutPage() {
  const { isSignedIn, user } = useUser()
  const { items, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour continuer.',
        variant: 'destructive',
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: 'Panier vide',
        description: 'Votre panier est vide. Ajoutez des articles avant de continuer.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // Here you would integrate with Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo: formData,
          total: getTotalPrice(),
          userId: user?.id, // Add user ID
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
      toast({
        title: 'Erreur de paiement',
        description: 'Une erreur est survenue lors du traitement de votre paiement.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Lock className="h-12 w-12 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-8 text-lg">Veuillez vous connecter pour finaliser votre commande.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild className="px-8 py-4 rounded-xl text-lg font-semibold">
              <a href="/sign-in">Se connecter</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-3">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Finaliser la commande
          </h1>
          <p className="text-xl text-gray-600">
            Vous y êtes presque ! Complétez vos informations pour finaliser l'achat
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <CardTitle className="text-white flex items-center text-xl">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Récapitulatif de la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div 
                      key={`${item.id}-${item.size}`} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Taille: {item.size} • Quantité: {item.quantity}
                        </p>
                        <p className="text-xl font-black text-blue-600">{(item.price * item.quantity).toFixed(2)} €</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between text-2xl font-black">
                      <span>Total</span>
                      <span className="text-blue-600">{getTotalPrice().toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Info */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="text-white flex items-center text-xl">
                  <User className="h-5 w-5 mr-2" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Prénom"
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }}>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nom"
                      />
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="123 rue du Football"
                    />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Paris"
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }}>
                      <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="75001"
                      />
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Pays *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </motion.div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 py-4 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-green-500" />
                      Paiement sécurisé
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1 text-blue-500" />
                      Livraison rapide
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      disabled={loading || items.length === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          Payer {getTotalPrice().toFixed(2)} €
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Livraison Rapide</h3>
            <p className="text-sm text-gray-600">48-72h en France</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Paiement Sécurisé</h3>
            <p className="text-sm text-gray-600">SSL 256-bit</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ShoppingBag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Retour Facile</h3>
            <p className="text-sm text-gray-600">30 jours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
