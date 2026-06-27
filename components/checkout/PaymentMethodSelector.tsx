// components/checkout/PaymentMethodSelector.tsx
import { Smartphone, CreditCard, Truck } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: "mpesa" | "card" | "cash";
  onSelect: (method: "mpesa" | "card" | "cash") => void;
}

export function PaymentMethodSelector({ paymentMethod, onSelect }: PaymentMethodSelectorProps) {
  const methods = [
    { id: "mpesa" as const, icon: Smartphone, label: "M-Pesa" },
    { id: "card" as const, icon: CreditCard, label: "Card" },
    { id: "cash" as const, icon: Truck, label: "Cash on Delivery" },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Select Payment Method
      </label>
      <div className="grid grid-cols-3 gap-3">
        {methods.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              paymentMethod === id
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            <Icon
              className={`h-6 w-6 mx-auto mb-2 ${
                paymentMethod === id ? "text-yellow-500" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                paymentMethod === id ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}