-- Check what tables depend on orders
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND ccu.table_name = 'orders';

-- Check if order_items table exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'order_items';
