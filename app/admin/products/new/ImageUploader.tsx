"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  onUpload: (imageData: {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
  }) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  onRemove,
  folder = "products",
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUpload(data.data);
    } catch (err: any) {
      setError(err.message);
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-yellow-500"
          >
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="upload"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-700 hover:border-yellow-500 transition-colors flex flex-col items-center justify-center gap-2 bg-gray-800/50"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500" />
                <span className="text-sm text-gray-400">Click to upload</span>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
    </div>
  );
};