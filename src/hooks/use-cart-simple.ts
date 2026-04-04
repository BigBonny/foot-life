'use client'

import { create } from 'zustand'

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
  (set, get) => {
    // Load initial cart from localStorage
    const loadInitialCart = () => {
      if (typeof window !== 'undefined') {
        const savedCarts = JSON.parse(localStorage.getItem('user-carts') || '{}')
        const currentUserId = localStorage.getItem('current-user-id')
        
        if (currentUserId && savedCarts[currentUserId]) {
          return savedCarts[currentUserId]
        }
      }
      return []
    }

    return {
      items: loadInitialCart(),
      
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
        
        if (typeof window !== 'undefined') {
          const savedCarts = JSON.parse(localStorage.getItem('user-carts') || '{}')
          savedCarts[userId] = items
          localStorage.setItem('user-carts', JSON.stringify(savedCarts))
          console.log('Saved carts:', savedCarts)
        }
      },

      loadCartForUser: (userId: string) => {
        console.log('Loading cart for user:', userId)
        
        if (typeof window !== 'undefined' && userId) {
          const savedCarts = JSON.parse(localStorage.getItem('user-carts') || '{}')
          const userCart = savedCarts[userId] || []
          console.log('Found cart for user:', userId, userCart)
          console.log('All saved carts:', savedCarts)
          
          // Set current user ID
          localStorage.setItem('current-user-id', userId)
          
          set({ items: userCart })
          
          // Verify the cart was loaded
          setTimeout(() => {
            const currentItems = get().items
            console.log('Cart items after load:', currentItems)
          }, 100)
        }
      },
    }
  }
)
