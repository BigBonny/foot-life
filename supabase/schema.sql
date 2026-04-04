-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('club', 'national')),
  team TEXT,
  season TEXT,
  type TEXT CHECK (type IN ('home', 'away', 'third')),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  street TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  size TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_team ON products(team);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for products (everyone can read, only authenticated can insert/update)
CREATE POLICY "Public products are viewable by everyone."
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products."
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products."
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policies for user profiles (users can only access their own profile)
CREATE POLICY "Users can view own profile."
  ON user_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile."
  ON user_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile."
  ON user_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Policies for orders (users can only access their own orders)
CREATE POLICY "Users can view own orders."
  ON orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders."
  ON orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policies for order items (accessible through orders)
CREATE POLICY "Order items are viewable by order owner."
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Policies for newsletter (anyone can insert, only authenticated can view)
CREATE POLICY "Anyone can subscribe to newsletter."
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view newsletter subscriptions."
  ON newsletter_subscriptions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO products (name, description, price, image, category, team, season, type, stock) VALUES
('Maillot Football Brésil Concept', 'Maillot concept du Brésil avec design moderne et couleurs traditionnelles.', 24.49, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'national', 'Brésil', '2024/25', 'home', 100),
('Maillot Football Chelsea Concept', 'Maillot concept Chelsea avec design innovant et couleurs emblématiques.', 29.99, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', 'club', 'Chelsea', '2024/25', 'home', 100),
('Maillot Football Real Madrid 25/26 away', 'Maillot extérieur Real Madrid saison 25/26, design élégant et moderne.', 34.99, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop', 'club', 'Real Madrid', '2025/26', 'away', 100),
('Maillot Football Ninho Jefe Paris FC 25-26', 'Maillot Paris FC édition spéciale Ninho Jefe, collection limitée.', 27.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 'club', 'Paris FC', '2025/26', 'home', 50),
('Maillot Football PSG 24/25', 'Maillot domicile PSG saison 24/25, design classique et élégant.', 39.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'club', 'PSG', '2024/25', 'home', 100),
('Maillot Football Brésil Concept Jesus', 'Maillot Brésil édition spéciale Jesus, design unique et exclusif.', 26.99, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', 'national', 'Brésil', '2024/25', 'home', 75),
('Maillot Football France 24/25', 'Maillot domicile France saison 24/25, couleurs nationales fières.', 32.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'national', 'France', '2024/25', 'home', 100),
('Maillot Football Manchester United 25/26', 'Maillot Manchester United saison 25/26, design rouge emblématique.', 36.99, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop', 'club', 'Manchester United', '2025/26', 'home', 100),
('Maillot Football Barcelona 24/25', 'Maillot Barcelona saison 24/25, design bleu et grenat classique.', 33.99, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', 'club', 'Barcelona', '2024/25', 'home', 100),
('Maillot Football Inter Miami Concept', 'Maillot concept Inter Miami, couleurs vibrantes et design moderne.', 28.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 'club', 'Inter Miami', '2024/25', 'home', 75),
('Maillot Football Bayern Munich Concept', 'Maillot concept Bayern Munich, design rouge puissant et moderne.', 31.99, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop', 'club', 'Bayern Munich', '2024/25', 'home', 100),
('Maillot Football Argentina 24/25', 'Maillot Argentine saison 24/25, champions du monde en titre.', 35.99, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', 'national', 'Argentina', '2024/25', 'home', 100);
