/*import React from "react";
import { Palette, CheckCircle, X, Tag } from "lucide-react";
import { SHOE_COLORS, CATEGORIES } from "./product.constants";
import { ProductFormData, Category } from "./product.types";

interface ProductAttributesProps {
  formData: ProductFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  colors: {
    addColor: (name: string, hex: string) => void;
    removeColor: (name: string) => void;
  };
  tags: {
    tagInput: string;
    setTagInput: (input: string) => void;
    addTag: () => void;
    removeTag: (tag: string) => void;
  };
  categories: Category[];
}

export const ProductAttributes: React.FC<ProductAttributesProps> = ({
  formData,
  onChange,
  colors,
  tags,
  categories,
}) => {
  const selectedCategory = categories.find(c => c._id === formData.category);

  return (
    <div className="space-y-6">
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
              onClick={() => colors.addColor(color.name, color.hex)}
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
                  onClick={() => colors.removeColor(color.name)}
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
              onChange={onChange}
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
              onChange={onChange}
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
              value={tags.tagInput}
              onChange={(e) => tags.setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), tags.addTag())}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
            <button
              type="button"
              onClick={tags.addTag}
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
                  onClick={() => tags.removeTag(tag)}
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
              onChange={onChange}
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
              onChange={onChange}
              className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
            />
            <div>
              <span className="text-gray-300 font-medium">Active</span>
              <p className="text-sm text-gray-500">Product is visible and available for purchase</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};*/

import React from "react";
import { Palette, CheckCircle, X, Tag } from "lucide-react";
import { SHOE_COLORS } from "./product.constants";
import { ProductFormData, Category } from "./product.types";

interface ProductAttributesProps {
  formData: ProductFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  colors: {
    addColor: (name: string, hex: string) => void;
    removeColor: (name: string) => void;
  };
  tags: {
    tagInput: string;
    setTagInput: (input: string) => void;
    addTag: () => void;
    removeTag: (tag: string) => void;
  };
  categories: Category[];
}

export const ProductAttributes: React.FC<ProductAttributesProps> = ({
  formData,
  onChange,
  colors,
  tags,
  categories,
}) => {
  const selectedCategory = categories.find(c => c._id === formData.category);

  return (
    <div className="space-y-6">
      {/* Colors */}
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
              onClick={() => colors.addColor(color.name, color.hex)}
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
                  onClick={() => colors.removeColor(color.name)}
                  className="hover:text-red-500 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
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
              onChange={onChange}
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
              onChange={onChange}
              disabled={!selectedCategory}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white disabled:opacity-50"
            >
              <option value="">
                {selectedCategory ? "Select subcategory" : "Select category first"}
              </option>
              {selectedCategory?.subcategories?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tags.tagInput}
              onChange={(e) => tags.setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), tags.addTag())}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
            <button
              type="button"
              onClick={tags.addTag}
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
                  onClick={() => tags.removeTag(tag)}
                  className="hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Product Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={onChange}
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
              onChange={onChange}
              className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
            />
            <div>
              <span className="text-gray-300 font-medium">Active</span>
              <p className="text-sm text-gray-500">Product is visible and available for purchase</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};