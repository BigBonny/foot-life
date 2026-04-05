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
  debugCart: () => void
}

// Helper function to get current user ID from Clerk
function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') {
    console.log('[Cart] Window undefined, cannot get user ID')
    return null
  }
  
  try {
    // Try to get user ID from Clerk's JWT token
    const authData = localStorage.getItem('clerk-db-jwt')
    console.log('[Cart] Checking localStorage for clerk-db-jwt:', authData ? 'found' : 'not found')
    
    if (authData) {
      const parsed = JSON.parse(authData)
      console.log('[Cart] Parsed JWT, user ID:', parsed.sub || parsed.userId)
      return parsed.sub || parsed.userId || null
    }
    
    // Try alternative Clerk keys
    const clerkSession = localStorage.getItem('__clerk_client_jwt')
    if (clerkSession) {
      console.log('[Cart] Found __clerk_client_jwt')
      return null // Can't parse this easily, will rely on useUser hook
    }
    
    console.log('[Cart] No user ID found in localStorage')
    return null
  } catch (error) {
    console.error('[Cart] Error getting user ID:', error)
    return null
  }
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      debugCart: () => {
        const state = get()
        console.log('[Cart Debug] Current items:', state.items)
        console.log('[Cart Debug] Total items:', state.getTotalItems())
        console.log('[Cart Debug] Total price:', state.getTotalPrice())
        console.log('[Cart Debug] User ID from localStorage:', getCurrentUserId())
      },
      
      addItem: (newItem: CartItem) => {
        console.log('[Cart] Adding item:', newItem)
        const { items } = get()
        const existingItem = items.find(
          (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
        )

        if (existingItem) {
          console.log('[Cart] Item exists, updating quantity')
          set({
            items: items.map((item) =>
              item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
                ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                : item
            ),
          })
        } else {
          console.log('[Cart] New item, adding to cart')
          set({
            items: [...items, { ...newItem, quantity: newItem.quantity || 1 }],
          })
        }

        console.log('[Cart] Current items after add:', get().items)

        // Auto-sync to database if user is logged in
        const userId = getCurrentUserId()
        console.log('[Cart] User ID for sync:', userId)
        if (userId) {
          console.log('[Cart] Scheduling database sync')
          setTimeout(() => {
            console.log('[Cart] Executing database sync')
            get().syncWithDatabase(userId)
          }, 500)
        } else {
          console.log('[Cart] No user ID, skipping database sync')
        }
      },

      removeItem: (id: string, size: string, color: string) => {
        console.log('[Cart] Removing item:', { id, size, color })
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size && item.color === color)
          ),
        })
        console.log('[Cart] Items after removal:', get().items)

        // Auto-sync to database if user is logged in
        const userId = getCurrentUserId()
        if (userId) {
          setTimeout(() => {
            get().syncWithDatabase(userId)
          }, 500)
        }
      },

      updateQuantity: (id: string, size: string, color: string, quantity: number) => {
        console.log('[Cart] Updating quantity:', { id, size, color, quantity })
        if (quantity <= 0) {
          console.log('[Cart] Quantity <= 0, removing item')
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
        console.log('[Cart] Items after update:', get().items)

        // Auto-sync to database if user is logged in
        const userId = getCurrentUserId()
        if (userId) {
          setTimeout(() => {
            get().syncWithDatabase(userId)
          }, 500)
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
        console.log('[Cart] Clearing cart')
        set({ items: [] })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage')
        }
      },

      syncWithDatabase: async (userId?: string) => {
        const { items } = get()
        console.log('[Cart] Starting database sync. Items:', items.length)
        console.log('[Cart] User ID:', userId)

        if (!userId) {
          console.log('[Cart] No userId provided, skipping database sync')
          return
        }

        try {
          console.log('[Cart] Ensuring user exists in database')
          await get().ensureUserInDatabase(userId)
          
          console.log('[Cart] Clearing existing cart items for user:', userId)
          const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)

          if (deleteError) {
            console.error('[Cart] Error clearing cart:', deleteError)
          } else {
            console.log('[Cart] Successfully cleared existing cart')
          }

          // Only insert if there are items
          if (items.length > 0) {
            console.log('[Cart] Inserting', items.length, 'items to database')
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

            console.log('[Cart] Cart items to insert:', cartItemsToInsert)

            const { error: insertError } = await supabase
              .from('cart_items')
              .insert(cartItemsToInsert)

            if (insertError) {
              console.error('[Cart] Error inserting cart items:', insertError)
            } else {
              console.log('[Cart] Cart synced to database successfully')
            }
          } else {
            console.log('[Cart] Cart is empty, nothing to insert')
          }
        } catch (error) {
          console.error('[Cart] Error in syncWithDatabase:', error)
        }
      },

      setItems: (newItems: CartItem[]) => {
        console.log('[Cart] Setting items:', newItems)
        set({ items: newItems })
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart-storage', JSON.stringify({ state: { items: newItems } }))
        }
      },

      loadFromDatabase: async (userId: string) => {
        console.log('[Cart] Loading cart from database for user:', userId)
        
        try {
          console.log('[Cart] Querying database for cart items')
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('[Cart] Database error loading cart:', error)
            return
          }

          const cartItems = data || []
          console.log('[Cart] Found', cartItems.length, 'cart items in database')
          
          if (cartItems.length === 0) {
            console.log('[Cart] No items found in database for user')
            return
          }
          
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

          console.log('[Cart] Setting cart items from database:', items)
          set({ items })
          
          // Also update localStorage to maintain consistency
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart-storage', JSON.stringify({ state: { items } }))
            console.log('[Cart] Updated localStorage with database items')
          }
        } catch (error) {
          console.error('[Cart] Error in loadFromDatabase:', error)
        }
      },

      initializeCart: async (userId?: string) => {
        console.log('[Cart] Initializing cart. User ID:', userId)
        
        // First, try to load from database if user is signed in
        if (userId) {
          console.log('[Cart] User is signed in, loading from database')
          try {
            await get().loadFromDatabase(userId)
            console.log('[Cart] Cart loaded from database successfully')
          } catch (error) {
            console.error('[Cart] Error loading from database:', error)
          }
        } else {
          console.log('[Cart] No user ID, using localStorage only')
        }
      },

      ensureUserInDatabase: async (userId: string) => {
        console.log('[Cart] Ensuring user exists in database:', userId)
        
        try {
          console.log('[Cart] Checking if user exists in users table')
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', userId)
            .single()

          if (fetchError) {
            if (fetchError.code === 'PGRST116') {
              console.log('[Cart] User not found in database, will create')
            } else {
              console.error('[Cart] Error checking user existence:', fetchError)
              return
            }
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            console.log('[Cart] Creating new user in database:', userId)
            
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                clerk_id: userId,
                email: '',
                first_name: '',
                last_name: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (insertError) {
              console.error('[Cart] Error creating user:', insertError)
            } else {
              console.log('[Cart] User created successfully:', newUser)
            }
          } else {
            console.log('[Cart] User already exists in database:', existingUser)
          }
        } catch (error) {
          console.error('[Cart] Error in ensureUserInDatabase:', error)
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        console.log('[Cart] Rehydrated from localStorage. Items:', state?.items?.length || 0)
      }
    }
  )
)

console.log('[Cart] Cart store created successfully')
