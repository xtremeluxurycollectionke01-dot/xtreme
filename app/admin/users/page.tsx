"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Search, 
  Edit, 
  Trash2, 
  User,
  Shield,
  Mail,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: string;
  orders?: number;
}

export default function AdminUsers() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
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

    fetchUsers();
  }, [user, authLoading, router, currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      const data = await response.json();
      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole as "customer" | "admin" } : u
      ));
      showNotification("success", "User role updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("error", "Failed to update user role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === user?._id) {
      showNotification("error", "You cannot delete your own account");
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter(u => u._id !== userId));
      showNotification("success", "User deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("error", "Failed to delete user");
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              MANAGE <span className="text-yellow-500">USERS</span>
            </h1>
            <p className="text-gray-400">
              View and manage customer accounts
            </p>
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
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Orders</th>
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
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((userItem) => (
                      <tr key={userItem._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-black" />
                            </div>
                            <div>
                              <h3 className="font-medium">{userItem.name}</h3>
                              {userItem._id === user?._id && (
                                <span className="text-xs text-yellow-500">(You)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-300">{userItem.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={userItem.role}
                            onChange={(e) => handleRoleChange(userItem._id, e.target.value)}
                            disabled={userItem._id === user?._id}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold appearance-none cursor-pointer ${
                              userItem.role === 'admin' 
                                ? 'bg-purple-500/20 text-purple-400' 
                                : 'bg-green-500/20 text-green-400'
                            } ${userItem._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                            {userItem.orders || 0} orders
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {deleteConfirm === userItem._id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(userItem._id)}
                                  disabled={userItem._id === user?._id}
                                  className="p-2 text-green-500 hover:text-green-400 transition-colors disabled:opacity-50"
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
                                onClick={() => setDeleteConfirm(userItem._id)}
                                disabled={userItem._id === user?._id}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
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