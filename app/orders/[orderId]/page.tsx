"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function OrderDetailsPage() {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      case "shipped":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order not found</h2>
            <p className="text-gray-400 mb-6">
              The order you're looking for doesn't exist.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Orders
            </Link>
          </div>
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
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Orders
          </Link>

          {/* Order Header */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Order <span className="text-yellow-500">#{order.orderNumber}</span>
                </h1>
                <p className="text-sm text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                  {getStatusIcon(order.orderStatus)}
                  <span className="capitalize">{order.orderStatus}</span>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  order.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" :
                  order.paymentStatus === "failed" ? "bg-red-500/20 text-red-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {order.paymentStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-yellow-500" />
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                      <div className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <p className="text-yellow-500 font-bold mt-1">
                          KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>KSh {order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-yellow-500 text-xl">
                        KSh {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-yellow-500" />
                  Shipping Address
                </h2>
                <div className="space-y-1 text-gray-300">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-yellow-500" />
                  Payment Method
                </h2>
                <p className="text-gray-300">
                  {order.paymentMethod === "card" ? "Credit/Debit Card" : order.paymentMethod}
                </p>
              </div>

              {order.trackingNumber && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-yellow-500" />
                    Tracking Number
                  </h2>
                  <p className="font-mono text-yellow-500">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}