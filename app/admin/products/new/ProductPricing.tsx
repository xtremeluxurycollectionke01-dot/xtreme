import React from "react";
import { DollarSign } from "lucide-react";
import { Input } from "./input";
import { ProductFormData } from "./product.types";

interface ProductPricingProps {
  formData: ProductFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  calculateProfit: () => number;
  calculateMargin: () => string;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({
  formData,
  onChange,
  calculateProfit,
  calculateMargin,
}) => {
  const profit = calculateProfit();
  const margin = calculateMargin();

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-yellow-500" />
        Pricing Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Price (KSh)"
          name="price"
          type="number"
          value={formData.price}
          onChange={onChange}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
          icon={DollarSign}
        />
        <div>
          <Input
            label="Compare at Price"
            name="comparePrice"
            type="number"
            value={formData.comparePrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            icon={DollarSign}
          />
          <p className="text-xs text-gray-500 mt-1">Original price for comparison</p>
        </div>
        <div>
          <Input
            label="Cost per Item"
            name="costPerItem"
            type="number"
            value={formData.costPerItem}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            icon={DollarSign}
          />
          <p className="text-xs text-gray-500 mt-1">For profit calculation</p>
        </div>
      </div>

      {formData.price && formData.costPerItem && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Profit Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Profit per Item</p>
              <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                KSh {profit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Profit Margin</p>
              <p className={`text-lg font-bold ${parseFloat(margin) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {margin}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};