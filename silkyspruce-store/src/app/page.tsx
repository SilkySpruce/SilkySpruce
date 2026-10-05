import { supabase } from '@/lib/supabase'

export const revalidate = 0; 

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_variants(price, size)')
    .order('created_at', { ascending: false });

  // If Supabase fails, show the error on screen
  if (error) {
    return (
      <main className="p-8 bg-white min-h-screen text-red-600 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
        <p className="font-mono bg-red-50 p-4 rounded">{error.message}</p>
        <p className="mt-4 text-gray-700">Make sure you restarted your server after creating the .env.local file.</p>
      </main>
    )
  }

  return (
    <main className="p-8 bg-white min-h-screen text-black max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Silky Spruce Catalog</h1>
      
      {/* If database is successfully connected but empty */}
      {(!products || products.length === 0) && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
          <p className="font-bold">No products found in the database.</p>
          <p>Open a new terminal tab and run: <code className="bg-yellow-100 px-1 rounded">node scripts/seed.js</code> to upload your spreadsheet data.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
            {product.featured_image && (
              <img 
                src={product.featured_image} 
                alt={product.name} 
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-lg font-semibold line-clamp-1">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{product.category?.split('>').pop()}</p>
            
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-green-700">
                Starting at KES {product.product_variants?.[0]?.price || 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}