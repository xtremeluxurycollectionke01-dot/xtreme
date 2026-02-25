import { useState, useEffect } from "react";
import { ProductFormData, NotificationState } from "./product.types";

const initialFormData: ProductFormData = {
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
  tags: [],
  sizes: [],
  colors: [],
  images: [],
  weight: "",
  material: "",
  styleCode: "",
  releaseDate: "",
  condition: "new",
};

export const useProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  
  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const showNotification = (type: NotificationState['type'], message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
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

  const validateForm = (): string | null => {
    if (!formData.name) return "Product name is required";
    if (!formData.sku) return "SKU is required";
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required";
    if (!formData.category) return "Category is required";
    if (formData.images.length === 0) return "At least one image is required";
    if (formData.sizes.length === 0) return "At least one size is required";
    if (formData.colors.length === 0) return "At least one color is required";
    return null;
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    setFormData,
    notification,
    showNotification,
    handleChange,
    calculateProfit,
    calculateMargin,
    validateForm,
    resetForm,
  };
};