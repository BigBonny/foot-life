'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-v2'

export function CartSyncV2() {
  const { isSignedIn, user } = useUser()
  const { items, isLoaded, loadFromDatabase, saveToDatabase } = useCart()

  // Load cart from database when user signs in
  useEffect(() => {
    if (isSignedIn && user && !isLoaded) {
      console.log('[CartSync] User signed in, loading cart from database:', user.id)
      loadFromDatabase(user.id)
    }
  }, [isSignedIn, user?.id, isLoaded, loadFromDatabase])

  // Save cart to database whenever items change (for signed in users)
  useEffect(() => {
    if (isSignedIn && user) {
      console.log('[CartSync] Items changed, saving cart to database:', user.id, 'Items:', items.length)
      const timer = setTimeout(() => {
        saveToDatabase(user.id)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [items, isSignedIn, user?.id, saveToDatabase])

  return null
}
