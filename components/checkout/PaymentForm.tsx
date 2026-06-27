// components/checkout/PaymentForm.tsx
import { motion } from "framer-motion";
import { CreditCard, Truck } from "lucide-react";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { ContactInfoForm } from "./ContactInfoForm";
import { MpesaPayment } from "./MpesaPayment";
import { CardPayment } from "./CardPayment";
//import { PaymentMethodSelector } from "./PaymentMethodSelector";
//import { ContactInfoForm } from "./ContactInfoForm";
//import { MpesaPayment } from "./MpesaPayment";
//import { CardPayment } from "./CardPayment";

interface PaymentFormProps {
  paymentMethod: "mpesa" | "card" | "cash";
  formData: {
    email: string;
    phone: string;
    mpesaTransactionCode: string;
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
  };
  totalAmount: number;
  mpesaNumber: string;
  onPaymentMethodChange: (method: "mpesa" | "card" | "cash") => void;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function PaymentForm({
  paymentMethod,
  formData,
  totalAmount,
  mpesaNumber,
  onPaymentMethodChange,
  onFormChange,
  onBack,
  onNext,
}: PaymentFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-yellow-500" />
        Payment Information
      </h2>

      <PaymentMethodSelector
        paymentMethod={paymentMethod}
        onSelect={onPaymentMethodChange}
      />

      <ContactInfoForm
        email={formData.email}
        phone={formData.phone}
        onChange={onFormChange}
      />

      {paymentMethod === "mpesa" && (
        <MpesaPayment
          transactionCode={formData.mpesaTransactionCode}
          totalAmount={totalAmount}
          onChange={onFormChange}
          mpesaNumber={mpesaNumber}
        />
      )}

      {paymentMethod === "card" && (
        <CardPayment
          formData={{
            cardNumber: formData.cardNumber,
            cardName: formData.cardName,
            expiry: formData.expiry,
            cvv: formData.cvv,
          }}
          onChange={onFormChange}
        />
      )}

      {paymentMethod === "cash" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-lg p-6 mb-4"
        >
          <div className="flex gap-3">
            <Truck className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Cash on Delivery</h3>
              <p className="text-sm text-gray-400">
                Pay with cash when your order is delivered. Please have the exact amount ready.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-yellow-500 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Review Order
        </button>
      </div>
    </motion.div>
  );
}