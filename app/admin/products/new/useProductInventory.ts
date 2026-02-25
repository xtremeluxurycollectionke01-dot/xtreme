import { useState } from "react";
import { ProductFormData } from "./product.types";

export const useProductInventory = (
  formData: ProductFormData,
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  const [selectedSizeSystem, setSelectedSizeSystem] = useState<"US" | "UK" | "EU" | "CM">("US");
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStock, setSizeStock] = useState("1");

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

  const getTotalStock = () => {
    return formData.sizes.reduce((sum, s) => sum + s.stock, 0);
  };

  return {
    selectedSizeSystem,
    setSelectedSizeSystem,
    selectedSize,
    setSelectedSize,
    sizeStock,
    setSizeStock,
    addSize,
    removeSize,
    updateSizeStock,
    getTotalStock,
  };
};