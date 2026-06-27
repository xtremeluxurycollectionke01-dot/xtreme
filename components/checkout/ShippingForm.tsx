// components/checkout/ShippingForm.tsx
import { Truck } from "lucide-react";
import { motion } from "framer-motion";

interface ShippingFormProps {
  formData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
}

export function ShippingForm({ formData, onChange, onNext }: ShippingFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Truck className="h-5 w-5 text-yellow-500" />
        Shipping Address
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={onChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            placeholder="e.g., 123 Kenyatta Avenue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            placeholder="e.g., Nairobi"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              State/Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              placeholder="e.g., Nairobi County"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              placeholder="e.g., 00100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={onChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
          >
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
      >
        Continue to Payment
      </button>
    </motion.div>
  );
}