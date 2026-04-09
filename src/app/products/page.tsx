'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { toast } from '@/components/ui/use-toast'
import { Search, Filter, ShoppingBag, Heart, Eye, Sparkles, Shirt, Globe, Truck } from 'lucide-react'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'club' | 'national'>('all')
  const { addItem } = useCart()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les produits',
          variant: 'destructive',
        })
      } else {
        setProducts(data || [])
        setFilteredProducts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (selectedCategory === 'all') return matchesSearch
      
      if (selectedCategory === 'club') return matchesSearch && product.category === 'club'
      
      if (selectedCategory === 'national') return matchesSearch && product.category === 'national'
      
      return false
    })
    
    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-white py-12">
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

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un maillot..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Tous
                </Button>
                <Button
                  variant={selectedCategory === 'club' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('club')}
                  className="flex items-center gap-2"
                >
                  <Shirt className="h-4 w-4" />
                  Clubs
                </Button>
                <Button
                  variant={selectedCategory === 'national' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('national')}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Nationaux
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div 
                className="col-span-full text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 font-medium">Aucun produit trouvé</p>
              </motion.div>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  <Card className="border-0 shadow-none">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        {/* Delivery Badge */}
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            <Truck className="h-3 w-3 mr-1" />
                            8-12 jours
                          </div>
                        </div>

                        {/* Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <Button
                              size="sm"
                              className="bg-white text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg font-medium flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  size: 'M',
                                  color: product.colors?.[0] || 'Multicolor',
                                  quantity: 1,
                                })
                              }}
                            >
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Ajouter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg font-medium"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Add to wishlist logic here
                              }}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-bold text-gray-900 mb-4">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Voir les détails</span>
                        </div>
                        <div className="text-xl font-black text-gray-900">
                          {product.price.toFixed(2)} €
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}