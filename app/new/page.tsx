// app/new/page.tsx
'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useMemo } from 'react'
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Clock, 
  Filter, 
  Grid3x3,
  ChevronDown,
  X,
  Heart,
  Eye
} from 'lucide-react'
import AddToCartButton from "@/components/AddToCartButton"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"

interface ProductImage {
  url: string
  alt?: string
  isPrimary?: boolean
}

interface Product {
  _id: string
  name: string
  description?: string
  price: number
  stock: number
  images?: ProductImage[]
  isFeatured?: boolean
  createdAt?: string
  category?: string
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || ''

const getPrimaryImage = (product: Product): string | null => {
  if (!product.images || product.images.length === 0) return null
  const primary = product.images.find(img => img.isPrimary)
  return primary?.url || product.images[0].url
}

// Categories for filtering
const categories = [
  { id: 'all', label: 'All New Arrivals' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'limited', label: 'Limited Edition' },
]

// Sort options
const sortOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
]

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        
        const result = await response.json()
        
        // Sort by newest first (assuming _id contains timestamp or using createdAt)
        // For demo, we'll take the first 12 as "new arrivals"
        // In production, you'd want to filter by date
        const sorted = result.data.sort((a: Product, b: Product) => {
          // If you have createdAt field, use that
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          // Fallback to _id if it contains timestamp (MongoDB ObjectId)
          return b._id.localeCompare(a._id)
        })
        
        setProducts(sorted)
        setFilteredProducts(sorted)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'popular':
          // You'd need a popularity field
          return (b as any).popularity || 0 - (a as any).popularity || 0
        case 'newest':
        default:
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          return b._id.localeCompare(a._id)
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy])

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Shimmer Card Component
  const ShimmerCard = () => (
    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl border border-gray-800 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <div className="absolute inset-0 shimmer-gradient" />
      </div>
      <div className="p-4 sm:p-5 lg:p-6 space-y-3">
        <div className="h-5 bg-gray-800 rounded shimmer-gradient w-3/4" />
        <div className="h-4 bg-gray-800 rounded shimmer-gradient w-full" />
        <div className="h-4 bg-gray-800 rounded shimmer-gradient w-2/3" />
        <div className="flex gap-1 pt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded-full shimmer-gradient" />
          ))}
        </div>
        <div className="h-6 sm:h-7 bg-gray-800 rounded shimmer-gradient w-1/2 mt-2" />
        <div className="h-10 sm:h-12 bg-gray-800 rounded-lg shimmer-gradient w-full mt-3" />
      </div>
    </div>
  )

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Shimmer */}
          <div className="text-center mb-12 space-y-4">
            <div className="h-12 sm:h-16 lg:h-20 bg-gray-800 rounded shimmer-gradient w-80 sm:w-96 lg:w-[500px] mx-auto" />
            <div className="h-6 sm:h-7 lg:h-8 bg-gray-800 rounded shimmer-gradient w-full max-w-2xl mx-auto" />
          </div>

          {/* Filter Bar Shimmer */}
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 w-32 bg-gray-800 rounded-lg shimmer-gradient" />
            <div className="h-10 w-40 bg-gray-800 rounded-lg shimmer-gradient" />
          </div>

          {/* Grid Shimmer */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        </div>

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
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500 py-20">
            Error loading products: {error}
          </div>
        </div>
      </main>
    )
  }

  return (
    <div>
        <Navbar />
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Fresh Drops</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>Updated Daily</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              New{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                Arrivals
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200">
              Be the first to rock the latest styles. Fresh drops added daily, 
              from streetwear essentials to exclusive limited editions.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 animate-fade-in-up delay-300">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{filteredProducts.length}+</div>
                <div className="text-sm text-gray-400">New Items</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">Daily</div>
                <div className="text-sm text-gray-400">Updates</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">Free</div>
                <div className="text-sm text-gray-400">Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-40 bg-black/80 backdrop-blur-lg border-y border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between sm:hidden w-full px-4 py-2 bg-gray-900 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-yellow-500" />
                <span>Filter & Sort</span>
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Category Filters - Desktop */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Sort Options - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 text-white border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="hidden sm:block text-sm text-gray-400">
              Showing <span className="text-yellow-500 font-medium">{filteredProducts.length}</span> new arrivals
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {isFilterOpen && (
            <div className="sm:hidden mt-4 space-y-4 border-t border-gray-800 pt-4">
              {/* Category Filters */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-900 text-gray-400'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-900 text-white border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🆕</div>
            <h3 className="text-2xl font-bold text-white mb-2">No new arrivals yet</h3>
            <p className="text-gray-400 mb-6">Check back soon for fresh drops!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* New Arrivals Banner */}
            <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-full">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Just Landed</h2>
                  <p className="text-sm text-gray-400">
                    {filteredProducts.length} new styles added this week
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => {
                const imageUrl = getPrimaryImage(product)
                const isNew = index < 4 // First 4 are newest
                const isWishlisted = wishlist.includes(product._id)

                return (
                  <div
                    key={product._id}
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20"
                    onMouseEnter={() => setHoveredId(product._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                      opacity: 0
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-800">
                      <Link href={`/products/${product._id}`}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-2" />
                            <span className="text-xs sm:text-sm text-gray-500">No image</span>
                          </div>
                        )}
                      </Link>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                      {/* New Badge */}
                      {isNew && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded-full shadow-lg animate-pulse">
                            JUST IN
                          </span>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="absolute top-3 right-3 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 transition-colors group/btn"
                      >
                        <Heart 
                          className={`h-4 w-4 transition-colors ${
                            isWishlisted 
                              ? 'fill-yellow-500 text-yellow-500' 
                              : 'text-white group-hover/btn:text-black'
                          }`} 
                        />
                      </button>

                      {/* Quick View Overlay */}
                      <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                        hoveredId === product._id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}>
                        <Link
                          href={`/products/${product._id}`}
                          className="p-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors transform hover:scale-110"
                        >
                          <Eye className="h-5 w-5 text-black" />
                        </Link>
                      </div>

                      {/* Stock Badge */}
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute bottom-3 left-3 z-10 px-2 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded text-red-400 text-[10px] sm:text-xs font-semibold">
                          Only {product.stock} left
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 lg:p-6">
                      <Link href={`/products/${product._id}`} className="block">
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-yellow-500 transition-colors">
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

                          {/* Price */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-yellow-500">
                              <span className="text-xs text-gray-400">KSh</span>
                              <span className="text-lg sm:text-xl lg:text-2xl font-bold ml-1">
                                {product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Add to Cart Button */}
                      <div className="mt-3">
                        <AddToCartButton
                          productId={product._id}
                          productName={product.name}
                          stock={product.stock}
                          price={product.price}
                          size=""
                          color=""
                          quantity={1}
                          className="w-full text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load More Button */}
            {filteredProducts.length > 8 && (
              <div className="mt-12 text-center">
                <button className="px-8 py-4 bg-gray-900 text-white border border-gray-800 rounded-lg hover:border-yellow-500 hover:text-yellow-500 transition-all font-medium">
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Clock,
              title: 'Daily Updates',
              description: 'New styles added every day'
            },
            {
              icon: ShoppingBag,
              title: 'Free Shipping',
              description: 'On orders over KSh 5,000'
            },
            {
              icon: Star,
              title: 'Premium Quality',
              description: '100% authentic products'
            },
            {
              icon: ArrowRight,
              title: 'Easy Returns',
              description: '30-day return policy'
            }
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-yellow-500 transition-all group"
              >
                <div className="inline-flex p-3 bg-yellow-500/10 rounded-full mb-4 group-hover:bg-yellow-500/20 transition-colors">
                  <Icon className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 sm:p-12 overflow-hidden border border-gray-800">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.2) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Never Miss a{' '}
              <span className="text-yellow-500">Drop</span>
            </h2>
            <p className="text-gray-400 mb-6">
              Subscribe to get notified about new arrivals, exclusive releases, and special offers.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/25 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </main>
    <Footer />
    </div>
  )
}