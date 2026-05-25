'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  ChevronDown,
  Star,
  ShoppingBag,
  ArrowUpDown,
  Grid3x3,
  List,
  Loader2
} from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'

interface ProductImage {
  url: string
  alt?: string
  isPrimary?: boolean
}

interface Product {
  _id: string
  name: string
  description?: string
  shortDescription?: string
  price: number
  stock: number
  images?: ProductImage[]
  isFeatured?: boolean
  gender?: string
  brand?: string
  category?: {
    name: string
    slug: string
  }
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
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

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const imageUrl = getPrimaryImage(product)
  
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10">
      <Link href={`/products/${product._id}`} className="block cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-gray-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
              <ShoppingBag className="w-12 h-12 text-gray-600 mb-2" />
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {product.isFeatured && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold">
              FEATURED
            </div>
          )}

          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded text-red-400 text-xs font-semibold">
              Only {product.stock} left
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {product.brand && (
              <p className="text-xs text-yellow-500 font-medium">{product.brand}</p>
            )}
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
              {product.name}
            </h3>
            
            {product.shortDescription && (
              <p className="text-xs text-gray-400 line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">(4.0)</span>
            </div>

            <div className="pt-2">
              <div className="text-yellow-500">
                <span className="text-xs text-gray-400">KSh</span>
                <span className="text-xl font-bold ml-1">
                  {product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-0">
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
}

// Skeleton Loader Component
const ProductSkeleton = () => (
  <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden">
    <div className="relative aspect-square overflow-hidden bg-gray-800">
      <div className="absolute inset-0 shimmer-gradient" />
    </div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-800 rounded shimmer-gradient w-1/3" />
      <div className="h-5 bg-gray-800 rounded shimmer-gradient w-3/4" />
      <div className="h-4 bg-gray-800 rounded shimmer-gradient w-full" />
      <div className="flex gap-1 pt-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-gray-800 rounded-full shimmer-gradient" />
        ))}
      </div>
      <div className="h-7 bg-gray-800 rounded shimmer-gradient w-1/2 mt-2" />
      <div className="h-10 bg-gray-800 rounded-lg shimmer-gradient w-full mt-3" />
    </div>
  </div>
)

// Filter Sidebar Component
const FilterSidebar = ({ 
  filters, 
  onFilterChange,
  onClose,
  isMobile 
}: { 
  filters: any, 
  onFilterChange: (filters: any) => void,
  onClose?: () => void,
  isMobile?: boolean
}) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      gender: '',
      sortBy: 'newest'
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-black/95 backdrop-blur-sm p-6 overflow-y-auto' : 'space-y-6'}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort By
          </h3>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Gender</h3>
          <div className="space-y-2">
            {['', 'men', 'women', 'unisex', 'kids'].map((g) => (
              <label key={g} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={localFilters.gender === g}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-4 h-4 accent-yellow-500"
                />
                <span className="text-gray-400 group-hover:text-yellow-500 transition-colors capitalize">
                  {g || 'All'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full py-2 text-center text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors font-medium"
        >
          Clear All Filters
        </button>
      </div>

      <style jsx>{`
        .shimmer-gradient {
          background: linear-gradient(90deg, rgba(31,41,55,0.8) 25%, rgba(55,65,81,0.9) 50%, rgba(31,41,55,0.8) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// Main Search Page Content
function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    gender: '',
    sortBy: 'newest'
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchProducts = async (page = 1) => {
    setLoading(true)
    
    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (filters.category) params.append('category', filters.category)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.gender) params.append('gender', filters.gender)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    params.append('page', page.toString())
    params.append('limit', '12')

    try {
      const response = await fetch(`/api/products/search?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data)
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(1)
  }, [searchQuery, filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(window.location.search)
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    router.push(`/search?${params.toString()}`)
    fetchProducts(1)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    if (showMobileFilters) setShowMobileFilters(false)
  }

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            SEARCH <span className="text-yellow-500">PRODUCTS</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {pagination?.totalItems 
              ? `Found ${pagination.totalItems} product${pagination.totalItems !== 1 ? 's' : ''}`
              : 'Discover your perfect style'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for shoes, clothing, accessories..."
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-all duration-300 text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters Bar */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg text-gray-300 hover:text-yellow-500 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <div className="hidden md:flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-400">
                {pagination?.totalItems || 0} results
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-yellow-500 text-black' : 'bg-gray-900 text-gray-400 hover:text-yellow-500'}`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-yellow-500 text-black' : 'bg-gray-900 text-gray-400 hover:text-yellow-500'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
              <FilterSidebar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onClose={() => setShowMobileFilters(false)}
                isMobile
              />
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6 lg:gap-8`}>
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-full mb-6">
                  <Search className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any products matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilters({ category: '', minPrice: '', maxPrice: '', gender: '', sortBy: 'newest' })
                  }}
                  className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6 lg:gap-8`}>
                  {products.map((product) => (
                    viewMode === 'grid' ? (
                      <ProductCard key={product._id} product={product} />
                    ) : (
                      <ProductCardList key={product._id} product={product} />
                    )
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 bg-gray-900 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-2">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        let pageNum = pagination.currentPage
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = pagination.currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              pagination.currentPage === pageNum
                                ? 'bg-yellow-500 text-black font-bold'
                                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 bg-gray-900 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
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

      <style jsx>{`
        .shimmer-gradient {
          background: linear-gradient(90deg, rgba(31,41,55,0.8) 25%, rgba(55,65,81,0.9) 50%, rgba(31,41,55,0.8) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// List View Product Card Component
const ProductCardList = ({ product }: { product: Product }) => {
  const imageUrl = getPrimaryImage(product)
  
  return (
    <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <Link href={`/products/${product._id}`} className="block flex-shrink-0">
          <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-gray-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-600" />
              </div>
            )}
          </div>
        </Link>
        
        <div className="flex-1 flex flex-col">
          <Link href={`/products/${product._id}`}>
            {product.brand && (
              <p className="text-sm text-yellow-500 font-medium mb-1">{product.brand}</p>
            )}
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
            {product.shortDescription && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.shortDescription}</p>
            )}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
              ))}
              <span className="text-xs text-gray-400 ml-1">(4.0)</span>
            </div>
          </Link>
          
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="text-yellow-500">
              <span className="text-sm text-gray-400">KSh</span>
              <span className="text-2xl font-bold ml-1">{product.price.toLocaleString()}</span>
            </div>
            <AddToCartButton
              productId={product._id}
              productName={product.name}
              stock={product.stock}
              price={product.price}
              size=""
              color=""
              quantity={1}
              className="px-6"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Export with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}