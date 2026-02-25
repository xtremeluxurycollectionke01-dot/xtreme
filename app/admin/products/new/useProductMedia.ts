/*import { useState } from "react";
import { ProductFormData } from "./product.types";

export const useProductMedia = (
  formData: ProductFormData,
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

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

  return {
    imageUrl,
    setImageUrl,
    imageAlt,
    setImageAlt,
    addImage,
    removeImage,
    setPrimaryImage,
  };
};*/

import { useState } from "react";
import { ProductFormData } from "./product.types";

export const useProductMedia = (
  formData: ProductFormData,
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const addImage = () => {
    if (imageUrl.trim()) {
      const isFirst = formData.images.length === 0;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { 
          url: imageUrl.trim(), 
          alt: imageAlt || prev.name,
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

  return {
    imageUrl,
    setImageUrl,
    imageAlt,
    setImageAlt,
    addImage,
    removeImage,
    setPrimaryImage,
  };
};