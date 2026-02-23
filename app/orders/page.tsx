"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Truck,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: any;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              MY <span className="text-yellow-500">ORDERS</span>
            </h1>
            <p className="text-gray-400">
              Track and manage your orders
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-gray-400 mb-6">
                Looks like you haven't placed any orders yet.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Start Shopping
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="block bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all hover:scale-[1.01]"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="font-mono text-sm text-yellow-500">
                        #{order.orderNumber}
                      </span>
                      <p className="text-sm text-gray-400 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="capitalize">{order.orderStatus}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" :
                        order.paymentStatus === "failed" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="relative w-12 h-12 bg-gray-800 rounded-lg border-2 border-gray-900 overflow-hidden"
                          style={{ zIndex: order.items.length - idx }}
                        >
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-gray-800 rounded-lg border-2 border-gray-900 flex items-center justify-center text-sm text-gray-400">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-lg font-bold text-yellow-500">
                        KSh {order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="flex justify-end">
                    <span className="text-sm text-yellow-500 flex items-center gap-1">
                      View Order Details
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}