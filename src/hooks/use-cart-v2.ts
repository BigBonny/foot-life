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
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
  loadFromDatabase: (userId: string) => Promise<void>
  saveToDatabase: (userId: string) => Promise<void>
  setLoaded: (loaded: boolean) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoaded: false,
      
      setLoaded: (loaded: boolean) => set({ isLoaded: loaded }),
      
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
        set({ items: [], isLoaded: false })
      },

      saveToDatabase: async (userId: string) => {
        const { items } = get()
        console.log('[Cart] Saving to database for user:', userId, 'Items:', items.length)
        
        try {
          // First ensure user exists - handle case where .single() fails
          console.log('[Cart] Checking if user exists:', userId)
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .maybeSingle()
          
          if (userError) {
            console.log('[Cart] Error checking user:', userError)
          }
          
          if (!existingUser) {
            console.log('[Cart] Creating user in database:', userId)
            const { error: insertError } = await supabase.from('users').insert({
              clerk_id: userId,
              email: '',
              first_name: '',
              last_name: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            if (insertError) {
              console.error('[Cart] Error creating user:', insertError)
            } else {
              console.log('[Cart] User created successfully')
            }
          } else {
            console.log('[Cart] User already exists:', existingUser)
          }
          
          // Clear existing cart
          console.log('[Cart] Clearing existing cart items')
          await supabase.from('cart_items').delete().eq('user_id', userId)
          
          // Insert new items
          if (items.length > 0) {
            console.log('[Cart] Inserting', items.length, 'items')
            const cartItems = items.map(item => ({
              user_id: userId,
              product_id: item.id,
              product_name: item.name.replace(/ \([^)]*\)/, ''),
              product_image: item.image,
              product_price: item.price,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              custom_name: item.custom_name || null,
              custom_number: item.custom_number || null,
              created_at: new Date().toISOString(),
            }))
            
            const { error } = await supabase.from('cart_items').insert(cartItems)
            if (error) {
              console.error('[Cart] Error saving to database:', error)
            } else {
              console.log('[Cart] Saved successfully')
            }
          }
        } catch (error) {
          console.error('[Cart] Error in saveToDatabase:', error)
        }
      },

      loadFromDatabase: async (userId: string) => {
        console.log('[Cart] Loading from database for user:', userId)
        
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
          
          if (error) {
            console.error('[Cart] Error loading from database:', error)
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
            
            console.log('[Cart] Loaded', items.length, 'items from database')
            set({ items, isLoaded: true })
          } else {
            console.log('[Cart] No items in database')
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
      storage: createJSONStorage(() => localStorage),
    }
  )
)
