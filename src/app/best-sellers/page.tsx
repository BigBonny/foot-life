'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { toast } from '@/components/ui/use-toast'
import { Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetchBestSellers()
  }, [])

  const fetchBestSellers = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gte('stock', 10) // Products with good stock
        .order('created_at', { ascending: false })
        .limit(12)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des meilleures ventes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Meilleures Ventes
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les maillots de football les plus populaires du moment
          </p>
          <div className="flex items-center justify-center mt-4">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="text-gray-700">Choisis par nos clients</span>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Les meilleures ventes seront bientôt disponibles.
            </p>
            <Button asChild>
              <a href="/products">Voir tous les produits</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.category === 'national' && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                      National
                    </div>
                  )}
                  {product.stock <= 5 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Dernières pièces
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>
                    {product.team && `${product.team} • `}
                    {product.category === 'club' ? 'Club' : 'Équipe nationale'}
                    {product.season && ` • ${product.season}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {product.price.toFixed(2)} €
                      </p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">4.8 (124)</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {product.stock === 0 ? 'Rupture' : 'Ajouter'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Meilleures Ventes</h3>
            <p className="text-gray-600 text-sm">
              Les maillots les plus appréciés par nos clients
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Tendance Actuelle</h3>
            <p className="text-gray-600 text-sm">
              Suivez les dernières tendances du football
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Qualité Garantie</h3>
            <p className="text-gray-600 text-sm">
              Produits authentiques et de haute qualité
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
