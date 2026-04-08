'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-v2'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  custom_name?: string
  custom_number?: number
}

export default function CartPage() {
  const { isSignedIn, user } = useUser()
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  const applyPromoCode = () => {
    // Buy 3 Get 1 Free offer logic - works with 4 total items (counting duplicates)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    console.log('Applying promo code:', promoCode, 'Items in cart:', items.length, 'Total quantity:', totalItems, 'Discount:', discount)
    
    if (totalItems >= 4 && promoCode.toLowerCase() === 'yassou4') {
      setDiscount(0.25) // Free 4th jersey (25% off)
      setPromoApplied(true)
      toast({
        title: 'Code promo appliqué!',
        description: '4ème maillot offert avec le code YASSOU4',
      })
    } else {
      setDiscount(0)
      setPromoApplied(false)
      if (promoCode.trim()) {
        toast({
          title: 'Code promo invalide',
          description: 'Ce code n\'est pas valide ou vous n\'avez pas assez d\'articles.',
          variant: 'destructive',
        })
      }
    }
  }

  const getTotalWithDiscount = () => {
    const subtotal = getTotalPrice()
    return subtotal * (1 - discount)
  }

  const getDiscountAmount = () => {
    return getTotalPrice() * discount
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black mb-4">Mon Panier</h1>
          <p className="text-gray-600 mb-8">
            {items.length === 0 ? 'Votre panier est vide' : `${items.length} article${items.length > 1 ? 's' : ''} dans votre panier`}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-8 mx-auto">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez notre collection et ajoutez vos{' '}
              <Link href="/products" className="text-blue-600 hover:underline">
                maillots préférés
              </Link>
              .
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                <Link href="/products" className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Voir les produits
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 100px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          {item.custom_name && (
                            <p className="text-sm text-blue-600 mb-1">
                              ({item.custom_name} #{item.custom_number})
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mb-1">
                            Taille: {item.size}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Couleur: {item.color}
                          </p>
                          <p className="text-lg sm:text-xl font-black text-blue-600">
                            {item.price.toFixed(2)} €
                          </p>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center space-x-4 sm:space-x-0 sm:space-y-2">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </motion.button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </motion.button>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeItem(item.id, item.size, item.color)}
                            className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Promo Code Section */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
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
            </div>

            {/* Cart Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Sous-total</span>
                    <span className="text-blue-600">{getTotalPrice().toFixed(2)} €</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Réduction ({Math.round(discount * 100)}%)</span>
                      <span>-{getDiscountAmount().toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">{getTotalWithDiscount().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Articles</span>
                    <span>{items.length}</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={() => window.location.href = '/checkout'}
                    className="w-full py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg mt-4"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Procéder au checkout
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
