import Link from 'next/link';

// Placeholder data based on your mockup
const BLOG_POSTS = [
  {
    id: 1,
    date: "JULY 3, 2026",
    title: "Hello World 1",
    excerpt: "Welcome to Blog",
    slug: "hello-world-1"
  },
  {
    id: 2,
    date: "JULY 3, 2026",
    title: "Hello World 2",
    excerpt: "Welcome to Blog 2",
    slug: "hello-world-2"
  },
  {
    id: 3,
    date: "JULY 3, 2026",
    title: "Hello World 3",
    excerpt: "Welcome to Blog 3",
    slug: "hello-world-3"
  },
  {
    id: 4,
    date: "JULY 3, 2026",
    title: "Hello World 4",
    excerpt: "Welcome to Blog 4",
    slug: "hello-world-4"
  },
  {
    id: 5,
    date: "JULY 3, 2026",
    title: "Hello World 5",
    excerpt: "Welcome to Blog 5",
    slug: "hello-world-5"
  },
  {
    id: 6,
    date: "JULY 3, 2026",
    title: "Hello World 6",
    excerpt: "Welcome to Blog 6",
    slug: "hello-world-6"
  }
];

export default function BlogPage() {
  return (
    <div className="blog-container">
      
      {/* PAGE HEADER */}
      <div className="blog-header">
        <h1 className="blog-title">Nature's Finest</h1>
        <h2 className="blog-subtitle">Insights and Inspirations from Our Blog</h2>
      </div>

      {/* BLOG GRID */}
      <div className="blog-grid">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="blog-card">
            
            {/* Image Placeholder Area */}
            <div className="blog-image-placeholder"></div>
            
            {/* Content Area */}
            <div className="blog-content">
              <p className="blog-date">{post.date}</p>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              
              <Link href={`/blog/${post.slug}`} className="read-article-btn">
                READ ARTICLE
              </Link>
            </div>
            
          </article>
        ))}
      </div>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .blog-container {
          width: 100%;
          max-width: 90rem;
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .blog-header {
          margin-bottom: 4rem;
        }
        .blog-title {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .blog-subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
        }
        @media (min-width: 768px) {
          .blog-title {
            font-size: 3.5rem;
          }
          .blog-subtitle {
            font-size: 1.75rem;
          }
        }

        /* Grid Setup */
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Card Styling */
        .blog-card {
          border: 1px solid #2A2A2A;
          display: flex;
          flex-direction: column;
          background-color: transparent;
          min-height: 35rem; /* Ensures cards are tall like the mockup */
        }
        
        .blog-image-placeholder {
          width: 100%;
          height: 18rem; /* Takes up the top half of the card */
          background-color: transparent;
        }

        .blog-content {
          padding: 0 2rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .blog-date {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .blog-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .blog-excerpt {
          font-size: 1rem;
          color: #ffffff;
          margin-bottom: 2rem;
          flex-grow: 1; /* Pushes the button to the bottom */
        }

        .read-article-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 1rem;
          border: 1px solid #ffffff;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }
        .read-article-btn:hover {
          background-color: #ffffff;
          color: #000000;
        }
      `}</style>
    </div>
  );
}