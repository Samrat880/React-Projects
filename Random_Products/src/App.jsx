import React, { useEffect } from 'react'

function App() {

  const [products, setProducts] = React.useState([])

  const fetchproducts = async () => {
    const response = await fetch(
      "https://api.freeapi.app/api/v1/public/randomproducts",
    );
    const data = await response.json();
    const items = data?.data?.data ?? []
    setProducts(items)
  }

  useEffect (() => {
    fetchproducts()
  },[])

  return (
    <div className="bg-black min-h-screen ">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Product<span className="text-zinc-500">Verse</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Discover trending gadgets & tech
            </p>
          </div>

          <button
            onClick={fetchproducts}
            className="px-5 py-2 rounded-full bg-white text-black font-medium hover:scale-105 transition-all duration-300"
          >
            Load Products
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="break-inside-avoid mb-5 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:bg-zinc-950 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-5">
                <span className="text-xs uppercase tracking-widest text-zinc-500">
                  {product.category}
                </span>

                <h2 className="text-white text-xl font-semibold mt-2 line-clamp-1">
                  {product.title}
                </h2>

                <p className="text-zinc-400 text-sm mt-3 leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-white text-2xl font-bold">
                      ${product.price}
                    </p>

                    <p className="text-green-500 text-sm">
                      {product.discountPercentage}% OFF
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-yellow-400 text-sm">
                      ⭐ {product.rating}
                    </p>

                    <p className="text-zinc-500 text-xs mt-1">
                      {product.stock} left
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App