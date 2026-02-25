import React from "react";
import Image from "next/image";
import { Package, CheckCircle } from "lucide-react";
import { ProductFormData } from "./product.types";

interface ProductPreviewProps {
  formData: ProductFormData;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ formData }) => {
  const primaryImage = formData.images.find(img => img.isPrimary) || formData.images[0];
  const totalStock = formData.sizes.reduce((sum, s) => sum + s.stock, 0);
  const hasSale = formData.comparePrice && parseFloat(formData.comparePrice) > parseFloat(formData.price || "0");

  return (
    <div className="sticky top-6 space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Product Preview</h3>
        
        {formData.images.length > 0 ? (
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-800">
            <Image
              src={primaryImage.url}
              alt={formData.name || "Product preview"}
              fill
              className="object-cover"
            />
            {hasSale && (
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
          <p className="text-gray-400 text-sm line-clamp-2">
            {formData.shortDescription || formData.description || "No description"}
          </p>
          
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xl font-bold text-yellow-500">
              KSh {formData.price || "0.00"}
            </span>
            {hasSale && (
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
              <span>{totalStock} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sizes:</span>
              <span>{formData.sizes.length} options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
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
  );
};