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
  Save,
  Smartphone,
  Hash,
  Printer
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface OrderItem {
  product: string | {
    _id?: string;
    sku?: string;
    images?: string[];
    name?: string;
  };
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
  paymentMethod: "mpesa" | "card" | "cash";
  paymentStatus: "pending" | "paid" | "failed" | "awaiting_confirmation";
  mpesaDetails?: {
    phoneNumber: string;
    transactionCode?: string;
    amount: number;
    paidAt?: Date;
  };
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Get the order ID from params - handle both 'id' and 'orderId'
  const orderId = params?.id || params?.orderId;

  // Helper function to safely get product image
  const getProductImage = (item: OrderItem): string | null => {
    if (!item.product) return null;
    
    // If product is an object and has images
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.images?.[0] || null;
    }
    
    return null;
  };

  // Helper function to get product SKU
  const getProductSku = (item: OrderItem): string => {
    if (!item.product) return 'N/A';
    
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.sku || 'N/A';
    }
    
    return 'N/A';
  };

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    if (orderId) {
      fetchOrder();
    } else {
      console.error("No order ID found in params:", params);
      setLoading(false);
      showNotification("error", "Invalid order ID");
    }
  }, [user, authLoading, router, orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      console.log("Fetching order with ID:", orderId);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        throw new Error(`Failed to fetch order: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Order data received:", data);
      
      if (data.success && data.data) {
        setOrder(data.data);
        setTrackingNumber(data.data.trackingNumber || "");
        setNotes(data.data.notes || "");
      } else if (data.order) {
        // Handle old API response format
        setOrder(data.order);
        setTrackingNumber(data.order.trackingNumber || "");
        setNotes(data.order.notes || "");
      } else {
        throw new Error(data.error || "Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      showNotification("error", error instanceof Error ? error.message : "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (field: string, value: string) => {
    if (!orderId) return;
    
    setSaving(true);
    try {
      const updateData: any = {};
      
      if (field === 'orderStatus') updateData.orderStatus = value;
      if (field === 'paymentStatus') updateData.paymentStatus = value;
      if (field === 'trackingNumber') updateData.trackingNumber = value;
      if (field === 'notes') updateData.notes = value;

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setOrder(data.data);
      } else if (data.order) {
        setOrder(data.order);
      }
      
      if (field === 'trackingNumber') setTrackingNumber(value);
      if (field === 'notes') setNotes(value);
      
      showNotification("success", `Order ${field === 'orderStatus' ? 'status' : field} updated successfully`);
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("error", "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      await fetchOrder();
      showNotification("success", "Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      showNotification("error", "Failed to cancel order");
    } finally {
      setSaving(false);
    }
  };

  const printInvoice = () => {
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .order-info { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { text-align: right; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <p>Order #${order.orderNumber}</p>
        </div>
        <div class="order-info">
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Customer:</strong> ${order.user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${order.contactInfo?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.contactInfo?.phone || 'N/A'}</p>
        </div>
        <table>
          <thead>
            <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name} ${item.size ? `(${item.size})` : ''} ${item.color ? `- ${item.color}` : ''}</td>
                <td>${item.quantity}</td>
                <td>KSh ${item.price.toLocaleString()}</td>
                <td>KSh ${(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Total Amount: KSh ${order.totalAmount.toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      case "cancelled":
        return <XCircle className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "processing":
        return <Package className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "processing":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "mpesa":
        return <Smartphone className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-gray-400">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no order ID
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Invalid Order ID</h2>
            <p className="text-gray-400 mb-6">
              No order ID was provided in the URL.
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

  // Show not found state
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order not found</h2>
            <p className="text-gray-400 mb-6">
              The order you're looking for doesn't exist or has been removed.
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
              notification.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/50 text-green-500'
                : 'bg-red-500/10 border border-red-500/50 text-red-500'
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
                  <span className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    Last updated: {new Date(order.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusUpdate('orderStatus', e.target.value)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold appearance-none cursor-pointer border ${getStatusColor(order.orderStatus)}`}
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
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold appearance-none cursor-pointer ${getPaymentStatusColor(order.paymentStatus)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="awaiting_confirmation">Awaiting Confirmation</option>
                </select>

                <button
                  onClick={printInvoice}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
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
                  {order.items.map((item: OrderItem, index: number) => {
                    const productImage = getProductImage(item);
                    const productSku = getProductSku(item);
                    
                    return (
                      <div key={index} className="flex gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                        <div className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
{productImage ? (
  <Image
    src={productImage}
    alt={item.name}
    fill
    className="object-cover"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      // Use inline SVG data URL instead of fetching from server
      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
    }}
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
                              <p className="text-xs text-gray-500">SKU: {productSku}</p>
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
                          <div className="mt-2 text-sm text-gray-500">
                            Subtotal: KSh {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Order Total Summary */}
                <div className="mt-4 pt-4 border-t border-gray-800 text-right">
                  <p className="text-xl font-bold">
                    Total Amount: KSh {order.totalAmount.toLocaleString()}
                  </p>
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
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <button
                        onClick={() => handleStatusUpdate('trackingNumber', trackingNumber)}
                        disabled={saving}
                        className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">Admin Notes</h2>
                <textarea
                  rows={3}
                  placeholder="Add private notes about this order..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleStatusUpdate('notes', notes)}
                  disabled={saving}
                  className="mt-3 w-full py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  Save Notes
                </button>
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
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-300">{order.contactInfo?.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/users?search=${order.user?.email}`}
                    className="inline-block mt-2 text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    View Customer Profile →
                  </Link>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-yellow-500" />
                  Contact Information
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300">{order.contactInfo?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300">{order.contactInfo?.phone || 'N/A'}</span>
                  </div>
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Method</span>
                    <span className="text-gray-300 capitalize flex items-center gap-1">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      {order.paymentMethod}
                    </span>
                  </div>
                  {order.mpesaDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">M-Pesa Phone</span>
                        <span className="text-gray-300">{order.mpesaDetails.phoneNumber}</span>
                      </div>
                      {order.mpesaDetails.transactionCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transaction Code</span>
                          <span className="text-gray-300">{order.mpesaDetails.transactionCode}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="border-t border-gray-800 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
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

                  {order.orderStatus !== 'pending' && order.orderStatus !== 'cancelled' && (
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleCancelOrder}
              disabled={saving || order.orderStatus === 'cancelled' || order.orderStatus === 'delivered'}
              className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Order
            </button>
            <button
              onClick={printInvoice}
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