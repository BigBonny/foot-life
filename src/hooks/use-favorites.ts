'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
  addedAt: string
}

interface FavoritesStore {
  items: FavoriteItem[]
  addItem: (item: FavoriteItem) => void
  removeItem: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
  getTotalCount: () => number
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem: FavoriteItem) => {
        const { items } = get()
        const existingItem = items.find((item) => item.id === newItem.id)

        if (existingItem) {
          // Remove if already exists (toggle behavior)
          set({
            items: items.filter((item) => item.id !== newItem.id),
          })
        } else {
          // Add new favorite
          set({
            items: [...items, { ...newItem, addedAt: new Date().toISOString() }],
          })
        }
      },

      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },

      isFavorite: (id: string) => {
        return get().items.some((item) => item.id === id)
      },

      clearFavorites: () => {
        set({ items: [] })
      },

      getTotalCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
