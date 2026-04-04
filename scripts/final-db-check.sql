-- Quick deployment readiness database check
SELECT 
    'products' as table_name,
    COUNT(*) as count,
    'jerseys imported' as status
FROM products 
WHERE images IS NOT NULL

UNION ALL

SELECT 
    'cart_items' as table_name,
    COUNT(*) as count,
    'cart persistence' as status
FROM cart_items

UNION ALL

SELECT 
    'orders' as table_name,
    COUNT(*) as count,
    'order management' as status
FROM orders

UNION ALL

SELECT 
    'personalized_jerseys' as table_name,
    COUNT(*) as count,
    'customization' as status
FROM personalized_jerseys

ORDER BY table_name;
