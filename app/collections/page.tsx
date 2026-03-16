// app/collections/page.tsx
'use client'

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Grid3x3, Sparkles, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"

// Reusing the featured categories data and adding more collections
const allCollections = [
  // Featured categories from your component
  {
    id: 'new-in',
    name: 'New In',
    description: 'Fresh Drops Daily',
    image: '/images/image21.jpeg',
    href: '/collections/new-in',
    itemCount: 48,
    type: 'seasonal',
    badge: 'Fresh',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'women',
    name: "Women's",
    description: 'Elegant & Bold',
    image: '/images/image19.jpeg',
    href: '/collections/women',
    itemCount: 156,
    type: 'gender',
    badge: 'Best Seller',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'men',
    name: "Men's",
    description: 'Classic Styles',
    image: '/images/image20.jpeg',
    href: '/collections/men',
    itemCount: 142,
    type: 'gender',
    badge: 'Popular',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'activewear',
    name: 'Activewear',
    description: 'Performance Gear',
    image: '/images/image14.jpeg',
    href: '/collections/activewear',
    itemCount: 89,
    type: 'category',
    badge: 'New',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Urban Culture',
    image: '/images/image9.jpeg',
    href: '/collections/streetwear',
    itemCount: 64,
    type: 'category',
    badge: 'Trending',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'featured',
    name: 'Featured',
    description: 'Curated Picks',
    image: '/images/image4.jpeg',
    href: '/collections/featured',
    itemCount: 24,
    type: 'curated',
    badge: 'Editor\'s Pick',
    color: 'from-yellow-500 to-orange-500'
  },
  // Additional collections
  {
    id: 'luxury',
    name: 'Luxury Edition',
    description: 'Premium Selection',
    image: '/images/image1.jpeg',
    href: '/collections/luxury',
    itemCount: 32,
    type: 'premium',
    badge: 'Exclusive',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'sustainable',
    name: 'Sustainable',
    description: 'Eco-Friendly Choices',
    image: '/images/image2.jpeg',
    href: '/collections/sustainable',
    itemCount: 27,
    type: 'conscious',
    badge: 'Green',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'limited',
    name: 'Limited Edition',
    description: 'While Stocks Last',
    image: '/images/image3.jpeg',
    href: '/collections/limited',
    itemCount: 15,
    type: 'exclusive',
    badge: 'Limited',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Professional Gear',
    image: '/images/image5.jpeg',
    href: '/collections/sports',
    itemCount: 73,
    type: 'category',
    badge: 'Performance',
    color: 'from-blue-500 to-sky-500'
  },
  {
    id: 'casual',
    name: 'Casual Wear',
    description: 'Everyday Comfort',
    image: '/images/image6.jpeg',
    href: '/collections/casual',
    itemCount: 98,
    type: 'lifestyle',
    badge: 'Essentials',
    color: 'from-stone-500 to-neutral-500'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete the Look',
    image: '/images/image7.jpeg',
    href: '/collections/accessories',
    itemCount: 45,
    type: 'addons',
    badge: 'Must-Haves',
    color: 'from-violet-500 to-purple-500'
  }
]

// Collection types for filtering
const collectionTypes = [
  { id: 'all', label: 'All Collections', icon: Grid3x3 },
  { id: 'gender', label: 'Gender', icon: null },
  { id: 'category', label: 'Categories', icon: null },
  { id: 'seasonal', label: 'Seasonal', icon: null },
  { id: 'premium', label: 'Premium', icon: TrendingUp },
  { id: 'limited', label: 'Limited', icon: Clock },
]

export default function CollectionsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Filter collections based on selected type
  const filteredCollections = useMemo(() => {
    if (selectedType === 'all') return allCollections
    return allCollections.filter(col => col.type === selectedType)
  }, [selectedType])

  // Group collections for featured section
  const featuredCollections = allCollections.filter(col => 
    ['featured', 'new-in', 'limited'].includes(col.id)
  )

  return (
    <div>
      {/*<Navbar />*/}
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0">
          <Image
            src="/images/image4.jpeg"
            alt="Collections"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,215,0,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="flex items-center gap-2 text-yellow-500 mb-4">
              {/*<Sparkles className="h-5 w-5" />*/}
              <span className="text-sm sm:text-base font-medium tracking-wider">DISCOVER OUR</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Collections
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                That Define Style
              </span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mb-8">
              Explore our carefully curated categories, from timeless classics to the latest trends. 
              Each collection tells a unique story of craftsmanship and design.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{allCollections.length}+</div>
                <div className="text-sm text-gray-400">Collections</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {allCollections.reduce((acc, col) => acc + col.itemCount, 0)}+
                </div>
                <div className="text-sm text-gray-400">Products</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/*<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-500/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-yellow-500 rounded-full mt-2 animate-scroll" />
          </div>
        </div>*/}
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center text-sm text-gray-400">
              <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white">Collections</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
              {collectionTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedType === type.id
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {type.label}
                  </button>
                )
              })}
            </div>

            {/* Results Count */}
            <div className="hidden sm:block text-sm text-gray-400">
              Showing <span className="text-yellow-500 font-medium">{filteredCollections.length}</span> collections
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Spotlight */}
      {selectedType === 'all' && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-yellow-500 rounded-full"></span>
            Spotlight Collections
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredCollections.map((collection, index) => (
              <Link
                key={collection.id}
                href={collection.href}
                className="group relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden"
                onMouseEnter={() => setHoveredId(collection.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    hoveredId === collection.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-60 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 bg-${collection.color.split(' ')[0]}/20 backdrop-blur-sm border border-white/20 rounded-full text-xs font-medium text-white`}>
                        {collection.badge}
                      </span>
                      <span className="text-white/80 text-sm">{collection.itemCount} items</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{collection.name}</h3>
                    <p className="text-white/80 text-sm sm:text-base mb-4">{collection.description}</p>
                    <div className="flex items-center text-yellow-500 font-medium group-hover:gap-2 transition-all">
                      Explore Collection
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Collections Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-1 h-8 bg-yellow-500 rounded-full"></span>
            {selectedType === 'all' ? 'All Collections' : collectionTypes.find(t => t.id === selectedType)?.label}
          </h2>
          
          {/* View Toggle (could add grid/list view here) */}
          <div className="flex gap-2">
            <button className="p-2 bg-gray-900 rounded-lg text-yellow-500">
              <Grid3x3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredCollections.map((collection, index) => (
<Link
  key={collection.id}
  href={collection.href}
  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20"
  style={{
    animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`,
    opacity: 0
  }}
>
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 bg-gradient-to-r ${collection.color} text-white text-xs font-bold rounded-full shadow-lg`}>
                    {collection.badge}
                  </span>
                </div>

                {/* Type Indicator */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-xs text-gray-300">
                    {collection.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{collection.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{collection.itemCount} Products</span>
                  
                  <div className="flex items-center text-yellow-500 font-medium group-hover:gap-2 transition-all">
                    <span className="text-sm">View</span>
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Progress bar for limited collections */}
                {collection.id === 'limited' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Selling fast</span>
                      <span className="text-yellow-500">15 left</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No collections found</h3>
            <p className="text-gray-400">Try selecting a different filter</p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 sm:p-12 overflow-hidden border border-gray-800">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.2) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay <span className="text-yellow-500">Inspired</span>
            </h2>
            <p className="text-gray-400 mb-6">
              Be the first to know about new collections, exclusive drops, and special offers.
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
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          75% { transform: translateY(6px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </main>
    <Footer />
    </div>
  )
}