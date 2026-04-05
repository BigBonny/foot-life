'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { toast } from '@/components/ui/use-toast'
import { Search, Filter, ShoppingBag, Heart, Eye, Sparkles, Shirt, Globe } from 'lucide-react'
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

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.team?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
      // Also set filtered products initially
      setFilteredProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les produits.',
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
      color: 'Bleu',
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
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="bg-blue-100 rounded-full p-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Tous nos maillots
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection complète de maillots de football authentiques
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-12 flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un produit, une équipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg transition-all duration-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={`px-4 sm:px-6 py-4 sm:py-6 rounded-xl font-semibold text-sm sm:text-base whitespace-nowrap ${
                  selectedCategory === 'all' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg' 
                    : 'border-2 border-gray-200 hover:border-blue-500'
                }`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Tous
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedCategory === 'club' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('club')}
                className={`px-4 sm:px-6 py-4 sm:py-6 rounded-xl font-semibold text-sm sm:text-base whitespace-nowrap ${
                  selectedCategory === 'club' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg' 
                    : 'border-2 border-gray-200 hover:border-blue-500'
                }`}
              >
                <Shirt className="h-4 w-4 mr-2" />
                Clubs
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedCategory === 'national' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('national')}
                className={`px-4 sm:px-6 py-4 sm:py-6 rounded-xl font-semibold text-sm sm:text-base whitespace-nowrap ${
                  selectedCategory === 'national' 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 shadow-lg' 
                    : 'border-2 border-gray-200 hover:border-green-500'
                }`}
              >
                <Globe className="h-4 w-4 mr-2" />
                Nationaux
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
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
                <Filter className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Essayez de modifier vos filtres de recherche.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="px-8 py-4 rounded-xl text-lg font-semibold"
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {filteredProducts.map((product) => (
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
                      
                      {product.category === 'national' && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          National
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                      <CardDescription>
                        {product.team && `${product.team} • `}
                        {product.category === 'club' ? 'Club' : 'Équipe nationale'}
                        {product.season && ` • ${product.season}`}
                      </CardDescription>
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
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`rounded-xl px-4 py-2 font-semibold ${
                              product.stock === 0 
                                ? 'bg-gray-300 text-gray-500' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                            }`}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            {product.stock === 0 ? 'Rupture' : 'Ajouter'}
                          </Button>
                        </motion.div>
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
