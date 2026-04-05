'use client'

import { useCart } from '@/hooks/use-cart-v2'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export function CartBadge() {
  const cartStore = useCart()
  
  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600 transition" />
      {cartStore.items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartStore.items.reduce((total, item) => total + item.quantity, 0)}
        </span>
      )}
    </Link>
  )
}
