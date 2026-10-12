import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BLOG_CONTENT: Record<string, any> = {
  'the-power-of-the-rose': {
    title: "The Power of the Rose: Why Our Anti Aging Glow Oil is a Fan Favorite",
    date: "APRIL 17, 2026",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/AntiAgingGlowOil1.jpg?v=1746893646",
    content: (
      <>
        <p>The <strong>Silky Spruce Anti Aging glow oil</strong> is the most popular product in our collection for a good reason. It offers more than just hydration. It brings the well known benefits of Rose essential oil to your daily routine.</p>
        <p>People have used Rose for centuries to achieve calm and bright skin. Our unique blend mixes this flower with highly effective plant extracts. This creates a glow oil that shows results from the first use.</p>
        
        <h3>The Rose Effect</h3>
        <p>We choose Rose because it achieves results that artificial ingredients cannot.</p>
        <ul>
          <li><strong>Refining Texture</strong> - Rose soothes the skin and reduces redness. This gives your complexion an even and polished appearance.</li>
          <li><strong>Natural Radiance</strong> - Rose works with Rosehip oil to brighten dull areas. This gives you a healthy and rested appearance even on busy days.</li>
          <li><strong>The Scent of Wellness</strong> - The gentle scent of Rose adds a sense of calm to your daily routine. It turns your skincare into a relaxing practice.</li>
        </ul>

        <h3>The Foundation of the Glow</h3>
        <p>Rose is the main focus, but other key ingredients protect your skin:</p>
        <ul>
          <li><strong>Argan Oil</strong> - People often call it liquid gold. It provides the deep moisture that aging skin needs to stay firm and flexible.</li>
          <li><strong>Jojoba Oil</strong> - This oil keeps the blend light. It absorbs quickly and leaves your skin feeling smooth instead of greasy.</li>
        </ul>

        <h3>How to Use Your Silky Spruce Anti aging glow oil</h3>
        <p>We recommend the layering method to keep your skin looking its best.</p>
        <ol>
          <li>Cleanse your face normally.</li>
          <li>Apply three drops of the Anti aging glow oil while your skin is still slightly damp.</li>
          <li>Massage gently in upward circles. This helps the Rose and Argan oils absorb completely. It locks in the moisture from washing and provides a fresh finish that lasts all day.</li>
        </ol>

        <h3>Authentic Plant Based Care</h3>
        <p>At Silky Spruce, we avoid using too many products on your skin. We trust high quality plant based ingredients that support your skin's natural balance. Our Anti Aging Glow Oil shows that nature provides the best solutions.</p>
      </>
    )
  },
  'best-body-butter-eczema-kenya': {
    title: "Best Body Butter for Eczema in Kenya",
    date: "APRIL 10, 2026",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhippedButterVanilla.jpg?v=1746896431",
    content: (
      <>
        <p>If you have ever experienced eczema, you know it is more than just dry skin.<br/>It involves severe itching and sudden flare ups.<br/>It is frustrating to try many products without finding relief.</p>
        <p>I understand this completely.</p>
        <p>I am a skincare creator and business owner, but I also have very sensitive skin. My own skin challenges inspired me to start Silky Spruce. I could no longer trust products that did not suit my needs.</p>
        <p>If you are reading this, your skin likely needs the same thing. It needs gentle and reliable care that provides real results.</p>
        
        <h3>What makes a good body butter for eczema?</h3>
        <p>We should keep things simple. Your skin needs calm, nourishment, and steady care.</p>
        
        <ul>
          <li><strong>Deep Moisture</strong> - Eczema prone skin loses moisture very quickly. Ingredients like Shea butter, Cocoa butter, Mango butter, natural oils, Glycerine, and Vitamin E lock in hydration. They also protect your skin barrier.</li>
          <li><strong>Soothing Ingredients</strong> - Some products smell wonderful, but they irritate your skin. Sensitive skin should avoid heavy artificial fragrances, strong preservatives, and alcohol based formulas. Choose calming ingredients like gentle plant oils instead.</li>
          <li><strong>Consistent Care</strong> - This took time for me to accept. There is no instant cure. However, your skin will improve when you use the right product consistently.</li>
        </ul>

        <h3>What I Learned Creating Silky Spruce</h3>
        <p>I did not start this brand just to run a business. I started it out of personal necessity. I needed a product that was rich but breathable, gentle yet effective, and natural but luxurious.</p>
        <p>I went back to basics. I used whipped butters and plant oils. I chose ingredients I fully understood. Slowly, my skin started to improve. It became calmer and healthier.</p>

        <h3>How to Use Body Butter for Eczema</h3>
        <p>The best body butter requires the right application method to work properly. Here is the best approach.</p>
        <ul>
          <li>Apply the butter to slightly damp skin right after a shower.</li>
          <li>Do not use too much. A small amount is highly effective.</li>
          <li>Apply it consistently so your skin adapts to a healthy routine.</li>
        </ul>

        <h3>What is the Best Body Butter for Eczema in Kenya?</h3>
        <p>The honest answer is the one your skin tolerates best. It is not about the highest price or the biggest trend. It is the product that moisturizes deeply, causes no irritation, and feels gentle every day.</p>

        <h3>Final Thoughts</h3>
        <p>If your skin is struggling, please know that you are not too sensitive. Your skin simply requires the correct type of care. Take your time and pay attention to its needs. Choose products that support its health. That is exactly why Silky Spruce exists.</p>
        <p>From me to you. If you are looking for a body butter that works for eczema prone skin in Kenya, I understand your struggle. I hope you finally find the relief you deserve.</p>
      </>
    )
  },
  'bebe-balm-natural-solution': {
    title: "Silky Spruce Bebe Balm: The Natural Solution for Dry and Sensitive Skin",
    date: "NOVEMBER 22, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/BebeBalm.jpg?v=1747777466",
    content: (
      <>
        <p><strong>Gentle, pure, and crafted with care.</strong></p>
        <p>Dry skin causes discomfort, especially for babies, people with sensitive skin, or anyone living in harsh weather conditions. At Silky Spruce, we believe in healing the skin naturally. This inspired us to create our <strong>Bebe Balm</strong>. It is a deeply nourishing and entirely natural formula designed to calm and moisturize the most delicate skin.</p>
        <p>In this post, we explain what makes Bebe Balm special and how it works. We also share why it has become a favorite for families seeking safe, plant based skincare that provides real relief.</p>
        
        <h3>What Is Silky Spruce Bebe Balm?</h3>
        <p>Our Bebe Balm is a rich and creamy blend of raw Shea butter, raw honey, beeswax, olive oil, sweet almond oil, and vitamin E.</p>
        <p>We choose every ingredient intentionally to:</p>
        <ul>
          <li>Restore moisture</li>
          <li>Soothe irritation</li>
          <li>Strengthen the skin barrier</li>
          <li>Protect against dryness</li>
        </ul>
        <p>It melts smoothly into the skin. It leaves your skin feeling soft, flexible, and naturally glowing.</p>
        
        <h3>Key Benefits of Bebe Balm for Dry Skin</h3>
        <ul>
          <li><strong>Deep Moisture That Lasts All Day</strong> - Raw Shea butter is an incredibly powerful moisturizer. It deeply hydrates dry areas and creates a soft protective layer on the skin.</li>
          <li><strong>Natural Healing From Raw Honey</strong> - Honey naturally attracts moisture and has antibacterial properties. It draws hydration into the skin while soothing dry or irritated areas.</li>
          <li><strong>Gentle Protection With Beeswax</strong> - Beeswax forms a breathable shield over your skin. It locks in moisture without blocking your pores, making it perfect for sensitive skin.</li>
          <li><strong>Rich in Vitamins and Antioxidants</strong> - Olive oil, sweet almond oil, and vitamin E nourish the skin barrier. They keep your skin healthy and resilient.</li>
          <li><strong>Safe for Babies, Sensitive Skin, and Adults</strong> - We do not use synthetic fragrances, harsh chemicals, petroleum, or irritants. You only get the benefits of pure natural oils and butters.</li>
        </ul>

        <h3>Who Can Use Bebe Balm?</h3>
        <p>Bebe Balm is ideal for babies with dry or flaky skin. It is also great for adults with sensitive or eczema prone skin. People living in dry, dusty, cold, or windy climates will find it very helpful. It is for anyone looking for a clean, plant based balm that truly works.</p>
        <p>It is a household essential. One jar serves the entire family.</p>

        <h3>How to Use Bebe Balm</h3>
        <p>You can use Bebe Balm on dry patches, elbows, knees, chapped cheeks, and cracked heels. It is also excellent for baby skin folds, rough hands, lips, and eczema prone areas. It works beautifully across the entire body.</p>
        <p>A small amount is very effective. Warm a little bit between your fingers and gently massage it into the skin.</p>

        <h3>Why Choose Silky Spruce?</h3>
        <p>We create skincare with a clear purpose. Our philosophy is simple. We aim to heal without harshness or chemicals. We use only pure ingredients that support your skin.</p>
        <p>Bebe Balm reflects our core values. It offers natural comfort, cruelty free production, and purposeful ingredients.</p>
      </>
    )
  },
  'hair-grows-naturally': {
    title: "Hair Grows Naturally: No Oil Can Grow Your Hair",
    date: "OCTOBER 28, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/HairGrowthStimulator.jpg?v=1746892625",
    content: (
      <>
        <p><strong>We must be honest. No oil can create hair growth out of nothing.</strong></p>
        <p>Hair grows naturally from within. It is a process driven by healthy scalp circulation, proper nutrition, and consistent care. It does not happen through quick fixes or miracle claims.</p>
        <p>If hair grows on its own, why did we create the <strong>Silky Spruce Hair Growth Stimulator</strong>? We created it because healthy growth requires correct support instead of empty promises.</p>

        <p>Our Natural Hair Growth Stimulator Oil is carefully made to nourish the scalp, stimulate hair follicles, and strengthen roots. This allows your hair to grow at its absolute best.</p>
        
        <h3>Each ingredient serves a specific purpose.</h3>
        <ul>
          <li><strong>Black Castor Oil</strong> - deeply conditions the skin and boosts circulation to the scalp.</li>
          <li><strong>Black Seed Oil</strong> - supports thicker strands and helps reduce hair fall.</li>
          <li><strong>Flaxseed Oil</strong> - is rich in omega fats that lock in moisture and improve hair flexibility.</li>
          <li><strong>Olive Oil</strong> - softens your hair and protects it from breaking.</li>
          <li><strong>Camphor</strong> - cools the scalp, improves blood flow, and stimulates resting follicles.</li>
          <li><strong>Peppermint and Rosemary Oils</strong> - refresh the scalp and promote healthy circulation.</li>
          <li><strong>Eucalyptus Oil</strong> - cleanses and refreshes the scalp for better nutrient absorption.</li>
          <li><strong>Sweet Almond Oil</strong> - adds shine and strengthens fragile hair ends.</li>
        </ul>

        <p>When we combine these natural ingredients, they stimulate, nourish, and protect your scalp. This creates the perfect environment for healthy and steady hair growth.</p>
        <p>We do not claim to make hair grow overnight. We simply help your scalp do what it is already designed to do. We help it grow beautiful, strong, and natural hair.</p>
        <p><strong>Silky Spruce</strong> understands that your hair knows how to grow. We are here to help it thrive.</p>
      </>
    )
  },
  'treat-dry-skin-naturally': {
    title: "How to Treat Dry Skin Naturally: Top Plant Based Remedies",
    date: "MAY 20, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/CoconutButterLotion.jpg?v=1747662755",
    content: (
      <>
        <p>Dry skin does not ask for much. It simply wants attention. When it tightens, flakes, or itches, that is not a flaw. It is a signal. It is a quiet way of saying that something is missing.</p>
        <p>Sometimes the cause is obvious. Cold air, long showers, or a highly scented body wash can cause irritation over time. Sometimes the cause is less obvious. Hidden alcohol in ingredient lists, dehydration, too much heat, or a lack of rest can all play a part.</p>
        <p>Most solutions only treat the surface. They coat the skin temporarily and then fade away. However, your skin needs more than a temporary cover. It needs nutrition, oil, water, and repair.</p>
        <p>Plant based care works with your skin rather than fighting it. It provides calm hydration and allows the skin to heal without stinging. This guide offers a clear path forward. We avoid confusing terms and complicated routines. We offer a simple way back to comfort using natural ingredients your skin already recognizes.</p>

        <h3>Common Causes of Dry Skin</h3>
        <p>Dry skin rarely happens overnight. It builds up quietly over time. Cold air removes moisture. Wind damages the surface. The sun can dry you out from the outside in. Long hot showers and harsh soaps leave your skin feeling tight shortly after use.</p>
        <p>The products we apply also matter. Many contain alcohol, sulfates, and synthetic fragrances. These are designed to smell pleasant and create foam, but they are often too harsh for daily use.</p>
        <p>Skin also dries from the inside. A lack of water, a diet low in healthy fats, hormonal changes, stress, and aging are all connected to skin health.</p>
        <p>The good news is that you do not have to fight it. You just need to stop making it worse and give your skin exactly what it needs. Simple care with clean ingredients provides the best nourishment.</p>

        <h3>What Dry Skin Really Needs</h3>
        <p>Water is helpful, but it is not enough on its own. Dry skin needs structure. It requires fats to hold it together and protective layers to keep the moisture trapped inside. Without these elements, water just evaporates and leaves your skin dry again.</p>
        <p>The true solution involves ingredients that support the skin barrier instead of stripping it away. Shea butter, sunflower oil, and aloe are excellent choices. Your skin recognizes them and uses them effectively.</p>
        <p>Gentle routines work much better than aggressive ones. You do not need multiple serums or heavy exfoliation. Your skin requires calm and consistency. Using fewer products with fewer ingredients gives your skin a chance to rest and recover.</p>

        <h3>Top Plant Based Remedies for Dry Skin</h3>
        
        <ul>
          <li><strong>1. Shea Butter</strong> - Shea butter stays on the skin instead of evaporating. It is rich in fatty acids and packed with vitamins A and E. It seals in moisture without blocking your pores. It is perfect for cracked hands, dry lips, and rough heels.</li>
          <li><strong>2. Cocoa Butter</strong> - Cocoa butter provides deep hydration. It moisturizes from the inside out and delivers natural antioxidants that help your skin repair itself. It is the perfect solution for rough elbows and calloused feet.</li>
          <li><strong>3. Aloe Vera</strong> - Aloe vera provides gentle cooling and calm hydration. It is perfect for skin that is red, itchy, or tired. You can use it as a light mist or layer it under an oil to lock in the moisture.</li>
        </ul>
        
        <img src="https://cdn.shopify.com/s/files/1/0680/5579/3708/files/AloeVeraGel1.jpg?v=1746892911" alt="Silky Spruce Aloe Vera Gel" className="article-inline-image" />

        <ul>
          <li><strong>4. Coconut Oil</strong> - Coconut oil traps moisture and keeps the skin very soft. It also offers antibacterial benefits. It works very well on the body, especially when applied to damp skin after a shower. It may be too heavy for the face, so pay attention to how your skin responds.</li>
          <li><strong>5. Sweet Almond or Sunflower Oil</strong> - These oils are light, absorb quickly, and are rich in vitamin E. They feed the skin without leaving a greasy feeling behind. You can use them on their own or blend them into your favorite body butter.</li>
          <li><strong>6. Oatmeal</strong> - Oatmeal is simple but highly effective. It soothes and softens the skin while helping with eczema, flaking, and general irritation. You can add it to a warm bath or mix it into a paste for a calming mask.</li>
          <li><strong>7. Honey</strong> - Raw honey draws moisture into the skin incredibly well. It is healing and antibacterial. It works perfectly in homemade masks, especially when mixed with aloe.</li>
        </ul>

        <h3>Why Silky Spruce Believes in Plant Powered Relief</h3>
        <p>We do not manufacture products in large industrial labs. We make them in small batches with genuine care and your skin in mind.</p>
        <p>At Silky Spruce, we believe sensitive skin needs better products, not more products. We completely avoid synthetic fragrances, parabens, and empty promises. We use simple and proven ingredients. We use shea for deep repair, aloe to calm, sunflower oil to nourish, and cocoa butter to protect.</p>
        <p>We follow results instead of trends. We understand the frustration of flare ups, stinging, and the endless search for products that will not make things worse.</p>

        <h3>Get Started with What Works</h3>
        <p>Dry skin simply requires the right kind of care. You need simple, genuine, and natural solutions. You do not need a complicated routine. You need shea that heals, oils that nourish, and butters that provide lasting protection. That is exactly what we create.</p>
      </>
    )
  },
  'why-skin-loves-shea-butter': {
    title: "Why Your Skin Loves Shea Butter",
    date: "MAY 20, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/NiloticSheaButter.jpg?v=1747764559",
    content: (
      <>
        <p>Some skincare ingredients come and go, but Shea butter remains a permanent fixture. It is not a passing trend. People have used it for generations to soften skin, soothe irritation, and lock in moisture without any complications.</p>
        <p>Extracted from the nuts of the African shea tree, this rich and creamy butter provides exceptional natural protection. If you have dry, sensitive, or easily irritated skin, you will see the benefits almost immediately. A single application feels incredibly comforting.</p>
        <p>What makes shea butter unique is its simplicity. It does not require a long list of ingredients or artificial fillers. It is a single, highly effective substance that calms, heals, and hydrates your skin.</p>
        
        <h3>What Is Shea Butter?</h3>
        <p>Shea butter originates from the nuts of the African shea tree found in the dry regions of West Africa. For centuries, people have used it to nourish skin, protect against dryness, and heal minor wounds.</p>
        <p>You will typically find shea butter in two forms. These are unrefined and refined. Unrefined shea is raw and undergoes minimal processing. This allows it to retain its natural scent, color, and nutrients. It is earthy and packed with beneficial vitamins. Refined shea is bleached and deodorized. This process makes it smoother but strips away many of its healing properties, making it much less effective.</p>
        
        <p>You can use shea butter in several different textures.</p>
        <ul>
          <li><strong>Raw</strong> - This is solid and slightly textured until the warmth of your hands melts it.</li>
          <li><strong>Whipped</strong> - This is light, airy, and very easy to spread across the skin.</li>
          <li><strong>Infused</strong> - This is blended into lotions or balms alongside other natural oils.</li>
        </ul>
        <p>At Silky Spruce, we prefer shea in its most genuine form. We whip it or blend it, but we never water it down. Your skin deserves a high quality product.</p>

        <h3>Benefits of Shea Butter for the Skin</h3>
        <ul>
          <li><strong>1. Deep Moisture</strong> - Shea butter is rich in essential fatty acids. These fats sink deep into the skin and create a soft, breathable barrier. This barrier locks in hydration without blocking your pores.</li>
          <li><strong>2. Soothing Properties</strong> - Shea butter contains natural compounds that calm inflammation and reduce redness. It is an excellent choice for people dealing with eczema, psoriasis, or skin irritation after shaving.</li>
          <li><strong>3. Skin Softening</strong> - Shea butter smooths out rough areas beautifully. It works wonders on elbows, knees, heels, and any other dry patches.</li>
          <li><strong>4. Rich in Vitamins A and E</strong> - These two vitamins support cell renewal. They help your skin recover from minor scars, stretch marks, and sun exposure.</li>
        </ul>

        <h3>Daily Ways to Use Shea Butter</h3>
        <ul>
          <li><strong>As a Daily Moisturizer</strong> - Apply it right after your shower while your skin is still damp. A small amount covers a large area. Massage it thoroughly into your arms, feet, elbows, and knees.</li>
          <li><strong>For Face Care</strong> - Use it carefully on very dry or cold days. It is also helpful after exposure to wind or intense sun. Press a small amount between your palms and gently pat it onto your skin at night.</li>
          <li><strong>Lip Balm Alternative</strong> - You do not need a commercial lip tube. A small dab of shea butter on your lips provides excellent hydration.</li>
          <li><strong>Cuticle and Hand Treatment</strong> - Massage it into your fingertips before bed. If your hands are severely cracked, apply a thick layer and wear cotton gloves overnight for deep repair.</li>
        </ul>

        <h3>How to Choose Quality Shea Butter</h3>
        <p>Not all shea butter provides the same benefits. Some truly nourish the skin, while others act only as cheap fillers. You should always look for unrefined or raw Grade A shea butter. Color is a good indicator of quality. Pure shea ranges from ivory to pale yellow. Texture should be smooth and melt easily. Scent also reveals the truth. Genuine shea has a mild, earthy, and slightly nutty smell.</p>
        <p>Always read the product label. You should avoid anything containing mineral oils, synthetic fragrances, or parabens. Your skin deserves better care.</p>

        <h3>Why We Love Shea Butter at Silky Spruce</h3>
        <p>At Silky Spruce, shea butter is the core of our brand. We source clean, plant based shea that is entirely unrefined. It retains all the rich nutrients nature intended. We never bleach or dilute it. We preserve all of its natural healing power.</p>
        <p>We formulate products for sensitive skin because we understand those struggles personally. We know what it is like to deal with skin that stings, flares up, and requires extreme patience. That personal experience is where our journey began, and it is the reason shea butter will always hold the most important place on our shelves.</p>
      </>
    )
  }
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_CONTENT[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="article-container">
      
      <div className="article-navigation">
        <Link href="/blog" className="back-to-blog">
          <ArrowLeft size={20} /> Back to Journal
        </Link>
      </div>

      <header className="article-header">
        <p className="article-date">{post.date}</p>
        <h1 className="article-title">{post.title}</h1>
      </header>

      <div className="article-hero-wrapper">
        <img src={post.coverImage} alt={post.title} className="article-hero-image" />
      </div>

      <article className="article-body">
        {post.content}
      </article>

      <style>{`
        .article-container {
          width: 100%;
          max-width: 50rem; 
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        .article-navigation {
          margin-bottom: 3rem;
        }

        .back-to-blog {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.2s;
        }

        .back-to-blog:hover {
          color: #788E7D;
        }

        .article-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .article-date {
          font-size: 0.875rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #788E7D;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .article-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        @media (min-width: 768px) {
          .article-title {
            font-size: 3.5rem;
          }
        }

        .article-hero-wrapper {
          width: 100%;
          margin-bottom: 4rem;
          overflow: hidden;
          border: 1px solid #2A2A2A;
        }

        .article-hero-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }

        .article-body {
          font-size: 1.125rem;
          color: #d1d5db;
          line-height: 1.8;
        }

        .article-body p {
          margin-bottom: 1.5rem;
        }

        .article-body h3 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #ffffff;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 0.5rem;
        }

        /* 
         * FIX: Explicitly forcing standard bullet points (disc) 
         * and numbers (decimal) to display on lists 
         */
        .article-body ul {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
          list-style-type: disc; 
        }

        .article-body ol {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
          list-style-type: decimal; 
        }

        .article-body li {
          margin-bottom: 0.75rem;
        }
        
        .article-body strong {
          color: #ffffff;
          font-weight: 600;
        }

        .article-body em {
          color: #9ca3af;
          font-style: italic;
        }

        .article-inline-image {
          width: 100%;
          height: auto;
          margin: 3rem 0;
          border: 1px solid #2A2A2A;
        }
      `}</style>
    </div>
  );
}