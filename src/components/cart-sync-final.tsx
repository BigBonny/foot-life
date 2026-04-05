'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-v2'

export function CartSyncFinal() {
  const { isSignedIn, user } = useUser()
  const { items, syncWithDatabase, initializeCart } = useCart()

  // Initialize cart when component mounts or auth state changes
  useEffect(() => {
    if (isSignedIn && user) {
      console.log('User signed in, initializing cart for:', user.id)
      initializeCart(user.id)
    } else {
      console.log('User not signed in, initializing guest cart')
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
