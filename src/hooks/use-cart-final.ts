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
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
  syncWithDatabase: () => void
  loadFromDatabase: (userId: string) => void
  setItems: (items: CartItem[]) => void
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

        // Auto-sync to database after adding item
        setTimeout(() => {
          get().syncWithDatabase()
        }, 100)
      },

      removeItem: (id: string, size: string, color: string) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        })

        // Auto-sync to database after removing item
        setTimeout(() => {
          get().syncWithDatabase()
        }, 100)
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

        // Auto-sync to database after updating quantity
        setTimeout(() => {
          get().syncWithDatabase()
        }, 100)
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
        
        // Auto-sync to database after clearing cart
        setTimeout(() => {
          get().syncWithDatabase()
        }, 100)
      },

      syncWithDatabase: async () => {
        const { items } = get()
        console.log('Syncing cart to database:', items)

        try {
          // Get current user ID from Clerk auth context
          const { data: { user } } = await supabase.auth.getUser()
          const userId = user?.id || 'user_3BAWl1Nle0eGAtblJQzPKvVSHhG'
          
          console.log('Using user ID for sync:', userId)
          
          // Clear existing cart items for this user
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)

          // Only insert if there are items
          if (items.length > 0) {
            // Insert current cart items
            const cartItemsToInsert = items.map(item => ({
              user_id: userId,
              product_id: item.id,
              product_name: item.name.replace(/ \([^)]*\)/, ''), // Remove custom name/number from display name
              product_image: item.image,
              product_price: item.price,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              custom_name: item.custom_name,
              custom_number: item.custom_number,
            }))

            console.log('Cart items to insert:', cartItemsToInsert)

            const { error } = await supabase
              .from('cart_items')
              .insert(cartItemsToInsert)

            if (error) {
              console.error('Error syncing cart to database:', error)
            } else {
              console.log('Cart synced to database successfully')
            }
          } else {
            console.log('Cart is empty, cleared from database')
          }
        } catch (error) {
          console.error('Error syncing cart:', error)
        }
      },

      setItems: (newItems: CartItem[]) => {
        set({ items: newItems })
      },

      loadFromDatabase: async (userId: string) => {
        console.log('Loading cart from database for user:', userId)
        
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Database error:', error)
            return
          }

          const cartItems = data || []
          console.log('Found cart items in database:', cartItems)
          
          // Convert database items to CartItem format
          const items: CartItem[] = cartItems.map(item => ({
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

          console.log('Setting cart from database:', items)
          set({ items })
        } catch (error) {
          console.error('Error loading cart from database:', error)
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
