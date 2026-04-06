'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X, User, LogOut, Package, Heart } from 'lucide-react'
import { CartBadge } from '@/components/ui/cart-badge'
import { FavoritesBadge } from '@/components/ui/favorites-badge'
import { CountdownTimer } from '@/components/ui/countdown-timer'
import { useCart } from '@/hooks/use-cart-v2'
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

export function NavigationFinal() {
  const { isSignedIn, user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const cartStore = useCart()
  const { getTotalItems, clearCart, saveToDatabase, loadFromDatabase, isLoaded } = cartStore
  const { getTotalCount } = useFavorites()

  // Load cart from database when user signs in
  useEffect(() => {
    if (isSignedIn && user && !isLoaded) {
      console.log('User signed in, loading cart from database:', user.id)
      loadFromDatabase(user.id)
    }
  }, [isSignedIn, user?.id, isLoaded, loadFromDatabase])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSignOut = async () => {
    console.log('User signing out, saving cart first')
    if (user) {
      await saveToDatabase(user.id)
    }
    clearCart()
  }

  return (
    <>
      {/* Promo Banner with Timer - Summer Ocean Theme */}
      <div className="bg-ocean-gradient text-white">
        <div className="container mx-auto px-4 py-1">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-center sm:text-left">
              <span className="font-semibold">🌊 Livraison offerte dès 2 produits achetés!</span>
            </div>
            <CountdownTimer />
          </div>
        </div>
      </div>

      {/* Main Navigation - Summer Ocean Theme */}
      <nav className="bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-100 shadow-md sticky top-0 z-50">
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
                          <div className="flex items-center space-x-2 w-full cursor-pointer" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4" />
                            <span>Déconnexion</span>
                          </div>
                        </SignOutButton>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild className="hover:bg-cyan-100 hover:text-cyan-700 transition-colors">
                      <Link href="/sign-in">Connexion</Link>
                    </Button>
                    <Button size="sm" asChild className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0">
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
                <div className="border-t pt-4 mt-2 space-y-1 w-full flex flex-col items-center">
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
                      <SignOutButton>
                        <button 
                          className="w-full max-w-xs mx-auto text-center text-red-600 hover:bg-red-50 transition-colors py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Déconnexion
                        </button>
                      </SignOutButton>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="hover:bg-cyan-100 hover:text-cyan-700 transition-colors"
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
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
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
