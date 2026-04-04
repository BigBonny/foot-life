'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@clerk/nextjs'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items, getTotalItems } = useCart()
  const { isSignedIn, user } = useUser()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Promo Banner */}
      <div className="bg-black text-white py-2 text-center text-sm">
        <span>Maillots à seulement 24,49 €</span>
        <button className="ml-4 text-white hover:text-gray-300">×</button>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-black">
            Foot Life
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-black transition">
              Accueil
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-black transition">
              Nos Maillots
            </Link>
            <Link href="/best-sellers" className="text-gray-700 hover:text-black transition">
              Meilleures Ventes
            </Link>
            <Link href="/world-cup" className="text-gray-700 hover:text-black transition">
              Coupe du Monde 2026
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black transition">
              Contact
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Account */}
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Mon Compte</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Mes Commandes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logout">Déconnexion</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">S'inscrire</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-black transition">
                Accueil
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-black transition">
                Nos Maillots
              </Link>
              <Link href="/best-sellers" className="text-gray-700 hover:text-black transition">
                Meilleures Ventes
              </Link>
              <Link href="/world-cup" className="text-gray-700 hover:text-black transition">
                Coupe du Monde 2026
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-black transition">
                Contact
              </Link>
              {!isSignedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">Connexion</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">S'inscrire</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
