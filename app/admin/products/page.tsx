"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  sku: string;
  category: any;
  isActive: boolean;
  createdAt: string;
}

export default function AdminProducts() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    fetchProducts();
  }, [user, authLoading, router, currentPage, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/products?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      const data = await response.json();
      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("error", "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter(p => p._id !== productId));
      showNotification("success", "Product deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("error", "Failed to delete product");
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setProducts(products.map(p => 
        p._id === productId ? { ...p, isActive: !currentStatus } : p
      ));
      showNotification("success", `Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating product:", error);
      showNotification("error", "Failed to update product");
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
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
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                MANAGE <span className="text-yellow-500">PRODUCTS</span>
              </h1>
              <p className="text-gray-400">
                Add, edit, and manage your product catalog
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New Product
            </Link>
          </div>

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

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-xs text-gray-500">
                                {product.category?.name || 'Uncategorized'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{product.sku}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-bold text-yellow-500">
                              KSh {product.price.toLocaleString()}
                            </span>
                            {product.comparePrice && (
                              <span className="ml-2 text-xs text-gray-500 line-through">
                                KSh {product.comparePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 10 ? 'bg-green-500/20 text-green-400' :
                            product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(product._id, product.isActive)}
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              product.isActive 
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            } transition-colors`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            {deleteConfirm === product._id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="p-2 text-green-500 hover:text-green-400 transition-colors"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(product._id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}