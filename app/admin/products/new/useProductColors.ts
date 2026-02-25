import { ProductFormData } from "./product.types";

export const useProductColors = (
  formData: ProductFormData,
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
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

  return {
    addColor,
    removeColor,
  };
};