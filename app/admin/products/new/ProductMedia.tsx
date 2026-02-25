/*import React from "react";
import Image from "next/image";
import { ImageIcon, Plus, Upload, CheckCircle, Trash2, X } from "lucide-react";
import { ProductFormData } from "./product.types";

interface ProductMediaProps {
  formData: ProductFormData;
  media: {
    imageUrl: string;
    setImageUrl: (url: string) => void;
    imageAlt: string;
    setImageAlt: (alt: string) => void;
    addImage: () => void;
    removeImage: (index: number) => void;
    setPrimaryImage: (index: number) => void;
  };
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  formData,
  media,
}) => {
  const {
    imageUrl,
    setImageUrl,
    imageAlt,
    setImageAlt,
    addImage,
    removeImage,
    setPrimaryImage,
  } = media;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
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
    </div>
  );
};*/

import React from "react";
import Image from "next/image";
import { ImageIcon, Plus, Upload, CheckCircle, Trash2, X } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { ProductFormData } from "./product.types";

interface ProductMediaProps {
  formData: ProductFormData;
  media: {
    imageUrl: string;
    setImageUrl: (url: string) => void;
    imageAlt: string;
    setImageAlt: (alt: string) => void;
    addImage: () => void;
    removeImage: (index: number) => void;
    setPrimaryImage: (index: number) => void;
  };
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  formData,
  media,
}) => {
  const {
    imageUrl,
    setImageUrl,
    imageAlt,
    setImageAlt,
    addImage,
    removeImage,
    setPrimaryImage,
  } = media;

  const handleUploadComplete = (imageData: any) => {
    setImageUrl(imageData.url);
    // Auto-add image after upload
    setTimeout(() => addImage(), 100);
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-yellow-500" />
        Product Images <span className="text-red-500">*</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL or upload below..."
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
        </div>
        
        <div className="md:col-span-1">
          <ImageUploader
            onUpload={handleUploadComplete}
            folder="products"
          />
        </div>
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
          <p className="text-sm text-gray-600 mt-1">
            Upload images using the uploader above or add image URLs
          </p>
        </div>
      )}
    </div>
  );
};