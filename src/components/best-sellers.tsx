'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { toast } from '@/components/ui/use-toast'
import { Star, Truck } from 'lucide-react'

export function BestSellers() {
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
      color: 'Default',
      quantity: 1,
    })
    toast({
      title: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meilleures Ventes 🔥
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Les maillots les plus populaires du moment
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement des meilleures ventes...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Aucun produit disponible</p>
            <Button asChild>
              <a href="/products">Voir tous les produits</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
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
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.team && `${product.team} • `}
                    {product.category === 'club' ? 'Club' : 'Équipe nationale'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{product.price.toFixed(2)} €</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">4.8 (124)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      <div className="flex items-center mt-1">
                        <Truck className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-600 font-medium">8-12 jours</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
                  >
                    {product.stock === 0 ? 'Rupture' : 'Ajouter au panier'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <a href="/best-sellers">
              Voir toutes les meilleures ventes
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
