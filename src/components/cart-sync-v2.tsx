'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-v2'

export function CartSyncV2() {
  const { isSignedIn, user } = useUser()
  const { setUserId, items, saveToDatabase } = useCart()

  // Set user ID when auth state changes
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isSignedIn && user) {
        console.log('[CartSync] User signed in:', user.id)
        await setUserId(user.id)
      } else {
        console.log('[CartSync] No user signed in, using guest cart')
        await setUserId(null)
      }
    }
    handleAuthChange()
  }, [isSignedIn, user?.id, setUserId])

  // Save cart to database whenever items change (for signed in users)
  useEffect(() => {
    if (isSignedIn && user && items.length > 0) {
      console.log('[CartSync] Items changed, saving cart:', user.id, 'Items:', items.length)
      const timer = setTimeout(() => {
        saveToDatabase(user.id)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [items, isSignedIn, user?.id, saveToDatabase])

  return null
}
