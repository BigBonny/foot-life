'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X, User, LogOut, Package, Heart } from 'lucide-react'
import { CartBadge } from '@/components/ui/cart-badge'
import { FavoritesBadge } from '@/components/ui/favorites-badge'
import { useCart } from '@/hooks/use-cart-final'
import { useFavorites } from '@/hooks/use-favorites'
import { supabase } from '@/lib/supabase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Import CartItem type
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

export function Navigation() {
  const { isSignedIn, user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const cartStore = useCart()
  const { getTotalItems, clearCart, syncWithDatabase } = cartStore
  const { getTotalCount } = useFavorites()

  useEffect(() => {
    if (isSignedIn && user) {
      // Load user's cart when they sign in (with delay to ensure user data is loaded)
      const timer = setTimeout(async () => {
        console.log('Loading cart for user:', user.id)
        
        // First try to load from database
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Database error:', error)
          } else {
            const cartItems = data || []
            console.log('Found cart items in database:', cartItems)
            
            // Convert database items to CartItem format
            const cartItemsFromDb: CartItem[] = cartItems.map(item => ({
              id: item.product_id,
              name: item.custom_name ? `${item.product_name} (${item.custom_name} #${item.custom_number})` : item.product_name,
              price: item.product_price,
              image: item.product_image,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              custom_name: item.custom_name,
              custom_number: item.custom_number,
            }))

            console.log('Setting cart from database:', cartItemsFromDb)
            cartStore.setItems(cartItemsFromDb)
          }
        } catch (error) {
          console.error('Error loading cart from database:', error)
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    } else if (!isSignedIn) {
      // Sync current cart to database before clearing (only if we have a user)
      console.log('Syncing cart to database before logout')
      // Note: localStorage already has the cart, so we don't need to sync here
      // The cart will be loaded from localStorage when user logs back in
      clearCart()
    }
  }, [isSignedIn, user?.id])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-red-600 text-white text-center py-2 text-sm">
        Livraison offerte dès 50€ d'achat
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/primekicks-logo.png" 
                alt="Prime Kicks Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover"
              />
              <span className="font-bold text-lg sm:text-xl hidden sm:inline">Prime Kicks</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
                Tous les maillots
              </Link>
              <Link href="/best-sellers" className="text-gray-700 hover:text-blue-600 transition">
                Meilleures ventes
              </Link>
              <Link href="/world-cup" className="text-gray-700 hover:text-blue-600 transition">
                Coupe du Monde
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Favorites - Hidden on smallest screens */}
              <div className="hidden sm:block">
                <FavoritesBadge />
              </div>

              {/* Cart */}
              <CartBadge />

              {/* User Menu - Hidden on mobile */}
              <div className="hidden md:block">
                {isSignedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="hidden lg:inline">{user?.firstName || 'Compte'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <span>Tableau de bord</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <span>Mes commandes</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SignOutButton>
                          <div className="flex items-center space-x-2 w-full cursor-pointer">
                            <LogOut className="h-4 w-4" />
                            <span>Déconnexion</span>
                          </div>
                        </SignOutButton>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/sign-in">Connexion</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/sign-up">S'inscrire</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-white"
            >
              <div className="flex flex-col items-center py-4 px-2 space-y-1">
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors py-3 px-4 rounded-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tous les maillots
                </Link>
                <Link 
                  href="/best-sellers" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors py-3 px-4 rounded-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Meilleures ventes
                </Link>
                <Link 
                  href="/world-cup" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors py-3 px-4 rounded-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Coupe du Monde
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors py-3 px-4 rounded-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {/* Mobile User Links */}
                <div className="border-t pt-4 mt-2 space-y-1">
                  {isSignedIn ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors py-3 px-4 rounded-lg font-medium flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Mon compte
                      </Link>
                      <Link 
                        href="/orders" 
                        className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors py-3 px-4 rounded-lg font-medium flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-3" />
                        Mes commandes
                      </Link>
                      <button 
                        className="w-full text-left text-red-600 hover:bg-red-50 transition-colors py-3 px-4 rounded-lg font-medium flex items-center"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          // Handle sign out
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Link 
                          href="/sign-in" 
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Connexion
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        asChild
                      >
                        <Link 
                          href="/sign-up" 
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          S'inscrire
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  )
}
