'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-v2'

export function CartSyncFinal() {
  const { isSignedIn, user } = useUser()
  const { items, loadFromDatabase, saveToDatabase, isLoaded } = useCart()

  // Load cart from database when user signs in
  useEffect(() => {
    if (isSignedIn && user && !isLoaded) {
      console.log('[CartSyncFinal] User signed in, loading cart from database:', user.id)
      loadFromDatabase(user.id)
    }
  }, [isSignedIn, user?.id, isLoaded, loadFromDatabase])

  // Sync cart to database whenever items change (for signed-in users)
  useEffect(() => {
    if (isSignedIn && user) {
      const timer = setTimeout(() => {
        console.log('[CartSyncFinal] Auto-syncing cart to database for user:', user.id, 'items:', items.length)
        saveToDatabase(user.id)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [items, isSignedIn, user?.id, saveToDatabase])

  return null // This component doesn't render anything
}
