'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-fixed'

export function CartSyncFixed() {
  const { isSignedIn, user } = useUser()
  const { items, syncWithDatabase, initializeCart } = useCart()

  // Initialize cart when user signs in or page loads
  useEffect(() => {
    if (isSignedIn && user) {
      // Initialize cart for signed-in user (will load from database first)
      initializeCart(user.id)
    } else {
      // Initialize cart for guest (will use localStorage)
      initializeCart()
    }
  }, [isSignedIn, user?.id, initializeCart])

  // Sync cart to database whenever items change (for signed-in users)
  useEffect(() => {
    if (isSignedIn && user) {
      const timer = setTimeout(() => {
        console.log('Auto-syncing cart to database for user:', user.id, 'items:', items)
        syncWithDatabase(user.id)
      }, 1000) // Increased delay to avoid rapid syncs
      
      return () => clearTimeout(timer)
    }
  }, [items, isSignedIn, user?.id, syncWithDatabase])

  return null // This component doesn't render anything
}
