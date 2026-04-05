import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { supabase } from './supabase'

export async function syncUserToDatabase(user: any, isSignedIn: boolean) {
  console.log('[UserSync] Starting sync - User:', user?.id, 'isSignedIn:', isSignedIn)
  
  if (user && isSignedIn) {
    try {
      // Check if user exists in Supabase - use maybeSingle to avoid error when no rows
      console.log('[UserSync] Checking if user exists in database:', user.id)
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .maybeSingle()

      if (fetchError) {
        console.error('[UserSync] Error checking user existence:', fetchError)
        return
      }

      console.log('[UserSync] Existing user check result:', existingUser)

      // If user doesn't exist, create them
      if (!existingUser) {
        console.log('[UserSync] Creating new user in database:', user.id)
        console.log('[UserSync] User data:', {
          clerk_id: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
        })
        
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            email: user.emailAddresses?.[0]?.emailAddress || '',
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          console.error('[UserSync] Error creating user:', insertError)
        } else {
          console.log('[UserSync] User created successfully:', newUser)
        }
      } else {
        console.log('[UserSync] User already exists in database:', existingUser)
      }
    } catch (error) {
      console.error('[UserSync] Error syncing user to database:', error)
    }
  } else {
    console.log('[UserSync] Skipping sync - no user or not signed in')
  }
}
