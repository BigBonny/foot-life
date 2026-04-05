'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
      // Sync current cart to database before clearing
      console.log('Syncing cart to database before logout')
      syncWithDatabase()
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
                src="/primekicks-favicon.png" 
                alt="Prime Kicks Logo"
                className="h-16 w-16 rounded-full object-cover"
              />
              <span className="font-bold text-xl">Prime Kicks</span>
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
            <div className="flex items-center space-x-4">
              {/* Favorites */}
              <FavoritesBadge />

              {/* Cart */}
              <CartBadge />

              {/* User Menu */}
              {isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{user?.firstName || 'Compte'}</span>
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

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
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
            <div className="md:hidden border-t py-4">
              <div className="flex flex-col space-y-3">
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
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
