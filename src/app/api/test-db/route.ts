import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const { data, error } = await supabase
      .from('products')
      .select('*', { count: 'exact' })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: error.message,
        details: 'Database query failed'
      }, { status: 500 })
    }

    const productCount = data?.length || 0

    console.log('Database connected successfully!')

    return NextResponse.json({ 
      message: 'Database connected!',
      productCount: productCount,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Connection error:', error)
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'URL exists' : 'URL missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Key exists' : 'Key missing'
    }, { status: 500 })
  }
}
