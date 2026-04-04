-- Database Schema Update for Jerseys
-- Run this first to ensure your products table supports all jersey fields

-- Add new columns to products table if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB,
ADD COLUMN IF NOT EXISTS sizes TEXT[],
ADD COLUMN IF NOT EXISTS colors TEXT[],
ADD COLUMN IF NOT EXISTS is_personalized BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false;

-- Add a new stock_sizes column for detailed stock (safer than changing existing stock)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_sizes JSONB;

-- If you want to keep the old stock column for backward compatibility, 
-- you can populate it with total stock from sizes
UPDATE products 
SET stock = COALESCE((stock_sizes->>'S')::int, 0) + 
               COALESCE((stock_sizes->>'M')::int, 0) + 
               COALESCE((stock_sizes->>'L')::int, 0) + 
               COALESCE((stock_sizes->>'XL')::int, 0)
WHERE stock_sizes IS NOT NULL;

-- Check the current table structure
\d products;

-- After running this, you can import the jerseys with:
-- Copy contents of jerseys/jerseys-import.sql
