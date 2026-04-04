-- Bulk Jersey Import Script
-- Run this in Supabase SQL Editor to create a temporary import function

-- First, let's create a function to bulk insert jerseys
CREATE OR REPLACE FUNCTION bulk_insert_jerseys()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    -- Sample jersey data - you can modify this
    jersey_data TEXT := '[
        {
            "id": "jersey_001",
            "name": "Maillot Domicile France 2024",
            "description": "Maillot officiel de l''équipe de France pour la Coupe du Monde 2024",
            "price": 89.99,
            "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "category": "national",
            "team": "france",
            "is_personalized": true,
            "is_best_seller": true,
            "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
            "colors": ["Bleu", "Blanc", "Rouge"],
            "stock": {
                "XS": 50,
                "S": 100,
                "M": 150,
                "L": 100,
                "XL": 75,
                "XXL": 25
            }
        },
        {
            "id": "jersey_002", 
            "name": "Maillot Extérieur Brésil 2024",
            "description": "Maillot extérieur officiel du Brésil avec design moderne",
            "price": 79.99,
            "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "category": "national",
            "team": "brazil",
            "is_personalized": true,
            "is_best_seller": false,
            "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
            "colors": ["Jaune", "Vert", "Bleu"],
            "stock": {
                "XS": 30,
                "S": 60,
                "M": 90,
                "L": 60,
                "XL": 45,
                "XXL": 15
            }
        }
    ]';
    
    record JSON;
BEGIN
    -- Loop through the JSON data and insert each jersey
    FOR record IN SELECT * FROM json_array_elements(jersey_data::json)
    LOOP
        INSERT INTO products (
            id,
            name,
            description, 
            price,
            image,
            category,
            team,
            is_personalized,
            is_best_seller,
            sizes,
            colors,
            stock,
            created_at,
            updated_at
        ) VALUES (
            record->>'id',
            record->>'name',
            record->>'description',
            (record->>'price')::decimal,
            record->>'image',
            record->>'category',
            record->>'team',
            (record->>'is_personalized')::boolean,
            (record->>'is_best_seller')::boolean,
            record->>'sizes',
            record->>'stock',
            record->>'colors',
            NOW(),
            NOW()
        );
    END LOOP;
    
    RAISE NOTICE 'Jerseys imported successfully!';
END;
$$;

-- Run the function
SELECT bulk_insert_jerseys();

-- Clean up the function
DROP FUNCTION bulk_insert_jerseys();
