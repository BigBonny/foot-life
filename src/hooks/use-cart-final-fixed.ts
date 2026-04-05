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
  syncWithDatabase: (userId?: string) => Promise<void>
  loadFromDatabase: (userId: string) => Promise<void>
  setItems: (items: CartItem[]) => void
  initializeCart: (userId?: string) => Promise<void>
  ensureUserInDatabase: (userId: string) => Promise<void>
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

        // Auto-sync to database if user is logged in
        const userId = getCurrentUserId()
        if (userId) {
          setTimeout(() => {
            get().syncWithDatabase(userId)
          }, 100)
        }
      },

      removeItem: (id: string, size: string, color: string) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        })

        // Auto-sync to database if user is logged in
        const userId = getCurrentUserId()
        if (userId) {
          setTimeout(() => {
            get().syncWithDatabase(userId)
          }, 100)
        }
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

        // Auto-sync to database if user is logged in
        const userId = getCurrentUserId()
        if (userId) {
          setTimeout(() => {
            get().syncWithDatabase(userId)
          }, 100)
        }
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
        // Also clear localStorage immediately
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage')
        }
      },

      syncWithDatabase: async (userId?: string) => {
        const { items } = get()
        console.log('Syncing cart to database:', items)

        if (!userId) {
          console.log('No userId provided, skipping database sync')
          return
        }

        try {
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
              product_name: item.name.replace(/ \([^)]*\)/, ''),
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
        
        // Also update localStorage to maintain consistency
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart-storage', JSON.stringify({ state: { items: newItems } }))
        }
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
          
          // Also update localStorage to maintain consistency
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart-storage', JSON.stringify({ state: { items } }))
          }
        } catch (error) {
          console.error('Error loading cart from database:', error)
        }
      },

      initializeCart: async (userId?: string) => {
        console.log('Initializing cart for user:', userId)
        
        // First, try to load from database if user is signed in
        if (userId) {
          try {
            const { data, error } = await supabase
              .from('cart_items')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })

            if (!error && data && data.length > 0) {
              console.log('Loading cart from database for user:', userId)
              
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

              set({ items })
              console.log('Cart loaded from database successfully')
              return
            }
          } catch (error) {
            console.error('Error loading from database:', error)
          }
        }
        
        // If no user or no database items, use localStorage (for guests)
        console.log('Using localStorage cart')
        // localStorage will be loaded automatically by Zustand persist
      },

      ensureUserInDatabase: async (userId: string) => {
        console.log('Ensuring user exists in database:', userId)
        
        try {
          // Check if user exists in Supabase
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', userId)
            .single()

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking user existence:', fetchError)
            return
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            console.log('Creating new user in database:', userId)
            
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                clerk_id: userId,
                email: '', // Will be updated by Clerk
                first_name: '', // Will be updated by Clerk
                last_name: '', // Will be updated by Clerk
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (insertError) {
              console.error('Error creating user:', insertError)
            } else {
              console.log('User created successfully:', newUser)
            }
          } else {
            console.log('User already exists in database:', existingUser)
          }
        } catch (error) {
          console.error('Error ensuring user in database:', error)
        }
      },
    },
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        console.log('Cart rehydrated from localStorage:', state?.items || [])
        
        // Load from database if user is signed in and localStorage is empty
        const userId = getCurrentUserId()
        if (userId && (!state?.items || state.items.length === 0)) {
          console.log('User is signed in but cart is empty, loading from database')
          get().loadFromDatabase(userId)
        }
      }
    }
  )
}

// Helper function to get current user ID
function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    const authData = localStorage.getItem('clerk-db-jwt')
    if (authData) {
      const parsed = JSON.parse(authData)
      return parsed.sub || parsed.userId || null
    }
  } catch {
    return null
  }
}
}
