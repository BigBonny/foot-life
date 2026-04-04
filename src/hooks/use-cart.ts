'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
  saveCartForUser: (userId: string) => void
  loadCartForUser: (userId: string) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem: CartItem) => {
        const { items } = get()
        const existingItem = items.find(
          (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
                ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { ...newItem, quantity: newItem.quantity || 1 }],
          })
        }
      },

      removeItem: (id: string, size: string, color: string) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        })
      },

      updateQuantity: (id: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        })
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
        set({ items: [] })
      },

      saveCartForUser: (userId: string) => {
        const { items } = get()
        console.log('Saving cart for user:', userId, items)
        const savedCarts = JSON.parse(localStorage.getItem('user-carts') || '{}')
        savedCarts[userId] = items
        localStorage.setItem('user-carts', JSON.stringify(savedCarts))
        console.log('Saved carts:', savedCarts)
      },

      loadCartForUser: (userId: string) => {
        console.log('Loading cart for user:', userId)
        const savedCarts = JSON.parse(localStorage.getItem('user-carts') || '{}')
        const userCart = savedCarts[userId] || []
        console.log('Found cart for user:', userCart)
        set({ items: userCart })
      }
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
