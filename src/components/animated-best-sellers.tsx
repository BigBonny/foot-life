'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { toast } from '@/components/ui/use-toast'
import { Star, TrendingUp, ShoppingBag, Heart, Eye } from 'lucide-react'
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

export function AnimatedBestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    fetchBestSellers()
  }, [])

  const fetchBestSellers = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gte('stock', 5)
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching best sellers:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les meilleures ventes.',
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

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="bg-red-100 rounded-full p-4">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Meilleures Ventes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Les maillots de football les plus populaires du moment
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <motion.div
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">Aucun produit disponible</p>
            <Button asChild>
              <a href="/products">Voir tous les produits</a>
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Link href={`/products/${product.id}`}>
                  <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <div className="aspect-square overflow-hidden relative">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* Overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          className="flex gap-2"
                        >
                          <Button size="sm" variant="secondary" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                          <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/40">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </motion.div>
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
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <motion.p 
                          className="text-3xl font-black text-blue-600"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {product.price.toFixed(2)} €
                        </motion.p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">(124)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              asChild
            >
              <a href="/best-sellers">
                Voir toutes les meilleures ventes
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
