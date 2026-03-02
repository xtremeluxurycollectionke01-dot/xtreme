/*"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RotateCcw
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import AddToCartButton from "@/components/AddToCartButton";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  sku: string;
  sizes: string[];
  colors: string[];
  brand?: string;
  category: any;
  tags: string[];
}

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.productId}`);
      const data = await response.json();
      setProduct(data.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/" className="text-yellow-500 hover:text-yellow-400">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb *
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-yellow-500">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-yellow-500">Products</Link>
          <span>/</span>
          <span className="text-yellow-500">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images *
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
            >
              <Image
                src={product.images[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                  -{discount}%
                </div>
              )}

              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-full">
                  Only {product.stock} left
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-500 text-white text-xl font-bold rounded-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Image Navigation *
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => Math.min(product.images.length - 1, prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail Grid *
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-yellow-500 scale-105' 
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info *
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand & Category *
            <div className="flex items-center gap-3">
              {product.brand && (
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                  {product.brand}
                </span>
              )}
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Title *
            <h1 className="text-3xl md:text-4xl font-bold">
              {product.name}
            </h1>

            {/* Rating *
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <span className="text-gray-400">(24 reviews)</span>
            </div>

            {/* Price *
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-yellow-500">
                KSh {product.price.toLocaleString()}
              </div>
              {product.comparePrice && (
                <div className="text-xl text-gray-500 line-through">
                  KSh {product.comparePrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Description *
            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection *
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedSize === size
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection *
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Select Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedColor === color
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity *
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={product.stock === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="w-16 text-center font-bold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons *
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AddToCartButton
                productId={product._id}
                productName={product.name}
                stock={product.stock}
                price={product.price}
                size={selectedSize}
                color={selectedColor}
                className="flex-1"
              />
              
              <button
                onClick={() => setAddedToWishlist(!addedToWishlist)}
                className="px-6 py-3 border-2 border-gray-700 rounded-lg hover:border-yellow-500 transition-colors group"
              >
                <Heart className={`h-6 w-6 transition-colors ${
                  addedToWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-yellow-500'
                }`} />
              </button>
              
              <button className="px-6 py-3 border-2 border-gray-700 rounded-lg hover:border-yellow-500 transition-colors group">
                <Share2 className="h-6 w-6 text-gray-400 group-hover:text-yellow-500" />
              </button>
            </div>

            {/* Product Meta *
            <div className="border-t border-gray-800 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Truck className="h-5 w-5 text-yellow-500" />
                <span>Free shipping on orders over KSh 10,000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Shield className="h-5 w-5 text-yellow-500" />
                <span>2 year warranty on all products</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <RotateCcw className="h-5 w-5 text-yellow-500" />
                <span>30-day return policy</span>
              </div>
            </div>

            {/* SKU & Tags *
            <div className="text-sm text-gray-500">
              <p>SKU: {product.sku}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span>Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}*/

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RotateCcw
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import AddToCartButton from "@/components/AddToCartButton";

// Update the Product interface to match your schema
interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary?: boolean;
  width?: number;
  height?: number;
  format?: string;
}

interface ProductSize {
  size: string;
  system: "US" | "UK" | "EU" | "CM";
  stock: number;
}

interface ProductColor {
  name: string;
  hex: string;
  images?: string[];
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  images: ProductImage[];
  stock: number;
  sku: string;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  brand?: string;
  category: any;
  tags?: string[];
  gender?: string;
  material?: string;
  condition?: string;
  weight?: number;
}

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  useEffect(() => {
    if (params.productId) {
      fetchProduct();
    }
  }, [params.productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.productId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch product');
      }
      
      setProduct(result.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image URL
  const getImageUrl = (image: ProductImage | string): string => {
    if (typeof image === 'string') return image;
    return image.url || '/placeholder.jpg';
  };

  // Helper function to get image alt text
  const getImageAlt = (image: ProductImage | string, index: number): string => {
    if (typeof image === 'string') return `${product?.name} - Image ${index + 1}`;
    return image.alt || `${product?.name} - Image ${index + 1}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-500">
              {error || "Product Not Found"}
            </h1>
            <p className="text-gray-400 mb-6">
              The product you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract image URLs from the images array
  const imageUrls = product.images?.map(img => getImageUrl(img)) || [];

  // Extract size strings from sizes array
  const sizeOptions = product.sizes?.map(s => s.size) || [];

  // Extract color names from colors array
  const colorOptions = product.colors?.map(c => c.name) || [];

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-yellow-500">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-yellow-500">Products</Link>
          <span>/</span>
          <span className="text-yellow-500">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
            >
              {imageUrls.length > 0 ? (
                <Image
                  src={imageUrls[selectedImage]}
                  alt={getImageAlt(product.images[selectedImage], selectedImage)}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-gray-700" />
                </div>
              )}
              
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                  -{discount}%
                </div>
              )}

              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-full">
                  Only {product.stock} left
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-500 text-white text-xl font-bold rounded-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Image Navigation */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => Math.min(imageUrls.length - 1, prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail Grid */}
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {imageUrls.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-yellow-500 scale-105' 
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand & Category */}
            <div className="flex items-center gap-3">
              {product.brand && (
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                  {product.brand}
                </span>
              )}
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold">
              {product.name}
            </h1>

            {/* Rating - You might want to fetch this from a reviews collection */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <span className="text-gray-400">(0 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-yellow-500">
                KSh {product.price.toLocaleString()}
              </div>
              {product.comparePrice && (
                <div className="text-xl text-gray-500 line-through">
                  KSh {product.comparePrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">
              {product.description || product.shortDescription || 'No description available'}
            </p>

            {/* Size Selection */}
            {sizeOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => {
                    const sizeObj = product.sizes?.find(s => s.size === size);
                    const isOutOfStock = sizeObj?.stock === 0;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                            : isOutOfStock
                            ? 'border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                            : 'border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {size}
                        {isOutOfStock && <span className="ml-2 text-xs">(Out)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colorOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Select Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((colorName) => {
                    const colorObj = product.colors?.find(c => c.name === colorName);
                    
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                          selectedColor === colorName
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                            : 'border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {colorObj?.hex && (
                          <span 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: colorObj.hex }}
                          />
                        )}
                        {colorName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={product.stock === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="w-16 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/*<AddToCartButton
                productId={product._id}
                productName={product.name}
                stock={product.stock}
                price={product.price}
                size={selectedSize}
                color={selectedColor}
                quantity={quantity}
                className="flex-1"
              />*/}
              
              <AddToCartButton
                productId={product._id}
                productName={product.name}
                stock={product.stock}
                price={product.price}
                size={selectedSize}
                color={selectedColor}
                quantity={quantity}
                className="flex-1"
              />
              <button
                onClick={() => setAddedToWishlist(!addedToWishlist)}
                className="px-6 py-3 border-2 border-gray-700 rounded-lg hover:border-yellow-500 transition-colors group"
              >
                <Heart className={`h-6 w-6 transition-colors ${
                  addedToWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-yellow-500'
                }`} />
              </button>
              
              <button className="px-6 py-3 border-2 border-gray-700 rounded-lg hover:border-yellow-500 transition-colors group">
                <Share2 className="h-6 w-6 text-gray-400 group-hover:text-yellow-500" />
              </button>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-800 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Truck className="h-5 w-5 text-yellow-500" />
                <span>Free shipping on orders over KSh 10,000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Shield className="h-5 w-5 text-yellow-500" />
                <span>2 year warranty on all products</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <RotateCcw className="h-5 w-5 text-yellow-500" />
                <span>30-day return policy</span>
              </div>
            </div>

            {/* SKU & Tags */}
            <div className="text-sm text-gray-500">
              <p>SKU: {product.sku}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span>Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional product details */}
              {product.material && (
                <p className="mt-2">Material: {product.material}</p>
              )}
              {product.gender && (
                <p>Gender: {product.gender}</p>
              )}
              {product.condition && (
                <p>Condition: {product.condition}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}