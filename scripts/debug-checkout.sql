-- Debug checkout issues
-- Check if cart has items and user is authenticated

-- 1. Check if user has cart items
SELECT 
    user_id,
    COUNT(*) as item_count,
    SUM(product_price * quantity) as total_value
FROM cart_items 
GROUP BY user_id;

-- 2. Check if cart store has items (this might be different)
-- You'll need to check browser console for this

-- 3. Verify checkout API works
-- Test this in browser console:
/*
fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ id: 'test', name: 'Test', price: 30, quantity: 1, size: 'M', color: 'Default' }],
    customerInfo: { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
    total: 30,
    userId: 'test-user'
  })
}).then(r => r.json()).then(console.log)
*/
