const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaWt1bHBlYWNodW5jaHV2anlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTIxMTM5OSwiZXhwIjoyMTA2Nzg3Mzk5fQ.0GIR2qH2MnU0Yn7UpiDRBymMZM4pT_oolsQBrvtsBrU'; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Custom map matching your screenshot filenames to your database products
const imageMapping = {
  'Silky Spruce Essential Oil – Rose': { featured: 'Rose.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Lemongrass': { featured: 'Lemongrass.jpeg', gallery: [] },
  'Silky Spruce Hair Growth Gel': { featured: 'Hair growth gel.jpeg', gallery: ['Hair growth gel2.jpeg', 'Hair growth gel3.jpeg'] },
  'Silky Spruce Sunscreen Cream': { featured: 'Sunscreen.jpg', gallery: [] },
  'Silky Spruce Cold Pressed Castor Oil (120ml)': { featured: 'Cold pressed yellow castor oil 120ml.jpeg', gallery: [] },
  'Silky Spruce Rose Water': { featured: 'Rose water 250, 100ml.jpeg', gallery: [] },
  'Silky Spruce Anti-Aging Glow Oil': { featured: 'Anti-aging glow oil 60ml.jpeg', gallery: [] },
  'Silky Spruce Virgin Coconut Oil': { featured: 'Virgin coconut oil.jpeg', gallery: ['Virgin coconut oil2.jpeg'] },
  'Silky Spruce Hair Growth Stimulator Oil': { featured: 'Hair growth stimulator 250, 120, 60ml.jpeg', gallery: [] },
  'Silky Spruce Whipped Body Butter – Original Peppermint': { featured: 'Peppermint.jpeg', gallery: [] },
  'Silky Spruce Whipped Butter – Lemon': { featured: 'Lemon whipped butter.jpeg', gallery: ['Lemon whipped butter2.jpeg'] },
  'Silky Spruce Bebe Balm': { featured: 'Bebe balm.jpeg', gallery: [] },
  'Silky Spruce Whipped Body Butter – Vanilla': { featured: 'Vanilla whipped butter.jpeg', gallery: ['Vanilla whipped butter2.jpeg'] },
  'Silky Spruce Essential Oil – Lavender': { featured: 'Lavender.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Tea Tree': { featured: 'Tea tree.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Mint': { featured: 'Mint.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Bergamot': { featured: 'Bergamot.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Rosemary': { featured: 'Rosemary.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Peppermint': { featured: 'Peppermint.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Cinnamon': { featured: 'Cinammon.jpeg', gallery: [] }, 
  'Silky Spruce Essential Oil – Frankincense': { featured: 'Frankincense.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Eucalyptus': { featured: 'Eucalyptus.jpeg', gallery: [] },
  'Silky Spruce Essential Oil – Sweet Orange': { featured: 'Sweet orange.jpeg', gallery: ['Sweet orange2.jpeg'] },
  'Silky Spruce Orange Whisper Lotion': { featured: 'Orange whisper lotion.jpeg', gallery: [] },
  'Silky Spruce Cocoa Butter Lotion': { featured: 'Cocoa butter lotion.jpg', gallery: [] },
  'Silky Spruce Neem & Tea Tree Oil': { featured: 'Neem and tea tree oil.jpeg', gallery: [] },
  'Silky Spruce Aloe Vera Gel': { featured: 'Aloe vera.jpeg', gallery: [] },
  'Silky Spruce Sweet Almond Oil': { featured: 'Sweet almond oil 120ml.jpeg', gallery: [] },
  'Silky Spruce Argan Oil': { featured: 'Argan Oil.jpeg', gallery: ['Argan oil2.jpeg'] },
  'Silky Spruce Rosehip Oil': { featured: 'Rosehip oil.jpeg', gallery: ['Rosehip oil2.jpeg'] },
  'Silky Spruce Black Castor Oil': { featured: 'Black castor oil 120,60ml.jpeg', gallery: [] },
  'Silky Spruce Beard Oil': { featured: 'Beard oil.jpeg', gallery: [] }
};

async function updateImages() {
  console.log('Starting image update process...');
  let successCount = 0;

  for (const [productName, images] of Object.entries(imageMapping)) {
    // We add /products/ in front of the filename to map to your Next.js public folder
    const featuredPath = `/products/${images.featured}`;
    const galleryPaths = images.gallery.map(img => `/products/${img}`);

    const { error } = await supabase
      .from('products')
      .update({ 
        featured_image: featuredPath, 
        gallery_images: galleryPaths 
      })
      .eq('name', productName);

    if (error) {
      console.error(`❌ Failed to update ${productName}:`, error.message);
    } else {
      console.log(`✅ Updated ${productName}`);
      successCount++;
    }
  }

  console.log(`\nDone! Successfully mapped images for ${successCount} products.`);
}

updateImages();