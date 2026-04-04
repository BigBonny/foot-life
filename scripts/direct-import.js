const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample jersey data - you can modify this array
const jerseys = [
  {
    id: 'jersey_001',
    name: 'Maillot Domicile France 2024',
    description: 'Maillot officiel de l\'équipe de France pour la Coupe du Monde 2024',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    category: 'national',
    team: 'france',
    is_personalized: true,
    is_best_seller: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Bleu', 'Blanc', 'Rouge'],
    stock: {
      'XS': 50,
      'S': 100,
      'M': 150,
      'L': 100,
      'XL': 75,
      'XXL': 25
    }
  },
  {
    id: 'jersey_002',
    name: 'Maillot Extérieur Brésil 2024',
    description: 'Maillot extérieur officiel du Brésil avec design moderne',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    category: 'national',
    team: 'brazil',
    is_personalized: true,
    is_best_seller: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Jaune', 'Vert', 'Bleu'],
    stock: {
      'XS': 30,
      'S': 60,
      'M': 90,
      'L': 60,
      'XL': 45,
      'XXL': 15
    }
  }
  // Add more jerseys here...
];

async function importJerseys() {
  console.log('Starting jersey import...');
  
  try {
    for (const jersey of jerseys) {
      console.log(`Importing: ${jersey.name}`);
      
      const { data, error } = await supabase
        .from('products')
        .upsert(jersey, {
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error(`Error importing ${jersey.name}:`, error);
      } else {
        console.log(`✅ Successfully imported: ${jersey.name}`);
      }
    }
    
    console.log(`\n🎉 Import complete! Processed ${jerseys.length} jerseys.`);
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run the import
importJerseys();
