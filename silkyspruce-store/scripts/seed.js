const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Note: We use the SERVICE_ROLE key here (which you posted earlier) to bypass security rules just for seeding. 
// Do NOT put this key in your .env.local or frontend code!
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaWt1bHBlYWNodW5jaHV2anlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTIxMTM5OSwiZXhwIjoyMTA2Nzg3Mzk5fQ.0GIR2qH2MnU0Yn7UpiDRBymMZM4pT_oolsQBrvtsBrU'; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
    console.log('Reading Excel file...');
    const workbook = xlsx.readFile('SilkySpruce_Master_Product_Catalog_v1-2.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const products = xlsx.utils.sheet_to_json(sheet);

    console.log(`Found ${products.length} products. Uploading to Supabase...`);

    for (const row of products) {
        // 1. Insert Product
        const { data: productData, error: productError } = await supabase
            .from('products')
            .insert([{
                product_code: row['Product Code'],
                name: row['Product Name'],
                slug: row['Slug'],
                category: row['Category'],
                short_description: row['Short Description'],
                long_description: row['Long Description'],
                featured_image: row['Featured Image'],
                gallery_images: row['Gallery Images'] ? row['Gallery Images'].split('\n') : []
            }])
            .select()
            .single();

        if (productError) {
            console.error(`Error inserting ${row['Product Name']}:`, productError.message);
            continue;
        }

        // 2. Insert Variants (Sizes and Prices)
        const sizes = String(row['Sizes']).split(',').map(s => s.trim());
        const prices = String(row['Prices']).split(',').map(p => parseFloat(p.trim()));

        const variants = sizes.map((size, index) => ({
            product_id: productData.id,
            size: size,
            price: prices[index] || prices[0] // Fallback to first price if mismatched
        }));

        const { error: variantError } = await supabase.from('product_variants').insert(variants);
        
        if (variantError) console.error(`Error inserting variants for ${row['Product Name']}:`, variantError.message);
        else console.log(`Successfully added: ${row['Product Name']}`);
    }
    
    console.log('✅ Database Seeding Complete!');
}

seedDatabase();