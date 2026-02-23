"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/users"),
        fetch("/api/admin/orders"),
      ]);

      const products = await productsRes.json();
      const users = await usersRes.json();
      const orders = await ordersRes.json();

      // Calculate stats
      const totalRevenue = orders.data?.reduce((sum: number, order: any) => 
        sum + order.totalAmount, 0) || 0;

      const recentOrders = orders.data?.slice(0, 5) || [];
      
      const lowStockProducts = products.data?.filter((p: any) => p.stock < 10) || [];

      setStats({
        totalProducts: products.data?.length || 0,
        totalUsers: users.data?.length || 0,
        totalOrders: orders.data?.length || 0,
        totalRevenue,
        recentOrders,
        lowStockProducts: lowStockProducts.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      href: "/admin/products",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-green-500 to-green-600",
      href: "/admin/users",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "from-purple-500 to-purple-600",
      href: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              ADMIN <span className="text-yellow-500">DASHBOARD</span>
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.name}. Here's what's happening with your store.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                href={stat.href}
                className="group bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </Link>
            ))}
          </div>

          {/* Recent Orders and Low Stock */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order: any) => (
                    <Link
                      key={order._id}
                      href={`/admin/orders/${order._id}`}
                      className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-yellow-500">
                          #{order.orderNumber}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === "delivered" ? "bg-green-500/20 text-green-400" :
                          order.orderStatus === "cancelled" ? "bg-red-500/20 text-red-400" :
                          order.orderStatus === "shipped" ? "bg-blue-500/20 text-blue-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold">
                          KSh {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent orders
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Low Stock Alert
                </h2>
                <Link
                  href="/admin/products"
                  className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1"
                >
                  Manage Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {stats.lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {stats.lowStockProducts.map((product: any) => (
                    <Link
                      key={product._id}
                      href={`/admin/products/${product._id}/edit`}
                      className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-400">
                            SKU: {product.sku}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            product.stock === 0 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No low stock products
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href="/admin/products/new"
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:border-yellow-500 transition-colors group"
              >
                <Package className="h-8 w-8 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Add Product</span>
              </Link>
              <Link
                href="/admin/users"
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:border-yellow-500 transition-colors group"
              >
                <Users className="h-8 w-8 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Manage Users</span>
              </Link>
              <Link
                href="/admin/orders"
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:border-yellow-500 transition-colors group"
              >
                <ShoppingBag className="h-8 w-8 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm">View Orders</span>
              </Link>
              <Link
                href="/"
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:border-yellow-500 transition-colors group"
              >
                <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm">View Store</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}