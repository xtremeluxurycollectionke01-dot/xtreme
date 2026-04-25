// app/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from 'next/link'
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Search, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3x3,
  LayoutList,
  Filter
} from 'lucide-react'
import AddToCartButton from "@/components/AddToCartButton"
import Navbar from '@/components/NavBar'
import Footer from '@/components/Footer'

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
  category?: string
  brand?: string
  rating?: number
  reviews?: number
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || ''

const getPrimaryImage = (product: Product): string | null => {
  if (!product.images || product.images.length === 0) return null
  const primary = product.images.find(img => img.isPrimary)
  return primary?.url || product.images[0].url
}

const getImageUrl = (imagePath?: string): string | null => {
  if (!imagePath) return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  if (IMAGE_BASE_URL) {
    return `${IMAGE_BASE_URL}/${imagePath}`
  }
  return null
}

// Categories for filtering
const categories = [
  "All",
  "Sneakers",
  "Running Shoes",
  "Basketball Shoes",
  "Casual Shoes",
  "Formal Shoes",
  "Sandals",
  "Boots"
]

// Brands for filtering
const brands = [
  "All Brands",
  "Nike",
  "Adidas",
  "Jordan",
  "Puma",
  "New Balance",
  "Reebok",
  "Converse"
]

// Price ranges for filtering
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under KSh 5,000", min: 0, max: 5000 },
  { label: "KSh 5,000 - KSh 10,000", min: 5000, max: 10000 },
  { label: "KSh 10,000 - KSh 20,000", min: 10000, max: 20000 },
  { label: "Above KSh 20,000", min: 20000, max: Infinity }
]

// Sorting options
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popularity", value: "popular" },
  { label: "Rating", value: "rating" }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [sortBy, setSortBy] = useState(sortOptions[0])
  const [showInStock, setShowInStock] = useState(false)
  const [showFeatured, setShowFeatured] = useState(false)
  
  // UI states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const result = await response.json()
        
        // Enhance products with mock data for demo
        const enhancedProducts = result.data.map((product: Product) => ({
          ...product,
          category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
          brand: brands[Math.floor(Math.random() * (brands.length - 1)) + 1],
          rating: Number((3 + Math.random() * 2).toFixed(1)),
          reviews: Math.floor(Math.random() * 200) + 10
        }))
        
        setProducts(enhancedProducts)
        setFilteredProducts(enhancedProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Apply search
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory)
    }

    // Apply brand filter
    if (selectedBrand !== "All Brands") {
      result = result.filter(product => product.brand === selectedBrand)
    }

    // Apply price filter
    result = result.filter(product => 
      product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
    )

    // Apply stock filter
    if (showInStock) {
      result = result.filter(product => product.stock > 0)
    }

    // Apply featured filter
    if (showFeatured) {
      result = result.filter(product => product.isFeatured)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy.value) {
        case "price_asc":
          return a.price - b.price
        case "price_desc":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "popular":
          return (b.reviews || 0) - (a.reviews || 0)
        default:
          return 0
      }
    })

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedPriceRange, sortBy, showInStock, showFeatured])

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Shimmer Card Component
  const ShimmerCard = () => (
    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <div className="absolute inset-0 shimmer-gradient" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-800 rounded shimmer-gradient w-3/4" />
        <div className="h-4 bg-gray-800 rounded shimmer-gradient w-full" />
        <div className="h-4 bg-gray-800 rounded shimmer-gradient w-2/3" />
        <div className="flex gap-1 pt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-800 rounded-full shimmer-gradient" />
          ))}
        </div>
        <div className="h-7 bg-gray-800 rounded shimmer-gradient w-1/2 mt-2" />
        <div className="h-12 bg-gray-800 rounded-lg shimmer-gradient w-full mt-3" />
      </div>
    </div>
  )

  // Shimmer List Item
  const ShimmerListItem = () => (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden p-4">
      <div className="flex gap-6">
        <div className="w-48 h-48 bg-gray-800 rounded-xl shimmer-gradient flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-7 bg-gray-800 rounded shimmer-gradient w-1/3" />
          <div className="h-5 bg-gray-800 rounded shimmer-gradient w-2/3" />
          <div className="h-5 bg-gray-800 rounded shimmer-gradient w-1/2" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-800 rounded-full shimmer-gradient" />
            ))}
          </div>
          <div className="h-8 bg-gray-800 rounded shimmer-gradient w-1/4" />
          <div className="h-12 bg-gray-800 rounded-lg shimmer-gradient w-1/3" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Shimmer */}
          <div className="text-center mb-12 space-y-4">
            <div className="h-16 bg-gray-800 rounded shimmer-gradient w-96 mx-auto" />
            <div className="h-7 bg-gray-800 rounded shimmer-gradient w-2/3 mx-auto" />
          </div>

          {/* Filter Bar Shimmer */}
          <div className="flex justify-between items-center mb-8">
            <div className="h-12 bg-gray-800 rounded-lg shimmer-gradient w-64" />
            <div className="h-12 bg-gray-800 rounded-lg shimmer-gradient w-32" />
          </div>

          {/* Products Grid Shimmer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              viewMode === 'grid' ? <ShimmerCard key={i} /> : <ShimmerListItem key={i} />
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-500 text-xl">Error loading products: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              OUR <span className="text-yellow-500">PRODUCTS</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl">
              Discover premium footwear crafted for style, comfort, and performance
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Bar */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white hover:border-yellow-500 transition-all"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-sm">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {selectedBrand !== "All Brands" && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-sm">
                {selectedBrand}
                <button onClick={() => setSelectedBrand("All Brands")}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {selectedPriceRange.label !== "All Prices" && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-sm">
                {selectedPriceRange.label}
                <button onClick={() => setSelectedPriceRange(priceRanges[0])}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {(showInStock || showFeatured) && (
              <button
                onClick={() => {
                  setShowInStock(false)
                  setShowFeatured(false)
                }}
                className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 text-sm hover:bg-red-500/20 transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy.value}
              onChange={(e) => setSortBy(sortOptions.find(opt => opt.value === e.target.value) || sortOptions[0])}
              className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-900/50 border border-gray-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <LayoutList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop & Mobile */}
          <div className={`${isFilterOpen ? 'block' : 'hidden lg:block'} lg:w-80 flex-shrink-0`}>
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === category
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedBrand === brand
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedPriceRange.label === range.label
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Other Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInStock}
                      onChange={(e) => setShowInStock(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
                    />
                    In Stock Only
                  </label>
                  <label className="flex items-center gap-3 text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFeatured}
                      onChange={(e) => setShowFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
                    />
                    Featured Products
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 text-gray-400">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                <p className="text-gray-400">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.map((product) => {
                      const imageUrl = getPrimaryImage(product)
                      return (
                        <div
                          key={product._id}
                          className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10"
                        >
                          <Link href={`/products/${product._id}`} className="block cursor-pointer">
                            <div className="relative aspect-square overflow-hidden bg-gray-800">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                                  <ShoppingBag className="w-16 h-16 text-gray-600 mb-2" />
                                  <span className="text-sm text-gray-500">No image</span>
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                              
                              {/* Badges */}
                              {product.isFeatured && (
                                <div className="absolute top-3 left-3 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold">
                                  FEATURED
                                </div>
                              )}
                              {product.stock <= 5 && product.stock > 0 && (
                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded text-red-400 text-xs font-semibold">
                                  Only {product.stock} left
                                </div>
                              )}
                            </div>

                            <div className="p-5">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <h3 className="text-lg font-bold text-white line-clamp-1 flex-1">
                                    {product.name}
                                  </h3>
                                  {/*}span className="text-xs text-gray-500 ml-2">{product.brand}</span>*/}
                                </div>
                                
                                {product.description && (
                                  <p className="text-sm text-gray-400 line-clamp-2">
                                    {product.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-400">({product.reviews})</span>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <div className="text-yellow-500">
                                    <span className="text-xs text-gray-400">KSh</span>
                                    <span className="text-2xl font-bold ml-1">
                                      {product.price.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>

                          <div className="px-5 pb-5 pt-0">
                            <AddToCartButton
                              productId={product._id}
                              productName={product.name}
                              stock={product.stock}
                              price={product.price}
                              size=""
                              color=""
                              quantity={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-4">
                    {currentProducts.map((product) => {
                      const imageUrl = getPrimaryImage(product)
                      return (
                        <div
                          key={product._id}
                          className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <Link href={`/products/${product._id}`} className="sm:w-48 lg:w-64 flex-shrink-0">
                              <div className="relative aspect-square sm:aspect-auto sm:h-full min-h-[200px] overflow-hidden bg-gray-800">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, 25vw"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                                    <ShoppingBag className="w-12 h-12 text-gray-600" />
                                  </div>
                                )}
                              </div>
                            </Link>

                            <div className="flex-1 p-6">
                              <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <Link href={`/products/${product._id}`}>
                                      <h3 className="text-xl font-bold text-white hover:text-yellow-500 transition-colors">
                                        {product.name}
                                      </h3>
                                    </Link>
                                    {/*<span className="text-sm text-gray-500">{product.brand}</span>*/}
                                  </div>
                                  {product.isFeatured && (
                                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold">
                                      FEATURED
                                    </span>
                                  )}
                                </div>

                                <p className="text-gray-400 mb-4 line-clamp-2">
                                  {product.description || "Premium quality footwear designed for comfort and style."}
                                </p>

                                <div className="flex items-center gap-4 mb-4">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400">{product.reviews} reviews</span>
                                  <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                  <div className="text-yellow-500">
                                    <span className="text-sm text-gray-400">KSh</span>
                                    <span className="text-3xl font-bold ml-1">
                                      {product.price.toLocaleString()}
                                    </span>
                                  </div>
                                  
                                  <div className="w-48">
                                    <AddToCartButton
                                      productId={product._id}
                                      productName={product.name}
                                      stock={product.stock}
                                      price={product.price}
                                      size=""
                                      color=""
                                      quantity={1}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-yellow-500 transition-all"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          currentPage === i + 1
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-900/50 border border-gray-800 text-white hover:border-yellow-500'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-yellow-500 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  )
}