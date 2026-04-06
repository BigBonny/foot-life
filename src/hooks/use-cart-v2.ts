'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  custom_name?: string
  custom_number?: number
}

interface CartStore {
  items: CartItem[]
  isLoaded: boolean
  userId: string | null
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
  setUserId: (userId: string | null) => void
  loadFromDatabase: (userId: string) => Promise<void>
  saveToDatabase: (userId: string) => Promise<void>
}

const createUserStorage = () => {
  if (typeof window === 'undefined') {
    return createJSONStorage(() => ({
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }))
  }

  return createJSONStorage(() => ({
    getItem: (name: string) => {
      const currentUserId = localStorage.getItem('cart-current-user-id')
      const storageKey = currentUserId ? `cart-${currentUserId}` : 'cart-guest'
      return localStorage.getItem(storageKey)
    },
    setItem: (name: string, value: string) => {
      const currentUserId = localStorage.getItem('cart-current-user-id')
      const storageKey = currentUserId ? `cart-${currentUserId}` : 'cart-guest'
      localStorage.setItem(storageKey, value)
    },
    removeItem: (name: string) => {
      const currentUserId = localStorage.getItem('cart-current-user-id')
      const storageKey = currentUserId ? `cart-${currentUserId}` : 'cart-guest'
      localStorage.removeItem(storageKey)
    },
  }))
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoaded: false,
      userId: null,

      setUserId: async (userId: string | null) => {
        const prevUserId = get().userId
        if (prevUserId !== userId) {
          console.log(`[Cart] Switching from ${prevUserId} to ${userId}`)
          
          // When logging out, save current cart to database first
          if (prevUserId && !userId) {
            console.log('[Cart] User logging out, saving cart to database...')
            await get().saveToDatabase(prevUserId)
          }
          
          if (userId) {
            localStorage.setItem('cart-current-user-id', userId)
          } else {
            localStorage.removeItem('cart-current-user-id')
          }
          
          // If logging in, clear and load user's cart from database
          // If logging out, keep items in UI (they're already saved to DB above)
          if (userId) {
            set({ items: [], userId, isLoaded: false })
            await get().loadFromDatabase(userId)
          } else {
            // Logging out - items stay in UI, just mark as guest
            set({ userId: null, isLoaded: true })
          }
        }
      },

      addItem: (newItem: CartItem) => {
        const { items, userId } = get()
        const existingItem = items.find(
          (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
        )

        let newItems
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
              ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
              : item
          )
        } else {
          newItems = [...items, { ...newItem, quantity: newItem.quantity || 1 }]
        }

        set({ items: newItems })
        if (userId) get().saveToDatabase(userId)
      },

      removeItem: (id: string, size: string, color: string) => {
        const { items, userId } = get()
        const newItems = items.filter(
          (item) => !(item.id === id && item.size === size && item.color === color)
        )
        set({ items: newItems })
        if (userId) get().saveToDatabase(userId)
      },

      updateQuantity: (id: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color)
          return
        }

        const { items, userId } = get()
        const newItems = items.map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
        set({ items: newItems })
        if (userId) get().saveToDatabase(userId)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      clearCart: () => {
        const { userId } = get()
        set({ items: [], isLoaded: true })
        if (userId) {
          supabase.from('cart_items').delete().eq('user_id', userId).then()
        }
      },

      saveToDatabase: async (userId: string) => {
        const { items } = get()
        try {
          await supabase.from('cart_items').delete().eq('user_id', userId)
          if (items.length === 0) return
          const cartItems = items.map(item => ({
            user_id: userId,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_image: item.image,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            custom_name: item.custom_name,
            custom_number: item.custom_number,
          }))
          const { error } = await supabase.from('cart_items').insert(cartItems)
          if (error) console.error('[Cart] Error saving:', error)
        } catch (error) {
          console.error('[Cart] Error in saveToDatabase:', error)
        }
      },

      loadFromDatabase: async (userId: string) => {
        try {
          console.log('[Cart] Loading from DB for user:', userId)
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
          if (error) {
            console.error('[Cart] Error loading:', error)
            set({ isLoaded: true })
            return
          }
          if (data && data.length > 0) {
            const items: CartItem[] = data.map(item => ({
              id: item.product_id,
              name: item.custom_name ? `${item.product_name} (${item.custom_name} #${item.custom_number})` : item.product_name,
              price: item.product_price,
              image: item.product_image,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              custom_name: item.custom_name,
              custom_number: item.custom_number,
            }))
            set({ items, isLoaded: true })
          } else {
            set({ isLoaded: true })
          }
        } catch (error) {
          console.error('[Cart] Error in loadFromDatabase:', error)
          set({ isLoaded: true })
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createUserStorage(),
    }
  )
)
