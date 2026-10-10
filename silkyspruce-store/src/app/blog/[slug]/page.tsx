import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// Centralized Blog Content Data
const BLOG_CONTENT: Record<string, any> = {
  'the-power-of-the-rose': {
    title: "The Power of the Rose: Why Our Anti-Aging Glow Oil is a Fan Favorite",
    date: "APRIL 17, 2026",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/AntiAgingGlowOil1.jpg?v=1746893646",
    content: (
      <>
        <p>There’s a reason the <strong>Silky Spruce Anti-Aging glow oil</strong> has become the most-loved product in the Silky Spruce collection. It isn't just about hydration; it’s about the legendary benefits of the Rose essential oil.</p>
        <p>For centuries, Rose has been the ultimate secret for skin that looks refined, calm, and luminous. In our signature blend, we’ve combined this floral powerhouse with high-performance botanicals to create a "Glow Oil" that delivers visible results from the very first drop.</p>
        
        <h3>The 'Rose Effect'</h3>
        <p>Why do we insist on Rose? Because it does what synthetic ingredients can’t.</p>
        <ul>
          <li><strong>Refining Texture:</strong> Rose helps to soothe the skin and minimize the appearance of redness, making your complexion look more even and polished.</li>
          <li><strong>Natural Radiance:</strong> It works alongside <em>Rosehip oil</em> to brighten dull areas, giving you that healthy, rested look—even on your busiest days.</li>
          <li><strong>The Scent of wellness:</strong> Beyond the skin, the delicate scent of Rose provides a moment of calm in your daily routine, turning your skincare into a self-care ritual.</li>
        </ul>

        <h3>The Foundation of the Glow</h3>
        <p>While the Rose provides the soul of the product, the "workhorses" keep your skin protected:</p>
        <ul>
          <li><strong>Argan Oil:</strong> Often called "Liquid Gold," it provides the deep nourishment aging skin needs to stay supple and bouncy.</li>
          <li><strong>Jojoba Oil:</strong> It ensures the oil never feels heavy. It absorbs quickly, leaving your skin feeling silky, not slick.</li>
        </ul>

        <h3>How to Use Your Silky Spruce Anti-aging glow oil Like a Pro</h3>
        <p>To keep your skin looking its best, we recommend the <strong>Layering Secret</strong>:</p>
        <ol>
          <li>Cleanse your face as usual.</li>
          <li>While your skin is still slightly damp, apply 3 drops of the Anti-aging glow oil.</li>
          <li>Gently massage in upward circles. This helps the Rose and Argan oils penetrate deeper, locking in the moisture from your wash for a dewier finish that lasts all day.</li>
        </ol>

        <h3>Authentic, Plant-Based Care</h3>
        <p>At Silky Spruce, we don't believe in "overloading" your skin. We believe in high-quality, plant-based ingredients that respect your skin’s natural balance. Our Anti-Aging Glow Oil is proof that nature knows best.</p>
      </>
    )
  },
  'best-body-butter-eczema-kenya': {
    title: "Best Body Butter for Eczema in Kenya (What Actually Works)",
    date: "APRIL 10, 2026",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhippedButterVanilla.jpg?v=1746896431",
    content: (
      <>
        <p>If you’ve ever dealt with eczema, then you already know…<br/>it’s not just “dry skin.”<br/>It’s the itching.<br/>The flare-ups that come out of nowhere.<br/>The frustration of trying product after product and still not getting relief.</p>
        <p>I’ve been there.</p>
        <p>Not just as a skincare formulator and brand owner, but as someone with sensitive, reactive skin. My journey with skin challenges pushed me to start Silky Spruce — because I couldn’t keep trusting products that didn’t understand my skin.</p>
        <p>And if you’re reading this, maybe your skin is asking for the same thing:<br/><strong>gentle, honest care that actually works.</strong></p>
        
        <h3>So… what makes a good body butter for eczema?</h3>
        <p>Let’s keep it simple. Your skin doesn’t need noise. It needs calm, nourishment, and consistency.</p>
        
        <p><strong>1. Deep moisture (not just surface shine)</strong><br/>Eczema-prone skin loses moisture fast. Ingredients like Shea butter, Cocoa butter, Mango butter, Natural oils, Glycerine, and Vitamin E help seal in hydration and protect your skin barrier.</p>
        
        <p><strong>2. Ingredients that soothe, not trigger</strong><br/>Some products smell amazing… but your skin pays the price. If your skin is sensitive, avoid heavy artificial fragrances, harsh preservatives, and alcohol-based formulas. Instead, go for calming ingredients like gentle plant oils.</p>
        
        <p><strong>3. Consistency over quick fixes.</strong><br/>This one took me time to accept. There’s no overnight miracle. But when you use the right product consistently, your skin begins to trust again.</p>

        <h3>What I learned while creating Silky Spruce</h3>
        <p>I didn’t start this brand from a place of “business.” I started from a place of need. I needed something:</p>
        <ul>
          <li>Rich but not suffocating</li>
          <li>Gentle but still effective</li>
          <li>Natural but still luxurious</li>
        </ul>
        
        <p>So I went back to basics. Whipped butters. Plant oils. Ingredients I could understand. And slowly, my skin responded. Not perfectly. But better… calmer… healthier.</p>

        <h3>How to use body butter for eczema (this matters)</h3>
        <p>Even the best body butter won’t work if you use it the wrong way. Here’s what makes a difference:</p>
        <ul>
          <li>Apply on slightly damp skin (after a shower is perfect)</li>
          <li>Don’t overuse — a little goes a long way</li>
          <li>Be consistent (your skin notices patterns)</li>
        </ul>

        <h3>So, what is the best body butter for eczema in Kenya?</h3>
        <p>The honest answer? The one your skin feels safe with. Not the most expensive. Not the most hyped. Just the one that moisturizes deeply, doesn’t irritate you, and feels gentle every single day.</p>

        <h3>Final thoughts</h3>
        <p>If your skin has been struggling, I want you to know this: You’re not “too sensitive.” Your skin just needs the right kind of care. Take your time. Listen to it. And choose products that respect it. That’s exactly what Silky Spruce was created for.</p>
        <p><em>From me to you:</em> If you’ve been trying to find a body butter that actually works for eczema-prone skin here in Kenya… I see you. And I hope you find something that finally feels like relief.</p>
      </>
    )
  },
  'bebe-balm-natural-solution': {
    title: "Silky Spruce Bebe Balm: The Natural Solution for Dry, Sensitive Skin",
    date: "NOVEMBER 22, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/BebeBalm.jpg?v=1747777466",
    content: (
      <>
        <p><strong>Gentle, pure, and crafted with care.</strong></p>
        <p>Dry skin can be uncomfortable — especially when it shows up on babies, people with sensitive skin conditions, or anyone living in harsh weather. At Silky Spruce, we believe in healing skin with love and nature. That’s why we created our <strong>Bebe Balm</strong>, a deeply nourishing, all-natural formula designed to calm and moisturize even the driest, most delicate skin.</p>
        <p>In this blog, we will explore what makes Bebe Balm special, how it works, and why it has quickly become a favorite for families who want safe, plant-based skincare that actually brings relief.</p>
        
        <h3>What Is Silky Spruce Bebe Balm?</h3>
        <p>Our Bebe Balm is a rich, creamy blend of raw Shea butter, raw honey, beeswax, olive oil, sweet almond oil, and vitamin E.</p>
        <p>Every ingredient is chosen intentionally to:</p>
        <ul>
          <li>✔️ Restore moisture</li>
          <li>✔️ Soothe irritation</li>
          <li>✔️ Strengthen the skin barrier</li>
          <li>✔️ Protect the skin from dryness</li>
        </ul>
        <p>It melts beautifully into the skin, leaving it soft, supple, and naturally glowing.</p>
        
        <h3>Key Benefits of Bebe Balm for Dry Skin</h3>
        <p><strong>1. Deep Moisture That Lasts All Day</strong><br/>Raw Shea butter is one of nature’s most powerful emollients. It deeply hydrates dry patches and creates a soft, protected layer on the skin.</p>
        <p><strong>2. Natural Healing From Raw Honey</strong><br/>Honey is known for its natural humectant and antibacterial properties. It draws in moisture while helping soothe dry, itchy, or irritated skin.</p>
        <p><strong>3. Gentle Protection With Beeswax</strong><br/>Beeswax forms a breathable shield on the skin, locking in moisture without clogging pores. Perfect for delicate or sensitive skin.</p>
        <p><strong>4. Rich in Vitamins & Antioxidants</strong><br/>Olive oil, sweet almond oil, and vitamin E nourish the skin barrier, keeping it healthy, soft, and resilient.</p>
        <p><strong>5. Safe for Babies, Sensitive Skin & Adults</strong><br/>There are no synthetic fragrances, no harsh chemicals, no petroleum, and no irritants — just the goodness of pure, natural oils and butters.</p>

        <h3>Who Can Use Bebe Balm?</h3>
        <p>Bebe Balm is perfect for:</p>
        <ul>
          <li>Babies with dry or flaky skin</li>
          <li>Adults with sensitive, reactive, or eczema-prone skin.</li>
          <li>People living in dry, dusty, cold, or windy climates.</li>
          <li>Anyone looking for a clean, plant-based balm that works.</li>
        </ul>
        <p>It’s a family essential — one jar that everyone in the house can enjoy.</p>

        <h3>How to Use Bebe Balm</h3>
        <p>Use Bebe Balm on: Dry patches, Elbows and knees, Chapped cheeks, Cracked heels, Baby skin folds, Rough hands, Lips, Eczema-prone areas (as a soothing moisturizer). <em>Full body, goodness.</em></p>
        <p>A little goes a long way — warm a small amount between your fingers and gently massage into the skin.</p>

        <h3>Why Choose Silky Spruce?</h3>
        <p>At Silky Spruce, we create skincare with a purpose. Our philosophy is simple:</p>
        <p><em>Heal with love. Not with harshness. Not with chemicals. Just pure ingredients that your skin understands.</em></p>
        <p>Bebe Balm reflects everything we stand for — natural comfort, cruelty-free beauty, and products made with intention.</p>
      </>
    )
  },
  'hair-grows-naturally': {
    title: "Hair Grows Naturally — No Oil Can Grow Your Hair",
    date: "OCTOBER 28, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/HairGrowthStimulator.jpg?v=1746892625",
    content: (
      <>
        <p><strong>Let’s be honest, no oil can create hair growth out of nothing.</strong></p>
        <p>Hair grows naturally, from within. It’s a process fueled by healthy scalp circulation, nutrition, and consistent care — not quick fixes or miracle claims.</p>
        <p>So, if hair grows on its own, why did we create the <strong>Silky Spruce Hair Growth Stimulator</strong>? Because growth needs <em>support</em>, not promises.</p>

        <p>Our Natural Hair Growth Stimulator Oil is carefully crafted to nourish the scalp, stimulate hair follicles, and strengthen roots, allowing your hair to grow at its natural best.</p>
        
        <h3>Each ingredient has a purpose:</h3>
        <ul>
          <li><strong>Black Castor Oil</strong> – deeply conditions and boosts circulation to the scalp.</li>
          <li><strong>Black Seed Oil</strong> – supports thicker, stronger strands and helps reduce hair fall.</li>
          <li><strong>Flaxseed Oil</strong> – rich in omega-3s that lock in moisture and improve elasticity.</li>
          <li><strong>Olive Oil</strong> – softens and protects hair from breakage.</li>
          <li><strong>Camphor</strong> – cools the scalp, enhances blood flow, and awakens dormant follicles.</li>
          <li><strong>Peppermint & Rosemary Oils</strong> – invigorate the scalp and promote healthy circulation.</li>
          <li><strong>Eucalyptus Oil</strong> – clarifies and refreshes the scalp for better absorption.</li>
          <li><strong>Sweet Almond Oil</strong> – adds shine and strengthens fragile ends.</li>
        </ul>

        <p>When combined, these natural ingredients stimulate, nourish, and protect the scalp — creating the right environment for healthy, steady growth.</p>
        <p>We don’t claim to make hair grow overnight. We help your scalp do what it’s already designed to do, grow beautiful, strong, natural hair.</p>
        <p><strong>Silky Spruce :</strong> Because your hair knows how to grow. We just help it thrive.</p>
      </>
    )
  },
  'treat-dry-skin-naturally': {
    title: "How to Treat Dry Skin Naturally: Top Plant-Based Remedies",
    date: "MAY 20, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/CoconutButterLotion.jpg?v=1747662755",
    content: (
      <>
        <p>Dry skin doesn’t ask for much. It just wants to be heard. When it tightens, flakes, itches—that’s not a flaw. It’s a signal. A quiet way of saying, <em>“Something’s missing.”</em></p>
        <p>Sometimes the culprit is obvious. Cold air. Long showers. That body wash that smells like candy but burns by day three. Sometimes it’s what you <em>don’t</em> notice: alcohol buried in the ingredients list, a forgotten drink of water, too much heat, too little rest.</p>
        <p>Most fixes just sit on the surface. They coat, they promise, they fade. But your skin needs more than a cover-up. It needs food. Oil. Water. Repair.</p>
        <p>Plant-based care doesn’t fight the skin. It feeds it. It calms, hydrates, and holds space for healing without the burn. This guide is a map. No jargon. No 10-step routine. Just a simple way back to comfort—using what nature already made, and your skin already knows.</p>

        <h3>Common Causes of Dry Skin</h3>
        <p>Dry skin doesn’t just happen. It builds up quietly, over time. Cold air pulls moisture out. Wind strips the surface. The sun, though warm, can dry you from the outside in. Long showers don’t help. Neither do soaps that lather like a commercial and leave your skin feeling tight two minutes later.</p>
        <p>Then there’s what we put on our skin: alcohols, sulfates, synthetic fragrances. Harsh by design. Designed to smell good, feel foamy, sell fast.</p>
        <p>But skin also dries from the inside. Not drinking enough water. Not eating enough fats. Hormonal shifts. Stress. Age. It’s all connected.</p>
        <p>The good news? You don’t have to fight it. You just have to stop making it worse and give your skin what it needs. Simple care. Clean ingredients. Less noise. More nourishment. That’s where we’re headed.</p>

        <h3>What Dry Skin Really Needs</h3>
        <p>Water helps but it’s not enough. Dry skin needs structure. Lipids to hold it together. Occlusives to keep the moisture in. Nutrients that feed it from the outside. Without these, water just evaporates and you’re back where you started.</p>
        <p>The real fix? Ingredients that support the skin barrier. Not strip it. Shea butter, sunflower oil, aloe. Things your skin recognizes. Things it can actually use.</p>
        <p>Gentle routines work better than aggressive ones. You don’t need six serums or two kinds of exfoliation. You need calm. You need consistency. Less is more. Fewer products. Fewer ingredients. A routine that gives your skin a break instead of a battle.</p>

        <h3>Top Plant-Based Remedies for Dry Skin</h3>
        
        <p><strong>1. Shea Butter</strong><br/>Shea doesn’t just sit on the skin—it stays. Rich in fatty acids, full of vitamins A and E, it seals in moisture without smothering your pores. Use it on cracked hands, dry lips, heels that have seen better days. Skin soaks it up.</p>
        
        <p><strong>2. Cocoa Butter</strong><br/>This one goes deep. Cocoa butter hydrates from the inside out and carries natural antioxidants that help your skin repair. Rough elbows? Calloused feet? This is your fix.</p>
        
        <p><strong>3. Aloe Vera</strong><br/>Aloe doesn’t try too hard. It cools, calms, and quietly hydrates. Perfect for skin that’s red, itchy, or just tired. Use it as a mist, or layer it under oil to lock it all in.</p>
        
        <img src="https://cdn.shopify.com/s/files/1/0680/5579/3708/files/AloeVeraGel1.jpg?v=1746892911" alt="Silky Spruce Aloe Vera Gel" className="article-inline-image" />

        <p><strong>4. Coconut Oil (Use With Care)</strong><br/>It traps moisture and keeps skin soft. It also has antibacterial benefits. Works well on the body, especially after a shower when your skin is damp. Not always great for faces—listen to your skin.</p>
        
        <p><strong>5. Sweet Almond or Sunflower Oil</strong><br/>Light, fast-absorbing, and rich in vitamin E. These oils feed the skin without leaving it greasy. Use them solo or blend them into your favorite butter. They’re dependable, every-day kind of oils.</p>
        
        <p><strong>6. Oatmeal</strong><br/>Colloidal oatmeal isn’t fancy but it’s powerful. It soothes, softens, and helps with eczema, flaking, and irritation. Add it to a warm bath or turn it into a simple paste for a calming mask.</p>
        
        <p><strong>7. Honey</strong><br/>Raw honey draws moisture into the skin like nothing else. It’s healing, antibacterial, and perfect for DIY masks, especially when mixed with aloe or yogurt. Let it sit. Let it do its work.</p>

        <h3>Why Silky Spruce Believes in Plant-Powered Relief</h3>
        <p>We don’t make products in a lab. We make them in small batches—with our hands, our story, and your skin in mind.</p>
        <p>At Silky Spruce, we believe dry, sensitive skin doesn’t need more products. It needs better ones. So we skip the synthetic fragrances, the parabens, the watered-down promises. What we use is simple and proven: shea for deep repair, aloe to calm, sunflower oil to nourish, cocoa butter to protect.</p>
        <p>We don’t follow trends. We follow results—because we’ve lived with the flare-ups, the stinging, the constant search for something that won’t make things worse.</p>

        <h3>Get Started with What Works</h3>
        <p>Dry skin doesn’t ask for much. It just needs the right kind of care—simple, real, and rooted in nature. You don’t need ten steps. You need shea that heals, oils that feed, and butters that stay. That’s what we make.</p>
      </>
    )
  },
  'why-skin-loves-shea-butter': {
    title: "Why Your Skin Loves Shea Butter (And How to Use It Daily)",
    date: "MAY 20, 2025",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/NiloticSheaButter.jpg?v=1747764559",
    content: (
      <>
        <p>Some ingredients come and go. Shea butter stays. It’s not a trend. It’s a staple used for generations to soften skin, soothe irritation, and lock in moisture without the fuss.</p>
        <p>Pressed from the nuts of the African shea tree, this rich, creamy butter is nature’s way of saying, <em>“I’ve got you.”</em> If you have dry, sensitive, or easily irritated skin, you won’t need convincing for long. One jar, one application, and your skin knows it’s home.</p>
        <p>What makes shea butter different isn’t just how well it works. It’s how <strong>simply</strong> it works. No long lists of ingredients. No fillers. Just a single, powerful substance that calms, heals, and hydrates.</p>
        
        <h3>What Is Shea Butter?</h3>
        <p>Shea butter comes from the nuts of the African shea tree (Vitellaria paradoxa), found in the dry savannas of West Africa. For centuries, it's been used to nourish skin, protect against dryness, and heal small wounds long before skincare became a shelf full of options.</p>
        <p>You’ll find shea butter in two forms: <strong>unrefined</strong> and <strong>refined</strong>. Unrefined shea is raw, minimally processed, and retains its natural scent, color, and nutrients. It’s rich, earthy, and full of skin-loving vitamins. Refined shea, on the other hand, is bleached, deodorized, and often stripped of its healing properties. It’s smoother, yes, but less effective.</p>
        
        <p>Shea butter can be used in different textures:</p>
        <ul>
          <li><strong>Raw:</strong> solid, slightly grainy until it melts in your hands</li>
          <li><strong>Whipped:</strong> light, airy, and easier to spread</li>
          <li><strong>Infused:</strong> blended into lotions or balms with other oils</li>
        </ul>
        <p>At Silky Spruce, we prefer shea in its most honest form—whipped or blended, but never watered down. Because your skin deserves the real thing.</p>

        <h3>Benefits of Shea Butter for the Skin</h3>
        <p><strong>1. Deep Moisture:</strong> Shea butter is rich in essential fatty acids—oleic, stearic, and linoleic—that sink deep into the skin. These fats create a soft, breathable barrier that locks in hydration without clogging pores.</p>
        <p><strong>2. Soothing and Anti-Inflammatory:</strong> Thanks to its natural cinnamic acid content, shea butter calms inflammation and reduces redness. It’s a go-to for those dealing with eczema, psoriasis, or post-shave irritation.</p>
        <p><strong>3. Skin Softening and Smoothing:</strong> Rough patches? Shea butter smooths them out—elbows, knees, heels, and anywhere that feels forgotten.</p>
        <p><strong>4. Rich in Vitamins A & E:</strong> These two vitamins work behind the scenes—supporting cell regeneration and helping your skin heal from minor scars, stretch marks, or sun exposure.</p>

        <h3>Daily Ways to Use Shea Butter</h3>
        <ul>
          <li><strong>As a Daily Moisturizer:</strong> Right after your shower, while your skin is still damp. A small scoop goes a long way. Work it into your arms, feet, elbows, knees.</li>
          <li><strong>For Face Care (In Moderation):</strong> Use it on dry days. Cold days. After wind or too much sun. Press a little between your palms and pat it onto your skin at night.</li>
          <li><strong>Lip Balm Alternative:</strong> You don’t need a tube. Just a dab of shea on your lips and you're set.</li>
          <li><strong>Cuticle & Hand Treatment:</strong> Massage into your fingertips before bed. If your hands are cracked, layer it thick and wear cotton gloves overnight.</li>
        </ul>

        <h3>How to Choose Quality Shea Butter</h3>
        <p>Not all shea is equal. Some nourish. Some just fill a jar. Look for <strong>unrefined or raw, grade A shea butter</strong>. Color matters. Pure shea ranges from ivory to pale yellow. Texture should be smooth, not grainy or clumpy. Scent tells the truth. Real shea smells earthy, slightly nutty.</p>
        <p>Always read the label. Skip anything with mineral oils, synthetic fragrance, or parabens. Your skin deserves better.</p>

        <h3>Why We Love Shea Butter at Silky Spruce</h3>
        <p>At Silky Spruce, shea butter isn’t just an ingredient—it’s the heart of what we make. We source clean, plant-based shea that’s unrefined and rich with everything nature intended. No bleaching. No diluting. Just raw goodness with all its healing power intact.</p>
        <p>We create for sensitive skin because that’s our story, too. Skin that stings. Skin that flares. Skin that needs patience. That’s where this all began—and why shea butter will always have a place on our shelf.</p>
      </>
    )
  }
};

// ADDED ASYNC AND AWAIT FOR NEXT 15+ PARAMS
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_CONTENT[slug];

  // If the URL slug doesn't match any of our posts, trigger the 404 page securely
  if (!post) {
    notFound();
  }

  return (
    <div className="article-container">
      
      {/* Back Button */}
      <div className="article-navigation">
        <Link href="/blog" className="back-to-blog">
          <ArrowLeft size={20} /> Back to Journal
        </Link>
      </div>

      {/* Article Header */}
      <header className="article-header">
        <p className="article-date">{post.date}</p>
        <h1 className="article-title">{post.title}</h1>
      </header>

      {/* Hero Image */}
      <div className="article-hero-wrapper">
        <img src={post.coverImage} alt={post.title} className="article-hero-image" />
      </div>

      {/* Article Body */}
      <article className="article-body">
        {post.content}
      </article>

      <style>{`
        .article-container {
          width: 100%;
          max-width: 50rem; /* Keeps reading width narrow for better typography */
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

        /* Rich Text Formatting */
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

        .article-body ul, .article-body ol {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
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