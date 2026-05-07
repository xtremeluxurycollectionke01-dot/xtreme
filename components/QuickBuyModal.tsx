// components/QuickBuyModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, Truck, CreditCard } from "lucide-react";

interface QuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

export default function QuickBuyModal({ 
  isOpen, 
  onClose, 
  product, 
  selectedSize, 
  selectedColor, 
  quantity 
}: QuickBuyModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Contact Info
    fullName: "",
    email: "",
    phone: "",
    
    // Shipping Address
    street: "",
    city: "Nairobi",
    state: "",
    zipCode: "",
    country: "Kenya",
    
    // Payment
    paymentMethod: "mpesa" as "mpesa" | "cash",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!formData.street.trim()) return "Street address is required";
    if (!formData.city.trim()) return "City is required";
    return null;
  };

// components/QuickBuyModal.tsx - Update the handleSubmitOrder function

const handleSubmitOrder = async () => {
  const validationError = validateStep1();
  if (validationError) {
    setError(validationError);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const orderData = {
      items: [{
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      }],
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      contactInfo: {
        email: formData.email,
        phone: formData.phone,
        fullName: formData.fullName,
      },
      paymentMethod: formData.paymentMethod,
      notes: `Quick buy order for ${product.name}`,
    };

    const response = await fetch("/api/orders/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create order");
    }

    // Set order number from response
    if (result.data && result.data.order) {
      setOrderNumber(result.data.order.orderNumber);
    } else if (result.data && result.data.orderNumber) {
      setOrderNumber(result.data.orderNumber);
    }
    
    setOrderComplete(true);
    
    // If M-Pesa, you could initiate STK push here
    if (formData.paymentMethod === "mpesa" && result.data.requiresPayment) {
      await initiateMpesaPayment(result.data.order._id, formData.phone);
    }
    
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const initiateMpesaPayment = async (orderId: string, phoneNumber: string) => {
    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          phoneNumber,
          amount: product.price * quantity,
        }),
      });
      
      if (!response.ok) {
        console.error("Failed to initiate M-Pesa payment");
      }
    } catch (error) {
      console.error("Error initiating M-Pesa:", error);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOrderComplete(false);
    setOrderNumber(null);
    setError(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      street: "",
      city: "Nairobi",
      state: "",
      zipCode: "",
      country: "Kenya",
      paymentMethod: "mpesa",
    });
    onClose();
  };

  const totalAmount = product.price * quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">
                  {orderComplete ? "Order Confirmed!" : "Quick Checkout"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {orderComplete ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Thank you for your order!
                    </h3>
                    <p className="text-gray-400">
                      Your order has been placed successfully.
                    </p>
                    {orderNumber && (
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Order Number</p>
                        <p className="text-lg font-mono font-bold text-yellow-500">
                          {orderNumber}
                        </p>
                      </div>
                    )}
                    {formData.paymentMethod === "mpesa" && (
                      <div className="bg-yellow-500/10 rounded-lg p-4">
                        <p className="text-yellow-400 text-sm">
                          You will receive an M-Pesa prompt on your phone to complete payment.
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleClose}
                      className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-white">Order Summary</h3>
                      <div className="flex gap-3">
                        {product.image && (
                          <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-sm text-gray-400">
                            Quantity: {quantity}
                            {selectedSize && ` | Size: ${selectedSize}`}
                            {selectedColor && ` | Color: ${selectedColor}`}
                          </p>
                          <p className="text-yellow-500 font-bold mt-1">
                            KSh {totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-red-500 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="0712345678"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          placeholder="123 Main St"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/*<div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="Nairobi"
                          />
                        </div>*/}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            State/County
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="Nairobi"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/*<div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="00100"
                          />
                        </div>*/}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="Kenya"
                            disabled
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Payment Method *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "mpesa" }))}
                            className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                              formData.paymentMethod === "mpesa"
                                ? "border-yellow-500 bg-yellow-500/20 text-yellow-500"
                                : "border-gray-700 text-gray-400 hover:border-gray-500"
                            }`}
                          >
                            <CreditCard className="h-5 w-5" />
                            M-Pesa
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "cash" }))}
                            className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                              formData.paymentMethod === "cash"
                                ? "border-yellow-500 bg-yellow-500/20 text-yellow-500"
                                : "border-gray-700 text-gray-400 hover:border-gray-500"
                            }`}
                          >
                            <Truck className="h-5 w-5" />
                            Cash on Delivery
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!orderComplete && (
                <div className="p-6 border-t border-gray-800">
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                        Processing...
                      </>
                    ) : (
                      `Place Order • KSh ${totalAmount.toLocaleString()}`
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    By placing this order, you agree to our terms and conditions
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}