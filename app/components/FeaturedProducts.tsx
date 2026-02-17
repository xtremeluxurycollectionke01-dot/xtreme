/*import { Star, ShoppingBag } from 'lucide-react'
import Image from "next/image"


interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  rating: number
  isNew: boolean
}

const FeaturedProducts = () => {
  const products: Product[] = [
    {
        id: 1,
        name: 'Nike Air Max Dior',
        category: 'Sneakers',
        price: 1299,
        image: '/images/image4.jpeg',
        isNew: true,
        rating: 0
    },
    {
      id: 2,
      name: 'Balenciaga Triple S',
      category: 'Sneakers',
      price: 895,
      image: '/images/image5.jpeg',
      rating: 4.7,
      isNew: false
    },
    {
      id: 3,
      name: 'Gucci Ace Embroidered',
      category: 'Sneakers',
      price: 750,
     image: '/images/image6.jpeg',
      rating: 4.8,
      isNew: true
    },
    {
      id: 4,
      name: 'Off-White x Air Jordan',
      category: 'Sneakers',
      price: 2200,
     image: '/images/image7.jpeg',
      rating: 5.0,
      isNew: true
    }
  ]

  return (
    <section id="shoes" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            FEATURED <span className="text-yellow-500">COLLECTIONS</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handpicked selection of the most sought-after designer footwear
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6 hover:border-yellow-500 transition-all duration-300 hover:scale-[1.02]"
            >
              {product.isNew && (
                <div className="absolute top-4 left-4 px-3 py-1 gradient-yellow text-black text-xs font-bold rounded-full z-20">
                  NEW
                </div>
              )}
              
              <div className="absolute top-4 right-4 z-20">
                <button className="p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-yellow-500 hover:text-black transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                </button>
              </div>
              <div className="relative aspect-square mb-6 overflow-hidden rounded-xl z-0">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                </div>


              <div className="mb-4">
                <span className="text-yellow-500 text-sm font-medium">
                  {product.category}
                </span>
                <h3 className="text-xl font-bold mt-1">{product.name}</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-400 text-sm">(128 reviews)</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">Ksh {product.price}</div>
                </div>
              </div>

              <button className="w-full mt-6 py-3 border border-yellow-500 text-yellow-500 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100">
                ADD TO CART
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 border-2 border-yellow-500 text-yellow-500 font-bold rounded-lg hover:bg-yellow-500 hover:text-black transition-all">
            VIEW ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts*/
'use client'
'use client'

import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

interface FeaturedCategory {
  id: string
  name: string
  description: string
  image: string
  href: string
  itemCount: number
}

const featuredCategories: FeaturedCategory[] = [
  {
    id: 'new-in',
    name: 'New In',
    description: 'Fresh Drops Daily',
    image: '/images/image1.jpeg',
    href: '/collections/new-in',
    itemCount: 48
  },
  {
    id: 'women',
    name: "Women's",
    description: 'Elegant & Bold',
    image: '/images/image1.jpeg',
    href: '/collections/women',
    itemCount: 156
  },
  {
    id: 'men',
    name: "Men's",
    description: 'Classic Styles',
    image: '/images/image1.jpeg',
    href: '/collections/men',
    itemCount: 142
  },
  {
    id: 'activewear',
    name: 'Activewear',
    description: 'Performance Gear',
    image: '/images/image1.jpeg',
    href: '/collections/activewear',
    itemCount: 89
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Urban Culture',
    image: '/images/image1.jpeg',
    href: '/collections/streetwear',
    itemCount: 64
  },
  {
    id: 'featured',
    name: 'Featured',
    description: 'Curated Picks',
    image: '/images/image1.jpeg',
    href: '/collections/featured',
    itemCount: 24
  }
]

const FeaturedCollections = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="collections" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Matching HeroSection typography scale */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
            FEATURED <span className="text-yellow-500">COLLECTIONS</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Explore our curated categories </p>
        </div>

        {/* Mobile Scroll Controls - Matching Hero nav button sizing */}
        <div className="flex justify-between items-center mb-4 sm:hidden px-1">
          <span className="text-sm text-gray-400">Swipe to explore</span>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Container */}
        <div 
          ref={scrollRef}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {featuredCategories.map((category) => (
            <a
              key={category.id}
              href={category.href}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10 block flex-shrink-0 w-[75vw] xs:w-[60vw] sm:w-auto snap-start"
            >
              {/* Image Container - Matching Hero aspect ratios */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 16vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Featured Badge - Matching Hero badge style */}
                {category.id === 'featured' && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 sm:px-4 sm:py-1.5 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full text-yellow-400 text-xs sm:text-sm font-semibold">
                    HOT
                  </div>
                )}
              </div>

              {/* Content Overlay - Matching Hero content spacing */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-sm sm:text-base text-yellow-500 font-medium">
                    {category.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {category.itemCount} items
                  </p>
                </div>

                {/* View Button - Matching Hero button sizing */}
                {category.id === 'featured' ? (
                  <button className="mt-3 sm:mt-4 w-full py-2.5 sm:py-3 bg-yellow-500 text-black text-sm sm:text-base font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 group/btn">
                    View All
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  /* Arrow Indicator for others */
                  <div className="mt-3 sm:mt-4 flex items-center text-gray-400 group-hover:text-yellow-500 transition-colors">
                    <span className="text-sm sm:text-base font-medium">Explore</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Scroll Indicator Dots - Matching Hero carousel dots */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {featuredCategories.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all ${idx === 0 ? 'w-6 bg-yellow-500' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>

        {/* View All Button - Matching Hero CTA button exactly */}
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <a 
            href="/collections/all"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-yellow-500 text-yellow-500 text-base sm:text-lg font-bold rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
          >
            View All Collections
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections