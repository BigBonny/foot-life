'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { toast } from '@/components/ui/use-toast'
import { Trophy, Calendar, Sparkles, ShoppingBag, Heart, Eye, Truck, Search } from 'lucide-react'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

export default function WorldCupPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    fetchWorldCupProducts()
  }, [])

  const fetchWorldCupProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('name.ilike.%world cup%,name.ilike.%Coupe du Monde%,category.eq."national"')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching World Cup products:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les produits Coupe du Monde.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: 'M',
      color: 'Default',
      quantity: 1,
    })
    toast({
      title: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xl text-gray-600 font-medium">Chargement des produits...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Hero Section with Banner */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="/banner.png" 
            alt="Prime Kicks Banner"
            className="w-full h-96 md:h-[40rem] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black-80 flex items-end justify-center pb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById('products-grid')
                if (element) {
                  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80
                  const startPosition = window.pageYOffset
                  const distance = targetPosition - startPosition
                  const duration = 800
                  let start: number | null = null

                  const animation = (currentTime: number) => {
                    if (start === null) start = currentTime
                    const timeElapsed = currentTime - start
                    const progress = Math.min(timeElapsed / duration, 1)
                    const easeInOutCubic = progress < 0.5
                      ? 4 * progress * progress * progress
                      : 1 - Math.pow(-2 * progress + 2, 3) / 2

                    window.scrollTo(0, startPosition + distance * easeInOutCubic)

                    if (timeElapsed < duration) {
                      requestAnimationFrame(animation)
                    }
                  }

                  requestAnimationFrame(animation)
                }
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Découvrir Nos Produits
            </motion.button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un maillot..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {products.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun produit disponible
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Nos produits Coupe du Monde seront bientôt disponibles. Revenez vite !
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700">
                  <a href="/products">Voir tous les produits</a>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              id="products-grid"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <Link href={`/products/${product.id}`}>
                    <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl cursor-pointer">
                    <div className="aspect-square overflow-hidden relative">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* World Cup & National Badges */}
                      {(product.name.toLowerCase().includes('world cup') || product.name.toLowerCase().includes('coupe du monde')) && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
                          <Trophy className="h-3 w-3 mr-1" />
                          World Cup
                        </div>
                      )}
                      {product.category === 'national' && !product.name.toLowerCase().includes('world cup') && !product.name.toLowerCase().includes('coupe du monde') && (
                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                          National
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex-1">
                              <Button size="sm" variant="secondary" className="w-full bg-white/90 hover:bg-white text-gray-900">
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/40 text-white">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <motion.p 
                            className="text-3xl font-black text-blue-600"
                            whileHover={{ scale: 1.05 }}
                          >
                            {product.price.toFixed(2)} €
                          </motion.p>
                          <p className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mt-1">
                            <Truck className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-xs text-green-600 font-medium">8-12 jours</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
