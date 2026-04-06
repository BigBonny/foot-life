-- Create guest_orders table for storing guest checkout information
CREATE TABLE IF NOT EXISTS guest_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'France',
  cart_items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for guest_orders
ALTER TABLE guest_orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on guest_orders
CREATE POLICY "Allow all on guest_orders" ON guest_orders
  FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON guest_orders TO anon, authenticated;

-- Create index on email for faster lookups
CREATE INDEX idx_guest_orders_email ON guest_orders(email);
