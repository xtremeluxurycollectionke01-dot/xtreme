"use client";

import { useState } from "react";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCart } from "./CartProvider";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  stock: number;
  price: number;
  className?: string;
  size?: string;
  color?: string;
}

export default function AddToCartButton({
  productId,
  productName,
  stock,
  price,
  className = "",
  size,
  color,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (stock === 0) return;

    setLoading(true);
    try {
      await addToCart(productId, 1, size, color);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (stock === 0) {
    return (
      <button
        disabled
        className={`w-full py-3 bg-gray-700 text-gray-500 rounded-lg font-bold cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || success}
      className={`group relative w-full py-3 rounded-lg font-bold transition-all overflow-hidden ${
        success
          ? "bg-green-500 text-white"
          : "bg-yellow-500 text-black hover:bg-yellow-400"
      } ${className}`}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
          loading ? "translate-y-0" : success ? "translate-y-full" : "-translate-y-full"
        }`}
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
          success ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Check className="h-5 w-5" />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${
          loading || success ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <ShoppingBag className="h-5 w-5" />
        Add to Cart
      </span>
    </button>
  );
}