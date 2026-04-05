'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { syncUserToDatabase } from '@/lib/user-sync'

export function UserSyncClient() {
  const { user, isSignedIn } = useUser()
  
  useEffect(() => {
    if (user && isSignedIn) {
      syncUserToDatabase(user, isSignedIn)
    }
  }, [user, isSignedIn])
  
  return null
}
