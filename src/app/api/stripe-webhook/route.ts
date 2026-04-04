import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  // Temporarily skip signature verification for testing
  // Remove this in production!
  let event: Stripe.Event
  try {
    event = JSON.parse(body) as Stripe.Event
  } catch (err: any) {
    console.error('Error parsing webhook body:', err.message)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('Webhook event received:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get the items from the session metadata or retrieve from cart
        const userId = session.metadata?.userId || ''
        
        // Get cart items for this user
        const { data: cartItems, error: cartError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId)
        
        if (cartError) {
          console.error('Error fetching cart items:', cartError)
        } else {
          // Create order in Supabase with items
          const { error } = await supabase.from('orders').insert({
            user_id: userId,
            items: cartItems || [], // Store items as JSONB
            total: session.amount_total ? session.amount_total / 100 : 0,
            status: 'pending',
            shipping_address: {
              name: session.metadata?.customerName || '',
              email: session.customer_details?.email || '',
              phone: session.metadata?.customerPhone || '',
              address: session.customer_details?.address || {},
            },
            stripe_session_id: session.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (error) {
            console.error('Error creating order:', error)
          } else {
            console.log('Order created successfully:', session.id)
            
            // Clear the cart after successful order creation
            const { error: clearError } = await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', userId)
            
            if (clearError) {
              console.error('Error clearing cart:', clearError)
            } else {
              console.log('Cart cleared successfully for user:', userId)
            }
          }
        }
        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
