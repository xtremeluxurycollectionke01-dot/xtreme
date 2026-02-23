'use client'

import Image from "next/image"
import { ArrowRight, ShoppingBag, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Product {
  _id: string
  id: number
  name: string
  description?: string
  price: number
  image?: string
  stock: number
  created_at: string
  category_id?: number
  subcategory_id?: number
  brand_id?: number
}

// TODO: Update this with your actual image base URL when ready
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || ''

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const result = await response.json()
      console.log("API response:", result)

      // result.data is the array of products
      setProducts(result.data.slice(0, 8))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  fetchProducts()
}, [])


  // Helper to construct valid image URL
  const getImageUrl = (imagePath?: string): string | null => {
    if (!imagePath) return null
    
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    // If IMAGE_BASE_URL is set, prepend it
    if (IMAGE_BASE_URL) {
      return `${IMAGE_BASE_URL}/${imagePath}`
    }
    
    // Return null to trigger placeholder
    return null
  }

  // Shimmer Card Component
  const ShimmerCard = () => (
    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl border border-gray-800 overflow-hidden">
      {/* Image Shimmer */}
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <div className="absolute inset-0 shimmer-gradient" />
      </div>

      {/* Content Shimmer */}
      <div className="p-4 sm:p-5 lg:p-6 space-y-3">
        {/* Title shimmer */}
        <div className="h-5 bg-gray-800 rounded shimmer-gradient w-3/4" />
        
        {/* Description shimmer */}
        <div className="h-4 bg-gray-800 rounded shimmer-gradient w-full" />
        <div className="h-4 bg-gray-800 rounded shimmer-gradient w-2/3" />
        
        {/* Rating shimmer */}
        <div className="flex gap-1 pt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded-full shimmer-gradient" />
          ))}
        </div>

        {/* Price shimmer */}
        <div className="h-6 sm:h-7 bg-gray-800 rounded shimmer-gradient w-1/2 mt-2" />

        {/* Button shimmer */}
        <div className="h-10 sm:h-12 bg-gray-800 rounded-lg shimmer-gradient w-full mt-3" />
      </div>
    </div>
  )

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Shimmer */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-4">
            <div className="h-10 sm:h-12 lg:h-16 bg-gray-800 rounded shimmer-gradient w-64 sm:w-80 lg:w-96 mx-auto" />
            <div className="h-5 sm:h-6 lg:h-7 bg-gray-800 rounded shimmer-gradient w-full max-w-xl mx-auto" />
          </div>

          {/* Shimmer Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        </div>

        {/* Shimmer Animation Styles */}
        <style jsx>{`
          .shimmer-gradient {
            background: linear-gradient(
              90deg,
              rgba(31, 41, 55, 0.8) 25%,
              rgba(55, 65, 81, 0.9) 50%,
              rgba(31, 41, 55, 0.8) 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            Error loading products: {error}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Matching Hero/Collections typography */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
            FEATURED <span className="text-yellow-500">PRODUCTS</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Discover our latest premium designer footwear collection
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product, index) => {
            const imageUrl = getImageUrl(product.image)
            
            return (
              <div
                key={product._id}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-800">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      onError={(e) => {
                        // Fallback to placeholder on error
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                      <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-2" />
                      <span className="text-xs sm:text-sm text-gray-500">No image</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* New Badge - First 4 products */}
                  {index < 4 && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 sm:px-4 sm:py-1.5 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full text-yellow-400 text-xs sm:text-sm font-semibold">
                      NEW
                    </div>
                  )}

                  {/* Quick Add Button */}
                  <button className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 bg-black/50 backdrop-blur-sm rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded text-red-400 text-[10px] sm:text-xs font-semibold">
                      Only {product.stock} left
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2 py-1 bg-gray-500/20 backdrop-blur-sm border border-gray-500/50 rounded text-gray-400 text-[10px] sm:text-xs font-semibold">
                      Out of stock
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">(4.0)</span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-yellow-500">
                        <span className="text-xs text-gray-400">KSh</span>
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold ml-1">
                          {product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      disabled={product.stock === 0}
                      className={`mt-3 sm:mt-4 w-full py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
                        product.stock === 0
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'
                      }`}
                    >
                      {product.stock === 0 ? (
                        'Out of Stock'
                      ) : (
                        <>
                          Add to Cart
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button - Matching Hero/Collections CTA */}
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <a 
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-yellow-500 text-yellow-500 text-base sm:text-lg font-bold rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
          >
            View All Products
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts