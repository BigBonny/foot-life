-- Check sizes in database
-- Run this to verify jerseys have the correct sizes

SELECT 
    id,
    name,
    team,
    sizes,
    colors,
    stock_sizes
FROM products 
WHERE team IS NOT NULL 
LIMIT 5;

-- This should show the sizes array from the database (S, M, L, XL)
