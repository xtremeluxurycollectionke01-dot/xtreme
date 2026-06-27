// components/checkout/CardPayment.tsx
import { motion } from "framer-motion";

interface CardPaymentProps {
  formData: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CardPayment({ formData, onChange }: CardPaymentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Card Number
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={onChange}
          placeholder="**** **** **** ****"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expiry (MM/YY)
          </label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={onChange}
            placeholder="MM/YY"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            CVV
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={onChange}
            placeholder="***"
            maxLength={3}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
          />
        </div>
      </div>
    </motion.div>
  );
}