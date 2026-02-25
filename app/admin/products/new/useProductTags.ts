import { useState } from "react";
import { ProductFormData } from "./product.types";

export const useProductTags = (
  formData: ProductFormData,
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return {
    tagInput,
    setTagInput,
    addTag,
    removeTag,
  };
};