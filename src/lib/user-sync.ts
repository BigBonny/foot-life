import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { supabase } from './supabase'

export async function syncUserToDatabase(user: any, isSignedIn: boolean) {
  if (user && isSignedIn) {
    try {
      // Check if user exists in Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking user existence:', fetchError)
        return
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        console.log('Creating new user in database:', user.id)
        
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
          console.error('Error creating user:', insertError)
        } else {
          console.log('User created successfully:', newUser)
        }
      } else {
        console.log('User already exists in database:', existingUser)
      }
    } catch (error) {
      console.error('Error syncing user to database:', error)
    }
  }
}
