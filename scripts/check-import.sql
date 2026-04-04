-- Check if jerseys were imported
-- Run these queries in Supabase SQL Editor

-- 1. Check total products count
SELECT COUNT(*) as total_products FROM products;

-- 2. Check if jerseys exist (with images)
SELECT COUNT(*) as jersey_count FROM products WHERE images IS NOT NULL;

-- 3. Show sample jerseys
SELECT id, name, price, team, category, images IS NOT NULL as has_images 
FROM products WHERE images IS NOT NULL LIMIT 5;

-- 4. Check all products to see structure
SELECT id, name, price, category, team, images, sizes, colors, is_personalized 
FROM products ORDER BY created_at DESC LIMIT 10;

-- 5. Check if images column exists and has data
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name IN ('images', 'sizes', 'colors', 'stock_sizes');
