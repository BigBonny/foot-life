import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  console.log('Newsletter subscription request received')
  try {
    const { email } = await req.json()
    console.log('Email received:', email)

    if (!email) {
      console.error('No email provided')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Checking if email already exists...')
    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('email', email)
      .single()

    console.log('Check result:', { existing, checkError })

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing email:', checkError)
      throw checkError
    }

    if (existing) {
      console.log('Email already subscribed')
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      )
    }

    console.log('Adding new subscription...')
    // Add to newsletter
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Newsletter subscription error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    console.log('Newsletter subscription successful')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
