import { Star, ShoppingBag } from 'lucide-react'
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

export default FeaturedProducts