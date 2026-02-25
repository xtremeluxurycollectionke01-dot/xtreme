import React from "react";
import { Layers, Hash, Ruler, X, Plus } from "lucide-react";
import { Input } from "./input";
import { Select } from "./select";
import { SIZE_SYSTEMS, CONDITION_OPTIONS } from "./product.constants";
import { ProductFormData, SizeSystemKey } from "./product.types";

interface ProductInventoryProps {
  formData: ProductFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inventory: {
    selectedSizeSystem: SizeSystemKey;
    setSelectedSizeSystem: (system: SizeSystemKey) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    sizeStock: string;
    setSizeStock: (stock: string) => void;
    addSize: () => void;
    removeSize: (size: string, system: string) => void;
    updateSizeStock: (size: string, system: string, newStock: number) => void;
    getTotalStock: () => number;
  };
}

export const ProductInventory: React.FC<ProductInventoryProps> = ({
  formData,
  onChange,
  inventory,
}) => {
  const {
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
  } = inventory;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Layers className="h-5 w-5 text-yellow-500" />
        Inventory Management
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={onChange}
          required
          placeholder="NIKE-AM270-BLK-001"
          icon={Hash}
        />
        <Select
          label="Condition"
          name="condition"
          value={formData.condition}
          onChange={onChange}
          options={CONDITION_OPTIONS}
        />
      </div>

      {/* Size Inventory */}
      <div className="border border-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Ruler className="h-5 w-5 text-yellow-500" />
          Size Inventory <span className="text-red-500">*</span>
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={selectedSizeSystem}
            onChange={(e) => setSelectedSizeSystem(e.target.value as SizeSystemKey)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          >
            {(Object.keys(SIZE_SYSTEMS) as SizeSystemKey[]).map((sys) => (
              <option key={sys} value={sys}>
                {SIZE_SYSTEMS[sys].label}
              </option>
            ))}
          </select>
          
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          >
            <option value="">Select size</option>
            {SIZE_SYSTEMS[selectedSizeSystem].sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          
          <input
            type="number"
            value={sizeStock}
            onChange={(e) => setSizeStock(e.target.value)}
            min="1"
            className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
            placeholder="Qty"
          />
          
          <button
            type="button"
            onClick={addSize}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {formData.sizes.length > 0 ? (
          <div className="space-y-2">
            {formData.sizes.map((size, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{size.system} {size.size}</span>
                  <span className="text-gray-500">→</span>
                  <input
                    type="number"
                    value={size.stock}
                    onChange={(e) => updateSizeStock(size.size, size.system, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-center"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">in stock</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSize(size.size, size.system)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-800 mt-2">
              <p className="text-sm text-gray-400">
                Total Stock: <span className="text-yellow-500 font-bold">
                  {getTotalStock()}
                </span> units
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No sizes added yet. Add sizes to track inventory.</p>
        )}
      </div>
    </div>
  );
};