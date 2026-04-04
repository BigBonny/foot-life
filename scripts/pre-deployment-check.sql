-- Pre-Deployment Database Check
-- Run these queries to ensure all tables are properly set up

-- 1. Check products table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 2. Check cart_items table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;

-- 3. Check personalized_jerseys table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'personalized_jerseys' 
ORDER BY ordinal_position;

-- 4. Check orders table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 5. Check RLS status on all tables
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname IN ('products', 'cart_items', 'personalized_jerseys', 'orders')
AND relkind = 'r';

-- 6. Check if jerseys have been imported
SELECT COUNT(*) as jersey_count FROM products WHERE images IS NOT NULL;

-- 7. Check sample data
SELECT id, name, team, sizes, colors FROM products WHERE images IS NOT NULL LIMIT 3;

-- 8. Check if cart_items table exists and has data
SELECT COUNT(*) as cart_items_count FROM cart_items;

-- 9. Check if personalized_jerseys table exists and has data
SELECT COUNT(*) as personalized_count FROM personalized_jerseys;

-- 10. Check if orders table exists and has data
SELECT COUNT(*) as orders_count FROM orders;
