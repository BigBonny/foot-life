-- Pre-Deployment Fixes
-- Run these if any issues are found

-- 1. Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create cart_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    custom_name TEXT,
    custom_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Disable RLS for cart_items (to match personalized_jerseys)
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- 4. Disable RLS for orders (for now)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- 6. Verify all tables exist
SELECT 
    'products' as table_name, 
    (SELECT COUNT(*) FROM products) as count
UNION ALL
SELECT 
    'cart_items' as table_name, 
    (SELECT COUNT(*) FROM cart_items) as count
UNION ALL
SELECT 
    'personalized_jerseys' as table_name, 
    (SELECT COUNT(*) FROM personalized_jerseys) as count
UNION ALL
SELECT 
    'orders' as table_name, 
    (SELECT COUNT(*) FROM orders) as count;
