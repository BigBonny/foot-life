-- Fix RLS policies for cart_items table
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

-- Create simple policy that allows all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON cart_items
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
