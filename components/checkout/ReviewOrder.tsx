// components/checkout/ReviewOrder.tsx
import { motion } from "framer-motion";
import { Shield, Truck, Smartphone, CreditCard, AlertCircle, Clock } from "lucide-react";

interface ReviewOrderProps {
  formData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email: string;
    phone: string;
    mpesaTransactionCode: string;
  };
  paymentMethod: "mpesa" | "card" | "cash";
  totalAmount: number;
  error: string;
  processing: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReviewOrder({
  formData,
  paymentMethod,
  totalAmount,
  error,
  processing,
  onBack,
  onSubmit,
}: ReviewOrderProps) {
  const getPaymentLabel = () => {
    if (paymentMethod === "mpesa") return "M-Pesa";
    if (paymentMethod === "card") return "Credit Card";
    return "Cash on Delivery";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5 text-yellow-500" />
        Review Order
      </h2>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-500">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Truck className="h-4 w-4 text-yellow-500" />
            Shipping Address
          </h3>
          <p className="text-gray-400 text-sm">
            {formData.street}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-yellow-500" />
            Contact Information
          </h3>
          <p className="text-gray-400 text-sm">{formData.email}</p>
          <p className="text-gray-400 text-sm">{formData.phone}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-yellow-500" />
            Payment Method
          </h3>
          <p className="text-gray-400 text-sm capitalize">{getPaymentLabel()}</p>
          {paymentMethod === "mpesa" && formData.mpesaTransactionCode && (
            <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
              <p className="text-xs text-green-400">
                Transaction Code: {formData.mpesaTransactionCode}
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-yellow-500 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 animate-spin" />
                Processing...
              </span>
            ) : (
              `Place Order • KSh ${totalAmount.toLocaleString()}`
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}