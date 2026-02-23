/*"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Package,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    sku: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    isFeatured: false,
    isActive: true,
    tags: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as string[],
  });

  // Tag input
  const [tagInput, setTagInput] = useState("");
  
  // Size input
  const [sizeInput, setSizeInput] = useState("");
  
  // Color input
  const [colorInput, setColorInput] = useState("");
  
  // Image URL input
  const [imageUrl, setImageUrl] = useState("");

  // Available sizes for shoes
  const availableSizes = [
    "EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45", "EU 46",
    "US 5", "US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12",
    "UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"
  ];

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    fetchCategories();
  }, [user, authLoading, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSize = () => {
    if (sizeInput && !formData.sizes.includes(sizeInput)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput]
      }));
      setSizeInput("");
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()]
      }));
      setColorInput("");
    }
  };

  const removeColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  const addImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl("");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }));
  };

  const validateForm = () => {
    if (!formData.name) return "Product name is required";
    if (!formData.sku) return "SKU is required";
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required";
    if (!formData.category) return "Category is required";
    if (formData.images.length === 0) return "At least one image is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      showNotification("error", validationError);
      return;
    }

    setSaving(true);
    showNotification("success", "Creating product...");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      showNotification("success", "Product created successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Error creating product:", error);
      showNotification("error", error.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
          className="max-w-4xl mx-auto"
        >
          {/* Header *
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/products"
              className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-yellow-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                ADD NEW <span className="text-yellow-500">PRODUCT</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Create a new product in your catalog
              </p>
            </div>
          </div>

          {/* Notification *
          {notification && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-500' :
              'bg-red-500/10 border border-red-500/50 text-red-500'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </div>
          )}

          {/* Main Form *
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-yellow-500" />
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Product Name *
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="e.g., Air Max 270"
                  />
                </div>

                {/* Slug *
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="auto-generated-from-name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>

                {/* Description *
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                    placeholder="Product description..."
                  />
                </div>

                {/* SKU and Brand *
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., Nike-AIRMAX-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., Nike, Adidas"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Stock *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Pricing & Stock</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (KSh) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Compare at Price
                  </label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Category *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Category</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  >
                    <option value="">Select a subcategory</option>
                    {/* Add subcategories based on selected category *
                  </select>
                </div>
              </div>
            </div>

            {/* Images *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Product Images</h2>

              {/* Image Upload URL Input *
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add
                </button>
              </div>

              {/* Image Preview Grid *
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                        <Image
                          src={img}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No images added yet</p>
                  <p className="text-sm text-gray-600">Add at least one image URL above</p>
                </div>
              )}
            </div>

            {/* Sizes *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Available Sizes</h2>

              {/* Size Input *
              <div className="flex gap-2 mb-4">
                <select
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                >
                  <option value="">Select a size</option>
                  {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addSize}
                  className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Add Size
                </button>
              </div>

              {/* Size Tags *
              {formData.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Colors *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Colors</h2>

              {/* Color Input *
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Enter color (e.g., Red, Blue, Black)"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Add Color
                </button>
              </div>

              {/* Color Tags *
              {formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Tags</h2>

              {/* Tag Input *
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Enter a tag and press Enter or click Add"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Add Tag
                </button>
              </div>

              {/* Tag List *
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Settings *
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Settings</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                  />
                  <span className="text-gray-300">Feature this product on homepage</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                  />
                  <span className="text-gray-300">Product is active and visible</span>
                </label>
              </div>
            </div>

            {/* Form Actions *
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Create Product
                  </>
                )}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 py-4 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-red-500 hover:text-red-500 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}*/










/*"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Upload,
  Package,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Hash,
  Palette,
  Ruler,
  Tag,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Trash2
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

// Manual categories (to be moved to DB later)
const CATEGORIES = [
  {
    _id: "sneakers",
    name: "Sneakers",
    slug: "sneakers",
    subcategories: ["Running", "Basketball", "Lifestyle", "Skateboarding", "Training"]
  },
  {
    _id: "formal-shoes",
    name: "Formal Shoes",
    slug: "formal-shoes",
    subcategories: ["Oxfords", "Loafers", "Derby", "Monk Strap", "Dress Boots"]
  },
  {
    _id: "boots",
    name: "Boots",
    slug: "boots",
    subcategories: ["Work Boots", "Hiking Boots", "Chelsea Boots", "Combat Boots"]
  },
  {
    _id: "sandals",
    name: "Sandals & Slides",
    slug: "sandals",
    subcategories: ["Athletic Slides", "Flip Flops", "Sandals"]
  },
  {
    _id: "accessories",
    name: "Accessories",
    slug: "accessories",
    subcategories: ["Insoles", "Laces", "Cleaning Kits", "Shoe Care"]
  }
];

// Shoe-specific brands
const SHOE_BRANDS = [
  "Nike", "Adidas", "Puma", "New Balance", "Jordan", "Converse", 
  "Vans", "Reebok", "ASICS", "Under Armour", "Timberland", 
  "Dr. Martens", "Clarks", "Crocs", "Birkenstock", "Other"
];

// Size systems
type SizeSystemKey = "US" | "UK" | "EU" | "CM";

const SIZE_SYSTEMS: Record<
  SizeSystemKey,
  { label: string; sizes: string[] }
> = {
  US: { label: "US", sizes: Array.from({ length: 18 }, (_, i) => (i + 4).toString()) },
  UK: { label: "UK", sizes: Array.from({ length: 15 }, (_, i) => (i + 3).toString()) },
  EU: { label: "EU", sizes: Array.from({ length: 25 }, (_, i) => (35 + i).toString()) },
  CM: { label: "CM", sizes: Array.from({ length: 20 }, (_, i) => (22 + i * 0.5).toFixed(1)) }
};
/*const SIZE_SYSTEMS = {
  US: { label: "US", sizes: Array.from({length: 18}, (_, i) => (i + 4).toString()) },
  UK: { label: "UK", sizes: Array.from({length: 15}, (_, i) => (i + 3).toString()) },
  EU: { label: "EU", sizes: Array.from({length: 25}, (_, i) => (35 + i).toString()) },
  CM: { label: "CM", sizes: Array.from({length: 20}, (_, i) => (22 + i * 0.5).toFixed(1)) }
};*

// Common shoe colors with hex codes
const SHOE_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Orange", hex: "#F97316" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Brown", hex: "#92400E" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Beige", hex: "#D4C4B5" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Multi-color", hex: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)" }
];

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: string[];
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'media' | 'attributes'>('basic');
  const [previewMode, setPreviewMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    costPerItem: "",
    sku: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    gender: "unisex",
    isFeatured: false,
    isActive: true,
    tags: [] as string[],
    sizes: [] as {size: string, system: string, stock: number}[],
    colors: [] as {name: string, hex: string}[],
    images: [] as {url: string, alt: string, isPrimary: boolean}[],
    weight: "",
    material: "",
    styleCode: "",
    releaseDate: "",
    condition: "new",
  });

  // Input states
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  //const [selectedSizeSystem, setSelectedSizeSystem] = useState("US");
  const [selectedSizeSystem, setSelectedSizeSystem] = useState<SizeSystemKey>("US");
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStock, setSizeStock] = useState("1");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addSize = () => {
    if (selectedSize && !formData.sizes.find(s => s.size === selectedSize && s.system === selectedSizeSystem)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size: selectedSize, system: selectedSizeSystem, stock: parseInt(sizeStock) || 0 }]
      }));
      setSelectedSize("");
      setSizeStock("1");
    }
  };

  const removeSize = (size: string, system: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => !(s.size === size && s.system === system))
    }));
  };

  const updateSizeStock = (size: string, system: string, newStock: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => 
        s.size === size && s.system === system ? { ...s, stock: newStock } : s
      )
    }));
  };

  const addColor = (colorName: string, hex: string) => {
    if (!formData.colors.find(c => c.name === colorName)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { name: colorName, hex }]
      }));
    }
  };

  const removeColor = (colorName: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c.name !== colorName)
    }));
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      const isFirst = formData.images.length === 0;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { 
          url: imageUrl.trim(), 
          alt: imageAlt || formData.name,
          isPrimary: isFirst 
        }]
      }));
      setImageUrl("");
      setImageAlt("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // Ensure primary image exists
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const setPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isPrimary: i === index }))
    }));
  };

  const validateForm = () => {
    if (!formData.name) return "Product name is required";
    if (!formData.sku) return "SKU is required";
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required";
    if (!formData.category) return "Category is required";
    if (formData.images.length === 0) return "At least one image is required";
    if (formData.sizes.length === 0) return "At least one size is required";
    if (formData.colors.length === 0) return "At least one color is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      showNotification("error", validationError);
      return;
    }

    setSaving(true);
    showNotification("info", "Creating product...");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          costPerItem: formData.costPerItem ? parseFloat(formData.costPerItem) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          totalStock: formData.sizes.reduce((sum, s) => sum + s.stock, 0),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      showNotification("success", "Product created successfully!");
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Error creating product:", error);
      showNotification("error", error.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPerItem) || 0;
    return price - cost;
  };

  const calculateMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const profit = calculateProfit();
    return price > 0 ? ((profit / price) * 100).toFixed(1) : "0";
  };

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

  const selectedCategory = categories.find(c => c._id === formData.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header *
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/products"
                className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-yellow-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  ADD NEW <span className="text-yellow-500">PRODUCT</span>
                </h1>
                <p className="text-gray-400 mt-1">
                  Create a new shoe listing in your catalog
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-yellow-500 transition-colors"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? "Edit Mode" : "Preview"}
            </button>
          </div>

          {/* Notification *
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  notification.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-500' :
                  notification.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-500' :
                  'bg-blue-500/10 border border-blue-500/50 text-blue-500'
                }`}
              >
                {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                 notification.type === 'error' ? <AlertCircle className="h-5 w-5" /> :
                 <Sparkles className="h-5 w-5" />}
                <p>{notification.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation *
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
            {[
              { id: 'basic', label: 'Basic Info', icon: Package },
              { id: 'pricing', label: 'Pricing', icon: DollarSign },
              { id: 'inventory', label: 'Inventory', icon: Layers },
              { id: 'media', label: 'Media', icon: ImageIcon },
              { id: 'attributes', label: 'Attributes', icon: Tag },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-yellow-500 text-black font-medium' 
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form *
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info Tab *
                {activeTab === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6"
                  >
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Package className="h-5 w-5 text-yellow-500" />
                      Basic Information
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          placeholder="e.g., Nike Air Max 270"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Slug
                          </label>
                          <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="nike-air-max-270"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Style Code
                          </label>
                          <input
                            type="text"
                            name="styleCode"
                            value={formData.styleCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="e.g., AH8050-002"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Short Description
                        </label>
                        <input
                          type="text"
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={handleChange}
                          maxLength={160}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          placeholder="Brief description for product cards (max 160 chars)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.shortDescription.length}/160 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                          placeholder="Detailed product description..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Brand <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          >
                            <option value="">Select brand</option>
                            {SHOE_BRANDS.map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          >
                            <option value="unisex">Unisex</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Release Date
                          </label>
                          <input
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Material
                          </label>
                          <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="e.g., Leather, Mesh, Synthetic"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Pricing Tab *
                {activeTab === 'pricing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6"
                  >
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-yellow-500" />
                      Pricing Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Price (KSh) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">KSh</span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Compare at Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">KSh</span>
                          <input
                            type="number"
                            name="comparePrice"
                            value={formData.comparePrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Original price for comparison</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cost per Item
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">KSh</span>
                          <input
                            type="number"
                            name="costPerItem"
                            value={formData.costPerItem}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">For profit calculation</p>
                      </div>
                    </div>

                    {/* Profit Calculator *
                    {formData.price && formData.costPerItem && (
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-300 mb-3">Profit Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Profit per Item</p>
                            <p className={`text-lg font-bold ${calculateProfit() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              KSh {calculateProfit().toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Profit Margin</p>
                            <p className={`text-lg font-bold ${parseFloat(calculateMargin()) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {calculateMargin()}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Inventory Tab *
                {activeTab === 'inventory' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6"
                  >
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Layers className="h-5 w-5 text-yellow-500" />
                      Inventory Management
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                          <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="NIKE-AM270-BLK-001"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Condition
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        >
                          <option value="new">New</option>
                          <option value="used">Used</option>
                          <option value="refurbished">Refurbished</option>
                        </select>
                      </div>
                    </div>

                    {/* Size Inventory *
                    <div className="border border-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-yellow-500" />
                        Size Inventory <span className="text-red-500">*</span>
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <select
                          value={selectedSizeSystem}
                          //onChange={(e) => setSelectedSizeSystem(e.target.value)}
                          onChange={(e) =>
                            setSelectedSizeSystem(e.target.value as SizeSystemKey)
                            }
                          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                        >
                          {/*{Object.keys(SIZE_SYSTEMS).map(sys => (
                            <option key={sys} value={sys}>{SIZE_SYSTEMS[sys].label}</option>
                          ))}*
                          {(Object.keys(SIZE_SYSTEMS) as SizeSystemKey[]).map((sys) => (
                            <option key={sys} value={sys}>
                                {SIZE_SYSTEMS[sys].label}
                            </option>
                            ))}
                        </select>
                        <select
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                        >
                          <option value="">Select size</option>
                          {SIZE_SYSTEMS[selectedSizeSystem].sizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={sizeStock}
                          onChange={(e) => setSizeStock(e.target.value)}
                          min="1"
                          className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                          placeholder="Qty"
                        />
                        <button
                          type="button"
                          onClick={addSize}
                          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {formData.sizes.length > 0 ? (
                        <div className="space-y-2">
                          {formData.sizes.map((size, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{size.system} {size.size}</span>
                                <span className="text-gray-500">→</span>
                                <input
                                  type="number"
                                  value={size.stock}
                                  onChange={(e) => updateSizeStock(size.size, size.system, parseInt(e.target.value) || 0)}
                                  className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-center"
                                  min="0"
                                />
                                <span className="text-sm text-gray-500">in stock</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSize(size.size, size.system)}
                                className="text-red-500 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-800 mt-2">
                            <p className="text-sm text-gray-400">
                              Total Stock: <span className="text-yellow-500 font-bold">
                                {formData.sizes.reduce((sum, s) => sum + s.stock, 0)}
                              </span> units
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No sizes added yet. Add sizes to track inventory.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Media Tab *
                {activeTab === 'media' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6"
                  >
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-yellow-500" />
                      Product Images <span className="text-red-500">*</span>
                    </h2>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL..."
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Alt text"
                        className="w-40 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>

                    {formData.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {formData.images.map((img, index) => (
                          <div key={index} className={`relative group rounded-lg overflow-hidden border-2 ${
                            img.isPrimary ? 'border-yellow-500' : 'border-gray-700'
                          }`}>
                            <div className="relative aspect-square">
                              <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!img.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => setPrimaryImage(index)}
                                  className="p-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400"
                                  title="Set as primary"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            {img.isPrimary && (
                              <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                                Primary
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
                        <Upload className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No images added yet</p>
                        <p className="text-sm text-gray-600 mt-1">Add at least one image URL above</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Attributes Tab *
                {activeTab === 'attributes' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Colors *
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-yellow-500" />
                        Colors <span className="text-red-500">*</span>
                      </h2>

                      <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                        {SHOE_COLORS.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => addColor(color.name, color.hex)}
                            disabled={formData.colors.find(c => c.name === color.name) !== undefined}
                            className={`relative aspect-square rounded-lg border-2 transition-all ${
                              formData.colors.find(c => c.name === color.name)
                                ? 'border-yellow-500 ring-2 ring-yellow-500/50'
                                : 'border-gray-700 hover:border-gray-500'
                            } ${color.name === 'White' || color.name === 'Cream' ? 'bg-white' : ''}`}
                            style={{
                              background: color.hex.startsWith('linear') ? color.hex : color.hex,
                            }}
                            title={color.name}
                          >
                            {formData.colors.find(c => c.name === color.name) && (
                              <CheckCircle className="absolute inset-0 m-auto h-6 w-6 text-yellow-500 drop-shadow-lg" />
                            )}
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {formData.colors.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                          {formData.colors.map((color) => (
                            <span
                              key={color.name}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full text-sm border border-gray-700"
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-gray-600"
                                style={{ background: color.hex }}
                              />
                              {color.name}
                              <button
                                type="button"
                                onClick={() => removeColor(color.name)}
                                className="hover:text-red-500 ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Category *
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-6">Category & Tags</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subcategory
                          </label>
                          <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            disabled={!selectedCategory}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white disabled:opacity-50"
                          >
                            <option value="">
                              {selectedCategory ? "Select subcategory" : "Select category first"}
                            </option>
                            {selectedCategory?.subcategories.map(sub => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Tags *
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tags
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag..."
                            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-700"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Settings *
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-6">Product Settings</h2>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                          <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                          />
                          <div>
                            <span className="text-gray-300 font-medium">Feature this product</span>
                            <p className="text-sm text-gray-500">Show on homepage and featured sections</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                          />
                          <div>
                            <span className="text-gray-300 font-medium">Active</span>
                            <p className="text-sm text-gray-500">Product is visible and available for purchase</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Form Actions *
                <div className="flex flex-col sm:flex-row gap-4 pt-6 sticky bottom-0 bg-gradient-to-t from-black to-transparent pb-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Create Product
                      </>
                    )}
                  </button>
                  <Link
                    href="/admin/products"
                    className="flex-1 py-4 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-red-500 hover:text-red-500 transition-colors text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Preview Sidebar *
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Product Preview</h3>
                  
                  {formData.images.length > 0 ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-800">
                      <Image
                        src={formData.images.find(img => img.isPrimary)?.url || formData.images[0].url}
                        alt={formData.name || "Product preview"}
                        fill
                        className="object-cover"
                      />
                      {formData.comparePrice && parseFloat(formData.comparePrice) > parseFloat(formData.price || "0") && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                          SALE
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                      <Package className="h-16 w-16 text-gray-600" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-bold text-lg truncate">{formData.name || "Product Name"}</h4>
                    <p className="text-gray-400 text-sm line-clamp-2">{formData.shortDescription || formData.description || "No description"}</p>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xl font-bold text-yellow-500">
                        KSh {formData.price || "0.00"}
                      </span>
                      {formData.comparePrice && parseFloat(formData.comparePrice) > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          KSh {formData.comparePrice}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.colors.slice(0, 3).map((color) => (
                        <span
                          key={color.name}
                          className="w-6 h-6 rounded-full border border-gray-600"
                          style={{ background: color.hex }}
                          title={color.name}
                        />
                      ))}
                      {formData.colors.length > 3 && (
                        <span className="text-xs text-gray-500 flex items-center">
                          +{formData.colors.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-800 mt-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">SKU:</span>
                        <span className="font-mono">{formData.sku || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Stock:</span>
                        <span>{formData.sizes.reduce((sum, s) => sum + s.stock, 0)} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sizes:</span>
                        <span>{formData.sizes.length} options</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats *
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Completion Status</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Basic Info", complete: formData.name && formData.sku && formData.brand },
                      { label: "Pricing", complete: parseFloat(formData.price) > 0 },
                      { label: "Inventory", complete: formData.sizes.length > 0 },
                      { label: "Images", complete: formData.images.length > 0 },
                      { label: "Colors", complete: formData.colors.length > 0 },
                      { label: "Category", complete: formData.category },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{item.label}</span>
                        {item.complete ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-700" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}*/


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Size {
  size: string;
  system: "US" | "UK" | "EU";
  stock: number;
}

interface Color {
  name: string;
  hex: string;
}

interface Image {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Form state with proper structure
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    sku: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    isFeatured: false,
    isActive: true,
    tags: [] as string[],
    sizes: [] as Size[],
    colors: [] as Color[],
    images: [] as Image[],
  });

  // Form inputs
  const [tagInput, setTagInput] = useState("");
  const [sizeInput, setSizeInput] = useState<Size>({ size: "", system: "US", stock: 1 });
  const [colorInput, setColorInput] = useState<Color>({ name: "", hex: "#000000" });
  const [imageInput, setImageInput] = useState<Image>({ url: "", alt: "", isPrimary: false });

  // Available size systems
  const sizeSystems = ["US", "UK", "EU"] as const;

  // Size ranges by system
  const sizeRanges = {
    US: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    UK: ["3", "4", "5", "6", "7", "8", "9", "10", "11"],
    EU: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
  };

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    fetchCategories();
  }, [user, authLoading, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSize = () => {
    if (sizeInput.size && sizeInput.system) {
      // Check if size already exists
      const exists = formData.sizes.some(
        s => s.size === sizeInput.size && s.system === sizeInput.system
      );
      
      if (!exists) {
        setFormData(prev => ({
          ...prev,
          sizes: [...prev.sizes, { ...sizeInput }]
        }));
        setSizeInput({ size: "", system: "US", stock: 1 });
      } else {
        showNotification("error", "Size already added");
      }
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const updateSizeStock = (index: number, stock: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, stock } : size
      )
    }));
  };

  const addColor = () => {
    if (colorInput.name && colorInput.hex) {
      // Check if color already exists
      const exists = formData.colors.some(c => c.name.toLowerCase() === colorInput.name.toLowerCase());
      
      if (!exists) {
        setFormData(prev => ({
          ...prev,
          colors: [...prev.colors, { ...colorInput }]
        }));
        setColorInput({ name: "", hex: "#000000" });
      } else {
        showNotification("error", "Color already added");
      }
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (imageInput.url) {
      // Check if image already exists
      const exists = formData.images.some(img => img.url === imageInput.url);
      
      if (!exists) {
        // If this is the first image, make it primary
        const isPrimary = formData.images.length === 0 ? true : imageInput.isPrimary;
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { ...imageInput, isPrimary }]
        }));
        setImageInput({ url: "", alt: "", isPrimary: false });
      } else {
        showNotification("error", "Image URL already added");
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const validateForm = () => {
    if (!formData.name) return "Product name is required";
    if (!formData.sku) return "SKU is required";
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required";
    if (!formData.category) return "Category is required";
    if (formData.images.length === 0) return "At least one image is required";
    
    // Validate category is a valid ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(formData.category)) {
      return "Please select a valid category from the list";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      showNotification("error", validationError);
      return;
    }

    setSaving(true);
    showNotification("success", "Creating product...");

    try {
      // Prepare data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock) || 0,
        sizes: formData.sizes,
        colors: formData.colors,
        images: formData.images,
      };

      console.log("Submitting product data:", productData);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      showNotification("success", "Product created successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (error: any) {
      console.error("Error creating product:", error);
      showNotification("error", error.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/products"
              className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-yellow-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                ADD NEW <span className="text-yellow-500">PRODUCT</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Create a new product in your catalog
              </p>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-500' :
              'bg-red-500/10 border border-red-500/50 text-red-500'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-yellow-500" />
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="e.g., Air Max 270"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="auto-generated-from-name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                    placeholder="Product description..."
                  />
                </div>

                {/* SKU and Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., NIKE-AIRMAX-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                      placeholder="e.g., Nike, Adidas"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Pricing</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (KSh) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Compare at Price
                  </label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Original price for showing discounts
                  </p>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Category</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="e.g., Running Shoes"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Product Images</h2>

              {/* Image Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageInput.url}
                    onChange={(e) => setImageInput({ ...imageInput, url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={imageInput.alt}
                    onChange={(e) => setImageInput({ ...imageInput, alt: e.target.value })}
                    placeholder="Image description"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imageInput.isPrimary}
                    onChange={(e) => setImageInput({ ...imageInput, isPrimary: e.target.checked })}
                    className="w-4 h-4 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                  />
                  <span className="text-sm text-gray-300">Set as primary image</span>
                </label>

                <button
                  type="button"
                  onClick={addImage}
                  disabled={!imageInput.url}
                  className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Image
                </button>
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                        <Image
                          src={img.url}
                          alt={img.alt || `Product image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      
                      {/* Image overlay buttons */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="p-1 bg-yellow-500 rounded-full hover:bg-yellow-400"
                            title="Set as primary"
                          >
                            <CheckCircle className="h-4 w-4 text-black" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-500 rounded-full hover:bg-red-400"
                          title="Remove image"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>

                      {/* Primary badge */}
                      {img.isPrimary && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No images added yet</p>
                  <p className="text-sm text-gray-600">Add at least one image</p>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Sizes & Inventory</h2>

              {/* Size Input Form */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Size System
                  </label>
                  <select
                    value={sizeInput.system}
                    onChange={(e) => setSizeInput({ ...sizeInput, system: e.target.value as "US" | "UK" | "EU" })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  >
                    {sizeSystems.map(sys => (
                      <option key={sys} value={sys}>{sys}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Size
                  </label>
                  <select
                    value={sizeInput.size}
                    onChange={(e) => setSizeInput({ ...sizeInput, size: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  >
                    <option value="">Select size</option>
                    {sizeRanges[sizeInput.system].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={sizeInput.stock}
                    onChange={(e) => setSizeInput({ ...sizeInput, stock: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addSize}
                    disabled={!sizeInput.size}
                    className="w-full px-4 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Size
                  </button>
                </div>
              </div>

              {/* Size List */}
              {formData.sizes.length > 0 && (
                <div className="space-y-2">
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                      <span className="w-20 font-medium">{size.system} {size.size}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-sm text-gray-400">Stock:</span>
                        <input
                          type="number"
                          value={size.stock}
                          onChange={(e) => updateSizeStock(index, parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="p-1 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Colors</h2>

              {/* Color Input Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color Name
                  </label>
                  <input
                    type="text"
                    value={colorInput.name}
                    onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                    placeholder="e.g., Black, Red, Blue"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hex Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={colorInput.hex}
                      onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })}
                      className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colorInput.hex}
                      onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })}
                      placeholder="#000000"
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addColor}
                    disabled={!colorInput.name}
                    className="w-full px-4 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Color List */}
              {formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-sm"
                      style={{ borderLeft: `4px solid ${color.hex}` }}
                    >
                      {color.name}
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Tags</h2>

              {/* Tag Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Enter a tag and press Enter or click Add"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  Add Tag
                </button>
              </div>

              {/* Tag List */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Settings</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                  />
                  <span className="text-gray-300">Feature this product on homepage</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                  />
                  <span className="text-gray-300">Product is active and visible</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Create Product
                  </>
                )}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 py-4 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-red-500 hover:text-red-500 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}