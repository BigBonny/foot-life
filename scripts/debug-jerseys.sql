-- Debug Jersey Import
-- Run these queries step by step to find the issue

-- 1. Check if products table exists and has data
SELECT COUNT(*) as total_products FROM products;

-- 2. Check if jerseys were imported (look for products with images)
SELECT 
    COUNT(*) as jersey_count,
    COUNT(CASE WHEN images IS NOT NULL THEN 1 END) as with_images,
    COUNT(CASE WHEN team IS NOT NULL THEN 1 END) as with_team
FROM products;

-- 3. Show the most recent products (should include jerseys)
SELECT 
    id, 
    name, 
    price, 
    category, 
    team,
    images IS NOT NULL as has_images,
    created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Check if the new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('images', 'sizes', 'colors', 'stock_sizes', 'is_personalized', 'is_best_seller');

-- 5. Look for any jersey-specific products
SELECT * FROM products 
WHERE team IN ('atletico-madrid', 'barca', 'barcelone', 'brazil', 'chelsea', 'france', 'man-city', 'psg', 'real-madrid')
LIMIT 5;

-- 6. Check for any products with front/back image paths
SELECT id, name, image 
FROM products 
WHERE image LIKE '/jerseys/%' 
LIMIT 5;
