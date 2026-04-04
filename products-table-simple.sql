-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT CHECK (category IN ('club', 'national')) NOT NULL,
  team TEXT,
  season TEXT,
  type TEXT CHECK (type IN ('home', 'away', 'third')),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, image, category, team, season, type, stock) VALUES
('Maillot France Domicile 2024', 'Maillot officiel de l equipe de France pour l Euro 2024', 89.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'national', 'France', '2024', 'home', 50),
('Maillot PSG Domicile 2024', 'Maillot domicile Paris Saint-Germain saison 2024-2025', 129.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'club', 'PSG', '2024', 'home', 30),
('Maillot Manchester United Domicile', 'Maillot domicile Red Devils saison 2024-2025', 119.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'club', 'Manchester United', '2024', 'home', 25),
('Maillot Brésil Extérieur 2024', 'Maillot extérieur Brésil Copa America 2024', 94.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'national', 'Brésil', '2024', 'away', 40);
