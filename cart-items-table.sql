-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  custom_name TEXT,
  custom_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
