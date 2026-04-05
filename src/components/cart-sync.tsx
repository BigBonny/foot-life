'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/hooks/use-cart-final'

export function CartSync() {
  const { isSignedIn, user } = useUser()
  const { items, syncWithDatabase } = useCart()

  // Sync cart to database whenever items change (for signed-in users)
  useEffect(() => {
    if (isSignedIn && user && items.length > 0) {
      const timer = setTimeout(() => {
        console.log('Auto-syncing cart to database for user:', user.id)
        syncWithDatabase(user.id)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [items, isSignedIn, user?.id, syncWithDatabase])

  return null // This component doesn't render anything
}
