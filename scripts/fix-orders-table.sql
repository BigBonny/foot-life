-- Fix orders table structure
-- Add missing columns for proper order management

-- Add items column (JSONB) to store order items
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB;

-- Add shipping_address column (JSONB) 
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Add payment_status column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'paid';

-- Add stripe_session_id column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Check the updated table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Test with a sample insert
INSERT INTO orders (
    user_id, 
    items, 
    total, 
    status, 
    shipping_address, 
    stripe_session_id,
    payment_status
) VALUES (
    'test_user',
    '[{"id": "test", "name": "Test Product", "price": 30, "quantity": 1}]',
    30.00,
    'pending',
    '{"name": "Test User", "email": "test@example.com"}',
    'test_session_123',
    'paid'
) ON CONFLICT (id) DO NOTHING;
