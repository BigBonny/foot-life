'use client'

import { motion } from 'framer-motion'
import { useFavorites } from '@/hooks/use-favorites'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function FavoritesPage() {
  const { items, removeItem, clearFavorites } = useFavorites()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Mes Favoris
          </h1>
          <p className="text-xl text-gray-600">
            {items.length > 0 
              ? `${items.length} produit${items.length > 1 ? 's' : ''} dans vos favoris`
              : 'Vous n\'avez pas encore de favoris'
            }
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="h-10 w-10 text-gray-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Pas encore de favoris
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Ajoutez vos <Link href="/products" className="text-blue-600 hover:underline">maillots préférés</Link> pour les retrouver facilement
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700">
                <Link href="/products">Découvrir les produits</Link>
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Clear all button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center mb-6"
            >
              <p className="text-gray-600">
                {items.length} produit{items.length > 1 ? 's' : ''}
              </p>
              <Button
                variant="outline"
                onClick={clearFavorites}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </Button>
            </motion.div>

            {/* Favorites Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <Link href={`/products/${item.id}`}>
                        <div className="aspect-square overflow-hidden cursor-pointer">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
                      >
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                      </motion.button>
                    </div>
                    
                    <CardContent className="p-4">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                          {item.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-blue-600">
                          {item.price.toFixed(2)} €
                        </p>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            asChild
                          >
                            <Link href={`/products/${item.id}`}>
                              <ShoppingBag className="h-4 w-4" />
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Ajouté le {new Date(item.addedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
