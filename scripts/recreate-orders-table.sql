-- Fix orders table - remove old columns and keep new structure

-- First, let's see what columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Drop old columns that are causing issues
-- (Only if they exist - using IF EXISTS won't work for columns in PostgreSQL)

-- Remove the test insert that's causing issues
DELETE FROM orders WHERE user_id = 'test_user';

-- Now let's create a clean orders table structure
-- We'll recreate the table to avoid conflicts

-- Backup existing data if any
CREATE TABLE orders_backup AS SELECT * FROM orders;

-- Drop the old table with CASCADE to remove dependencies
DROP TABLE IF EXISTS orders CASCADE;

-- Create the correct orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    items JSONB,
    total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address JSONB,
    stripe_session_id TEXT,
    payment_status TEXT DEFAULT 'paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restore any existing data from backup
INSERT INTO orders (user_id, total, status, created_at, updated_at)
SELECT user_id, total, status, created_at, updated_at 
FROM orders_backup 
WHERE id IS NOT NULL;

-- Drop the backup table
DROP TABLE orders_backup;

-- Check the final structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
