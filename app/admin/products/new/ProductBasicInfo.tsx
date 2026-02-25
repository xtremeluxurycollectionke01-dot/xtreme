/*import React from "react";
import { Package } from "lucide-react";
import { Input } from "./input";
import { TextArea } from "./TextArea";
import { Select } from "./select";
import { SHOE_BRANDS, GENDER_OPTIONS } from "./product.constants";
import { ProductFormData } from "./product.types";

interface ProductBasicInfoProps {
  formData: ProductFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ formData, onChange }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Package className="h-5 w-5 text-yellow-500" />
        Basic Information
      </h2>

      <div className="space-y-4">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          placeholder="e.g., Nike Air Max 270"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={onChange}
            placeholder="nike-air-max-270"
          />
          <Input
            label="Style Code"
            name="styleCode"
            value={formData.styleCode}
            onChange={onChange}
            placeholder="e.g., AH8050-002"
          />
        </div>

        <TextArea
          label="Short Description"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={onChange}
          maxLength={160}
          placeholder="Brief description for product cards (max 160 chars)"
        />

        <TextArea
          label="Full Description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={6}
          placeholder="Detailed product description..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            required
            options={[
              { value: "", label: "Select brand" },
              ...SHOE_BRANDS.map(brand => ({ value: brand, label: brand }))
            ]}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            options={GENDER_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Release Date"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={onChange}
          />
          <Input
            label="Material"
            name="material"
            value={formData.material}
            onChange={onChange}
            placeholder="e.g., Leather, Mesh, Synthetic"
          />
        </div>
      </div>
    </div>
  );
};*/

import React from "react";
import { Package } from "lucide-react";
import { Input } from "./input";
import { TextArea } from "./TextArea";
import { Select } from "./select";
import { GENDER_OPTIONS } from "./product.constants";
import { ProductFormData, Category } from "./product.types";

interface ProductBasicInfoProps {
  formData: ProductFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  brands: string[];
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ 
  formData, 
  onChange,
  brands 
}) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Package className="h-5 w-5 text-yellow-500" />
        Basic Information
      </h2>

      <div className="space-y-4">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          placeholder="e.g., Nike Air Max 270"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={onChange}
            placeholder="nike-air-max-270"
          />
          <Input
            label="Style Code"
            name="styleCode"
            value={formData.styleCode}
            onChange={onChange}
            placeholder="e.g., AH8050-002"
          />
        </div>

        <TextArea
          label="Short Description"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={onChange}
          maxLength={160}
          placeholder="Brief description for product cards (max 160 chars)"
        />

        <TextArea
          label="Full Description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={6}
          placeholder="Detailed product description..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            required
            options={[
              { value: "", label: "Select brand" },
              ...brands.map(brand => ({ value: brand, label: brand }))
            ]}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            options={GENDER_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Release Date"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={onChange}
          />
          <Input
            label="Material"
            name="material"
            value={formData.material}
            onChange={onChange}
            placeholder="e.g., Leather, Mesh, Synthetic"
          />
        </div>
      </div>
    </div>
  );
};