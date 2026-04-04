import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Simple webhook handler without verification for now
    const { type, data } = body

    switch (type) {
      case 'user.created':
        await handleUserCreated(data)
        break
      case 'user.updated':
        await handleUserUpdated(data)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clerk webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    )
  }
}

async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name } = data

  try {
    // Check if user already exists in Supabase
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', id)
      .single()

    if (!existingUser) {
      // Create user profile in Supabase
      await supabase
        .from('user_profiles')
        .insert({
          user_id: id,
          first_name: first_name || '',
          last_name: last_name || '',
          email: email_addresses?.[0]?.email_address || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
    }

    console.log('User created in Supabase:', id)
  } catch (error) {
    console.error('Error creating user in Supabase:', error)
  }
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name } = data

  try {
    // Update user profile in Supabase
    await supabase
      .from('user_profiles')
      .update({
        first_name: first_name || '',
        last_name: last_name || '',
        email: email_addresses?.[0]?.email_address || '',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', id)

    console.log('User updated in Supabase:', id)
  } catch (error) {
    console.error('Error updating user in Supabase:', error)
  }
}
