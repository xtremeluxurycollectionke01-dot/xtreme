/*"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  _id: string;
  product: any;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      } else if (response.status === 401) {
        setCart(null);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId: string, quantity = 1, size?: string, color?: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, size, color }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add to cart");
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update cart");
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove from cart");
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to clear cart");
      }

      setCart(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}*/

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

interface CartItem {
  _id: string;
  product: any;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity = 1, size?: string, color?: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, size, color }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add to cart");
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update cart");
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove from cart");
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to clear cart");
      }

      setCart(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};