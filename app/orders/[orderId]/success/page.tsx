"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (params.orderId) {
      fetchOrder();
    }
  }, [user, authLoading, router, params.orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderId}`);
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex p-4 bg-green-500/20 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            ORDER <span className="text-yellow-500">PLACED!</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-2">
            Thank you for your purchase
          </p>
          
          <p className="text-gray-500 mb-8">
            Order #{order?.orderNumber}
          </p>

          {/* Order Summary Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Total Amount</span>
                <span className="text-2xl font-bold text-yellow-500">
                  KSh {order?.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Items</span>
                <span>{order?.items?.length}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Payment Method</span>
                <span className="capitalize">{order?.paymentMethod}</span>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="bg-gray-800/50 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-400 mb-1">Estimated Delivery</p>
              <p className="font-medium">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-left">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-yellow-500 font-bold">1</span>
                </div>
                <h4 className="font-medium mb-1">Order Confirmation</h4>
                <p className="text-sm text-gray-400">
                  You'll receive an email confirmation shortly
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-left">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-yellow-500 font-bold">2</span>
                </div>
                <h4 className="font-medium mb-1">Shipping Update</h4>
                <p className="text-sm text-gray-400">
                  We'll notify you when your order ships
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/orders/${params.orderId}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              View Order Details
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-yellow-500 hover:text-yellow-500 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}