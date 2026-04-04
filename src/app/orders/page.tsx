'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Order } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Truck, CheckCircle, Clock, XCircle, Sparkles, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const { user } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    console.log('Fetching orders for user:', user?.id)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      console.log('Orders response:', { data, error })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'processing':
        return 'En traitement'
      case 'shipped':
        return 'Expédié'
      case 'delivered':
        return 'Livré'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
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
            <Package className="h-12 w-12 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8 text-lg">Veuillez vous connecter pour voir vos commandes.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild className="px-8 py-4 rounded-xl text-lg font-semibold">
              <Link href="/sign-in">Se connecter</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
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
          <p className="text-xl text-gray-600 font-medium">Chargement de vos commandes...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Mes commandes
          </h1>
          <p className="text-xl text-gray-600">
            Suivez l'état de toutes vos commandes Foot Life
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Vous n'avez pas encore de commandes
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Découvrez notre collection de <Link href="/products" className="text-blue-600 hover:underline">maillots</Link> et passez votre première commande
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700">
                <Link href="/products">Commencer mes achats</Link>
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">
                          Commande #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription className="text-base">
                          Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-black text-blue-600">{order.total?.toFixed(2) || '0.00'} €</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="rounded-xl">
                          Voir les détails
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
