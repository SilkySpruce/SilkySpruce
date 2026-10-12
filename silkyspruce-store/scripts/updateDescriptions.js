require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 
// Note: If RLS is enabled, you may need to use your SERVICE_ROLE_KEY to bypass security for a bulk update.
const supabase = createClient(supabaseUrl, supabaseKey);

function cleanDescription(text) {
  if (!text) return text;
  let cleaned = text;

  // 1. Remove over-the-top AI filler sentences
  const aiPhrases = [
    /Sometimes strength grows quietly deep at the roots\.?/gi,
    /Nature knew exactly what she was doing\.?/gi,
    /Aging gracefully doesn['’]t mean doing nothing, it means choosing the kindest care for your skin\.?/gi,
    /Revive your roots\.? Restore your crown\.?/gi,
    /Fresh energy in every drop\.?/gi,
    /Sometimes your skin just needs a little kindness\.?/gi,
    /Sometimes, simple is powerful\.?/gi,
    /Breakouts happen but harsh treatments don['’]t have to\.?/gi,
    /Embrace the power of/gi,
    /Indulge in/gi,
    /Elevate your skincare routine/gi,
    /Symphony of/gi,
    /Every jar is a return to nature\.?/gi,
    /Let your hair thrive naturally\.?/gi,
    /Because real protection doesn['’]t have to feel heavy\.?/gi,
    /Pure petals\.? Pure care\.? Pure you\.?/gi,
    /Simple\.? Healing\.? Full of heart\.?/gi,
    /Clean naturally\.? Live simply\.? Care deeply\.?/gi,
    /Clear naturally\.? Heal gently\.? Glow confidently\.?/gi,
    /Nourish deeply\.? Glow naturally\.? Celebrate your skin\.?/gi,
    /Strengthen naturally\.? Nourish deeply\.? Glow confidently\.?/gi
  ];

  for (const phrase of aiPhrases) {
    cleaned = cleaned.replace(phrase, '');
  }

  // 2. Replace forbidden words and dashes
  const replacements = {
    'botanicals': 'plant extracts',
    'botanical': 'plant based',
    'rituals': 'routines',
    'ritual': 'routine',
    'anti-aging': 'anti aging',
    'plant-powered': 'plant based',
    'plant-based': 'plant based',
    'self-care': 'personal care',
    'acne-prone': 'acne prone',
    'broad-spectrum': 'broad spectrum',
    'mineral-based': 'mineral based',
    'skin-soothing': 'skin soothing',
    'fast-absorbing': 'fast absorbing',
    'non-comedogenic': 'will not block pores',
    'non-greasy': 'non greasy',
    'cold-pressed': 'cold pressed',
    'steam-distilled': 'steam distilled',
    'multi-purpose': 'multi purpose',
    'anti-acne': 'anti acne',
    'cruelty-free': 'cruelty free',
    '—': ' ', // Em-dash
    '-': ' '  // Hyphen
  };

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, 'gi');
    cleaned = cleaned.replace(regex, value);
  }

  // 3. Fix formatting edge cases left by replacements
  cleaned = cleaned.replace(/is embodies/g, 'embodies');
  cleaned = cleaned.replace(/How to use>/g, 'How to use:');
  cleaned = cleaned.replace(/clarity\.Helps/g, 'clarity. Helps');
  cleaned = cleaned.replace(/\.{3,}/g, '.'); // Remove trailing dot ellipses

  // 4. Clean up excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

async function runUpdate() {
  console.log("Fetching products...");
  
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, slug, short_description, long_description');

  if (fetchError) {
    console.error("Error fetching products:", fetchError);
    return;
  }

  console.log(`Found ${products.length} products. Cleaning descriptions...`);

  for (const product of products) {
    const newShort = cleanDescription(product.short_description);
    const newLong = cleanDescription(product.long_description);

    const { error: updateError } = await supabase
      .from('products')
      .update({
        short_description: newShort,
        long_description: newLong
      })
      .eq('id', product.id);

    if (updateError) {
      console.error(`Failed to update ${product.slug}:`, updateError);
    } else {
      console.log(`✅ Updated: ${product.slug}`);
    }
  }

  console.log("All product descriptions have been successfully updated!");
}

runUpdate();