'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart-final'
import { useFavorites } from '@/hooks/use-favorites'
import { toast } from '@/components/ui/use-toast'
import { ImageCarousel } from '@/components/ui/image-carousel'
import { SizeGuideModal } from '@/components/ui/size-guide-modal'
import { ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, ChevronLeft, Ruler } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductDetailPage() {
  const params = useParams()
  const { user, isSignedIn } = useUser()
  const { addItem } = useCart()
  const { addItem: addToFavorites, isFavorite } = useFavorites()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [customName, setCustomName] = useState('')
  const [customNumber, setCustomNumber] = useState('')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [isPersonalized, setIsPersonalized] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    if (!selectedSize) {
      toast({
        title: 'Sélection requise',
        description: 'Veuillez sélectionner une taille.',
        variant: 'destructive',
      })
      return
    }

    if (isPersonalized && (!customName || !customNumber)) {
      toast({
        title: 'Personnalisation requise',
        description: 'Veuillez entrer un nom et un numéro personnalisés.',
        variant: 'destructive',
      })
      return
    }

    if (isPersonalized && !isSignedIn) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour personnaliser votre maillot.',
        variant: 'destructive',
      })
      return
    }

    try {
      if (isPersonalized) {
        // Save personalized jersey to database
        const { data, error } = await supabase
          .from('personalized_jerseys')
          .insert({
            user_id: user?.id || '',
            product_id: product.id,
            product_name: product.name,
            product_image: product.image,
            product_price: product.price,
            custom_name: customName,
            custom_number: parseInt(customNumber),
            custom_size: selectedSize,
            quantity,
          })
          .select()

        if (error) throw error

        // Add personalized jersey to cart
        addItem({
          id: product.id,
          name: `${product.name} (${customName} #${customNumber})`,
          price: product.price,
          image: product.image,
          quantity,
          size: selectedSize,
          color: 'Default',
        })

        toast({
          title: 'Maillot personnalisé ajouté!',
          description: `${product.name} (${customName} #${customNumber}) a été ajouté à votre panier.`,
        })
      } else {
        // Add regular product to cart
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          size: selectedSize,
          color: 'Default',
        })

        toast({
          title: 'Ajouté au panier!',
          description: `${product.name} (${selectedSize}) a été ajouté à votre panier.`,
        })
      }
    } catch (error) {
      console.error('Error adding personalized jersey:', error)
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      })
    }
  }

  const toggleWishlist = () => {
    if (!product) return
    
    const isCurrentlyFavorited = isFavorite(product.id)
    
    addToFavorites({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      addedAt: new Date().toISOString(),
    })
    
    toast({
      title: isCurrentlyFavorited ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: isCurrentlyFavorited 
        ? 'Le produit a été retiré de vos favoris.'
        : 'Le produit a été ajouté à vos favoris.',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Link href="/products">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux produits
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {product.images ? (
                <ImageCarousel 
                  images={product.images}
                  alt={product.name}
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleWishlist}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
              >
                <Heart 
                  className={`h-5 w-5 ${product && isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8 • 124 avis)</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-blue-600">
                  {product.price.toFixed(2)} €
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {(product.price * 1.3).toFixed(2)} €
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                  -30%
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'Maillot de football de haute qualité avec technologie d\'évacuation de l\'humidité. Tissu respirant et confortable pour une performance optimale sur le terrain.'}
            </p>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Taille</h3>
              <div className="grid grid-cols-4 gap-2">
                {product?.sizes?.map((size: string) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Ruler className="h-4 w-4" />
                Guide des tailles
              </button>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantité</h3>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  -
                </motion.button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Personalization */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Personnalisation</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPersonalized}
                    onChange={(e) => setIsPersonalized(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Ajouter nom et numéro</span>
                </label>
              </div>
              
              {isPersonalized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom personnalisé
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Entrez votre nom"
                      maxLength={15}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro personnalisé
                    </label>
                    <input
                      type="number"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value)}
                      placeholder="Entrez votre numéro"
                      min={1}
                      max={99}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>
              <Button
                variant="outline"
                className="w-full py-4 text-lg font-semibold"
                size="lg"
              >
                <Heart className="h-5 w-5 mr-2" />
                Ajouter aux favoris
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Livraison gratuite</span>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Garantie 2 ans</span>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Retour 30j</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Caractéristiques</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Tissu 100% polyester</li>
                <li>• Technologie Dri-FIT</li>
                <li>• Coutures renforcées</li>
                <li>• Logo brodé</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Entretien</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Lavage machine 30°C</li>
                <li>• Ne pas utiliser d'eau de javel</li>
                <li>• Séchage à l'air libre</li>
                <li>• Repassage à basse température</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Livraison</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Livraison 2-3 jours ouvrés</li>
                <li>• Suivi de colis inclus</li>
                <li>• Point relais disponible</li>
                <li>• Signature à la livraison</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)} 
      />
    </div>
  )
}
