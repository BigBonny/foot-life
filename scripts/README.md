# Jersey Bulk Import System

I've created a complete bulk import system for your jerseys! Here are three ways to easily add 100+ jerseys:

## 🚀 Method 1: Auto-Generate Sample Jerseys (Fastest)

1. **Run the generator script:**
   ```bash
   cd scripts
   node generate-jerseys.js
   ```

2. **This creates:**
   - `jerseys-data.json` - 90 sample jerseys (10 teams × 3 categories × 3 years)
   - `jerseys-import.sql` - Ready-to-run SQL insert statements

3. **Import to Supabase:**
   - Open Supabase SQL Editor
   - Copy contents of `jerseys-import.sql`
   - Run the script

## 📊 Method 2: CSV Import (Your Own Data)

1. **Create a CSV file** with these columns:
   ```
   id,name,description,price,image,category,team,is_personalized,is_best_seller,sizes,colors,stock
   jersey_001,"Maillot France 2024","Description...",89.99,"image_url","national","france",true,true,"["XS","S","M","L","XL","XXL"]","["Bleu","Blanc","Rouge"]","{"XS":50,"S":100}"
   ```

2. **Use the SQL script** in `bulk-jersey-import.sql` to import

## 🎯 Method 3: Custom Template

Edit `generate-jerseys.js` to:
- Add your own teams
- Modify prices
- Change descriptions
- Add custom images

## 📈 What Gets Generated:

**Teams Included:**
- France, Brésil, Allemagne, Argentine, Espagne
- Italie, Portugal, Angleterre, Pays-Bas, Belgique

**Categories:**
- Domicile, Extérieur, Troisième

**Years:**
- 2022, 2023, 2024

**Features:**
- Random pricing (€69.99 - €109.99)
- Random stock levels
- 30% best-sellers
- All sizes available
- Team-specific colors
- Personalization enabled

## 🛠 Quick Start:

```bash
# Install Node.js if needed
# Then run:
npm install
cd scripts
node generate-jerseys.js
```

This will give you 90 professional-looking jerseys instantly! You can then:
- Edit individual jerseys in Supabase
- Add more teams to the generator
- Import your own CSV data

The system handles all the complex JSON formatting for sizes, colors, and stock automatically!
