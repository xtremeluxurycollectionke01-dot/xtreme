// components/checkout/MpesaPayment.tsx
import { motion } from "framer-motion";
import { Smartphone, Copy, Check, Info } from "lucide-react";
import { useState } from "react";

interface MpesaPaymentProps {
  transactionCode: string;
  totalAmount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mpesaNumber: string;
}

export function MpesaPayment({ 
  transactionCode, 
  totalAmount, 
  onChange, 
  mpesaNumber 
}: MpesaPaymentProps) {
  const [copied, setCopied] = useState(false);

  const copyMpesaNumber = () => {
    navigator.clipboard.writeText(mpesaNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg p-6 mb-4"
    >
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Smartphone className="h-5 w-5 text-green-500" />
        M-Pesa Payment Instructions
      </h3>

      <div className="space-y-4">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-300 mb-2">1. Go to M-Pesa on your phone</p>
          <p className="text-sm text-gray-300 mb-2">2. Select <span className="text-yellow-500 font-semibold">Send Money</span></p>
          <p className="text-sm text-gray-300">3. Enter Amount: <span className="text-yellow-500 font-semibold">KSh {totalAmount.toLocaleString()}</span></p>
        </div>

        <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <div>
            <p className="text-xs text-gray-400 mb-1">Send money to this number:</p>
            <p className="text-xl font-bold text-yellow-500">{mpesaNumber}</p>
          </div>
          <button
            type="button"
            onClick={copyMpesaNumber}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex gap-2">
            <Info className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              After sending the money via M-Pesa, you'll receive a confirmation SMS with a transaction code. Enter that code below.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            M-Pesa Transaction Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="mpesaTransactionCode"
            value={transactionCode}
            onChange={onChange}
            required
            placeholder="e.g., QWE1234RT5"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the transaction code from your M-Pesa confirmation SMS
          </p>
        </div>
      </div>
    </motion.div>
  );
}