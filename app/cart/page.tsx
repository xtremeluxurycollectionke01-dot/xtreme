"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, AlertCircle } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await removeFromCart(itemId);
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
              <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">
            SHOPPING <span className="text-yellow-500">CART</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.items.map((item) => (
                
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {/*{item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-600" />
                          </div>
                        )}*/}
                        {item.product.images?.[0]?.url ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.images[0].alt || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold mb-1">
                              {item.product.name}
                            </h3>
                            {item.size && (
                              <p className="text-sm text-gray-400">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-sm text-gray-400">Color: {item.color}</p>
                            )}
                          </div>
                          <div className="text-yellow-500 font-bold text-lg">
                            KSh {item.price.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={updating === item._id || item.quantity <= 1}
                              className="p-1 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">
                              {updating === item._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              disabled={updating === item._id || item.quantity >= item.product.stock}
                              className="p-1 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(item._id)}
                            disabled={updating === item._id}
                            className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>KSh {cart.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-yellow-500">
                        KSh {cart.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </button>

                <Link
                  href="/"
                  className="block text-center text-sm text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}