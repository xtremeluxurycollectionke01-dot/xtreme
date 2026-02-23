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
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  AlertCircle,
  Save
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    if (params.orderId) {
      fetchOrder();
    }
  }, [user, authLoading, router, params.orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.orderId}`);
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
      showNotification("error", "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (field: string, value: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${params.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      setOrder({ ...order, [field]: value });
      showNotification("success", "Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("error", "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-purple-500" />;
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
      case "processing":
        return "bg-purple-500/20 text-purple-400";
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
              href="/admin/orders"
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
          className="max-w-7xl mx-auto"
        >
          {/* Back Button */}
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Orders
          </Link>

          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-500' :
              'bg-red-500/10 border border-red-500/50 text-red-500'
            }`}>
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{notification.message}</p>
            </div>
          )}

          {/* Order Header */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">
                    Order <span className="text-yellow-500">#{order.orderNumber}</span>
                  </h1>
                  {saving && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-500"></div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusUpdate('orderStatus', e.target.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold appearance-none cursor-pointer ${getStatusColor(order.orderStatus)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={order.paymentStatus}
                  onChange={(e) => handleStatusUpdate('paymentStatus', e.target.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold appearance-none cursor-pointer ${
                    order.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" :
                    order.paymentStatus === "failed" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-yellow-500" />
                  Order Items ({order.items.length})
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
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-400">
                              SKU: {item.product?.sku || 'N/A'}
                            </p>
                          </div>
                          <p className="text-yellow-500 font-bold">
                            KSh {item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-400">Qty: {item.quantity}</span>
                          {item.size && <span className="text-gray-400">Size: {item.size}</span>}
                          {item.color && <span className="text-gray-400">Color: {item.color}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Information */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-yellow-500" />
                  Tracking Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Tracking Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={order.trackingNumber || ''}
                        onChange={(e) => setOrder({ ...order, trackingNumber: e.target.value })}
                        placeholder="Enter tracking number"
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <button
                        onClick={() => handleStatusUpdate('trackingNumber', order.trackingNumber)}
                        disabled={saving}
                        className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Order Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-yellow-500" />
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-black" />
                    </div>
                                   <div>
                      <p className="font-medium">{order.user?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-400">Customer</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href={`mailto:${order.user?.email}`} className="text-gray-300 hover:text-yellow-500">
                        {order.user?.email || 'N/A'}
                      </a>
                    </div>
                    {order.user?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-300">{order.user.phone}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/admin/users?search=${order.user?.email}`}
                    className="inline-block mt-2 text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    View Customer Profile →
                  </Link>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-yellow-500" />
                  Shipping Address
                </h2>
                <div className="space-y-1 text-gray-300">
                  <p>{order.shippingAddress?.street}</p>
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-yellow-500" />
                  Payment Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method</span>
                    <span className="text-gray-300 capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-300">KSh {order.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-yellow-500 text-xl">
                        KSh {order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Order Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                      <div className="absolute top-4 left-1 w-0.5 h-12 bg-gray-700"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {order.orderStatus !== 'pending' && (
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className={`w-2 h-2 mt-2 ${
                          order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                            ? 'bg-green-500' 
                            : 'bg-gray-600'
                        } rounded-full`}></div>
                        {order.orderStatus !== 'delivered' && (
                          <div className="absolute top-4 left-1 w-0.5 h-12 bg-gray-700"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Processing</p>
                        {order.orderStatus === 'processing' && (
                          <p className="text-xs text-gray-400">In progress</p>
                        )}
                      </div>
                    </div>
                  )}

                  {(order.orderStatus === 'shipped' || order.orderStatus === 'delivered') && (
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className={`w-2 h-2 mt-2 ${
                          order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                            ? 'bg-green-500' 
                            : 'bg-gray-600'
                        } rounded-full`}></div>
                        {order.orderStatus !== 'delivered' && (
                          <div className="absolute top-4 left-1 w-0.5 h-12 bg-gray-700"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Shipped</p>
                        {order.trackingNumber && (
                          <p className="text-xs text-gray-400">Tracking: {order.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {order.orderStatus === 'delivered' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Delivered</p>
                        <p className="text-xs text-gray-400">Completed</p>
                      </div>
                    </div>
                  )}

                  {order.orderStatus === 'cancelled' && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Cancelled</p>
                        <p className="text-xs text-gray-400">Order was cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Admin Notes</h2>
                <textarea
                  rows={3}
                  placeholder="Add private notes about this order..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                  value={order.notes || ''}
                  onChange={(e) => setOrder({ ...order, notes: e.target.value })}
                ></textarea>
                <button
                  onClick={() => handleStatusUpdate('notes', order.notes)}
                  disabled={saving}
                  className="mt-3 w-full py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this order?')) {
                  // Handle delete
                }
              }}
              className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              Delete Order
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-yellow-500 hover:text-yellow-500 transition-colors"
            >
              Print Invoice
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}