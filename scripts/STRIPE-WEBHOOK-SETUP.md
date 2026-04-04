# 🚀 Stripe Webhook Setup

## Step 1: Start Stripe CLI to Forward Webhooks

Run this command in your terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

This will:
- Start listening for Stripe events
- Forward them to your local webhook endpoint
- Show you a webhook signing secret

## Step 2: Update Webhook Secret

The CLI will show you a webhook secret like:
```
> Setting up webhook forwarder...
> Ready! Your webhook signing secret is whsec_... 
> Forwarding webhooks to http://localhost:3000/api/stripe-webhook
```

Copy this secret and update your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_NEW_SECRET_HERE
```

## Step 3: Test the Complete Flow

1. **Start Stripe CLI** (keep it running)
2. **Add items to cart**
3. **Complete checkout** with Stripe
4. **Check webhook logs** in the CLI
5. **Verify order creation** in database

## What the Webhook Does Now:

✅ **Creates order** with all items from cart
✅ **Includes shipping address** from Stripe
✅ **Stores items as JSONB** in orders table
✅ **Clears cart** after successful order
✅ **Logs everything** for debugging

## Expected Console Logs:

```
Order created successfully: sess_...
Cart cleared successfully for user: user_...
```

## Database Check:

```sql
-- Check for new orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Check if cart is cleared
SELECT COUNT(*) FROM cart_items WHERE user_id = 'your_user_id';
```

**Run the Stripe CLI command and test the payment flow!** 🏆
