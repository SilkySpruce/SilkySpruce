require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
);

const categoryMappings = {
  "silky-spruce-essential-oil-rose": "Essential Oils",
  "silky-spruce-essential-oil-lemongrass": "Essential Oils",
  "silky-spruce-hair-growth-gel": "Hair Oils",
  "silky-spruce-sunscreen-cream": "Lotions",
  "silky-spruce-cold-pressed-yellow-castor-oil": "Hair Oils, Massage Oils, Body Oils",
  "silky-spruce-rose-water": "Lotions",
  "silky-spruce-anti-aging-glow-oil": "Massage Oils, Body Oils",
  "silky-spruce-virgin-coconut-oil": "Body Oils",
  "silky-spruce-multi-purpose-liquid-soap": "Soaps",
  "silky-spruce-anti-acne-oil": "Body Oils",
  "silky-spruce-hair-growth-stimulator-oil": "Hair Oils, Massage Oils",
  "silky-spruce-avocado-oil": "Massage Oils, Body Oils",
  "silky-spruce-silky-smooth-lip-balm": "Lip Care",
  "silky-spruce-whipped-body-butter-original-peppermint": "Body Butters",
  "silky-spruce-whipped-butter-sandalwood": "Body Butters",
  "silky-spruce-whipped-butter-lemon": "Body Butters",
  "silky-spruce-bebe-balm": "Body Butters",
  "silky-spruce-whipped-body-butter-vanilla": "Body Butters",
  "silky-spruce-essential-oil-lavender": "Essential Oils",
  "silky-spruce-essential-oil-tea-tree": "Essential Oils",
  "silky-spruce-essential-oil-mint": "Essential Oils",
  "silky-spruce-essential-oil-bergamot": "Essential Oils",
  "silky-spruce-essential-oil-rosemary": "Essential Oils",
  "silky-spruce-essential-oil-peppermint": "Essential Oils",
  "silky-spruce-essential-oil-cinnamon": "Essential Oils",
  "silky-spruce-essential-oil-frankincense": "Essential Oils",
  "silky-spruce-essential-oil-eucalyptus": "Essential Oils",
  "silky-spruce-nilotic-shea-butter": "Body Butters",
  "silky-spruce-vitamin-e-oil": "Massage Oils, Body Oils",
  "silky-spruce-essential-oil-sweet-orange": "Essential Oils",
  "silky-spruce-men-sunrise-punch-lotion": "Lotions",
  "silky-spruce-orange-whisper-lotion": "Lotions",
  "silky-spruce-cocoa-butter-lotion": "Lotions",
  "silky-spruce-virgin-castor-oil-100ml": "Hair Oils, Massage Oils, Body Oils",
  "silky-spruce-soaps": "Soaps",
  "silky-spruce-lip-balm": "Lip Care",
  "silky-spruce-lip-gloss": "Lip Care",
  "silky-spruce-massage-oil": "Massage Oils",
  "silky-spruce-neem-tea-tree-oil": "Body Oils",
  "silky-spruce-aloe-vera-gel": "Lotions",
  "sweet-almond-oil": "Massage Oils, Body Oils",
  "jojoba-oil": "Body Oils",
  "argan-oil": "Hair Oils, Body Oils",
  "rosehip-oil": "Massage Oils, Body Oils",
  "black-castor-oil": "Hair Oils, Massage Oils, Body Oils",
  "silky-spruce-beard-oil": "Hair Oils, Body Oils"
};

async function updateCategories() {
  console.log("Starting category updates...");
  let count = 0;

  for (const [slug, categoryString] of Object.entries(categoryMappings)) {
    const { error } = await supabase
      .from('products')
      .update({ category: categoryString })
      .eq('slug', slug);

    if (error) {
      console.error(`Failed to update ${slug}:`, error.message);
    } else {
      count++;
      console.log(`✅ Updated: ${slug} -> [${categoryString}]`);
    }
  }

  console.log(`\nSuccessfully updated ${count} products.`);
}

updateCategories();