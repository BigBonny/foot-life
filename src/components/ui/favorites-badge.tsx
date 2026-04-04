'use client'

import { useFavorites } from '@/hooks/use-favorites'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export function FavoritesBadge() {
  const { getTotalCount } = useFavorites()
  
  return (
    <Link href="/favorites" className="relative">
      <Heart className="h-6 w-6 text-gray-700 hover:text-blue-600 transition" />
      {getTotalCount() > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {getTotalCount()}
        </span>
      )}
    </Link>
  )
}
