import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  console.log('Checkout request received')
  try {
    const body = await request.json()
    console.log('Request body:', body)
    const { items, customerInfo, total, userId } = body
    
    if (!items || !customerInfo) {
      console.error('Missing required fields:', { items: !!items, customerInfo: !!customerInfo })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    console.log('Creating Stripe session...')
    try {
      // Create Stripe checkout session with proper API format
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              images: item.image ? [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${item.image}`] : [],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
        customer_email: customerInfo.email,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['FR', 'BE', 'CH', 'CA', 'LU'],
        },
        metadata: {
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerPhone: customerInfo.phone,
          userId: userId || 'guest',
          isGuest: !userId ? 'true' : 'false',
        },
      })

      return NextResponse.json({ url: session.url })
    } catch (error: any) {
      console.error('Stripe error:', error)
      return NextResponse.json(
        { error: `Failed to create checkout session: ${error.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: `Failed to parse request: ${error.message}` },
      { status: 400 }
    )
  }
}
