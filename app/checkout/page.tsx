/*"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Shield, AlertCircle } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Shipping Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Kenya",
    // Contact Info
    email: "",
    phone: "",
    // Payment Info (simplified for demo)
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (!loading && (!cart || cart.items.length === 0)) {
      router.push("/cart");
    }
  }, [cart, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
          totalAmount: cart.totalAmount,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: "card",
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Clear cart and redirect to success page
      await clearCart();
      router.push(`/orders/${data.order._id}/success`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header *
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/cart"
              className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-yellow-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold">
              CHECK<span className="text-yellow-500">OUT</span>
            </h1>
          </div>

          {/* Progress Steps *
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-yellow-500' : 'bg-gray-800'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-yellow-500' : 'bg-gray-800'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                3
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form *
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Shipping *
                {step === 1 && (
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
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            ZIP/Postal Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Country
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          >
                            <option value="Kenya">Kenya</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Tanzania">Tanzania</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Payment *
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
                  >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-yellow-500" />
                      Payment Information
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
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
                          onChange={handleChange}
                          required
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
                            onChange={handleChange}
                            required
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
                            onChange={handleChange}
                            required
                            placeholder="***"
                            maxLength={3}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-yellow-500 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review *
                {step === 3 && (
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
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <p className="text-gray-400 text-sm">
                          {formData.street}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}
                        </p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Contact</h3>
                        <p className="text-gray-400 text-sm">{formData.email}</p>
                        <p className="text-gray-400 text-sm">{formData.phone}</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Payment</h3>
                        <p className="text-gray-400 text-sm">
                          Card ending in {formData.cardNumber.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 py-3 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-yellow-500 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? "Processing..." : `Pay KSh ${cart.totalAmount.toLocaleString()}`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Order Summary *
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Your Order</h2>

                <div className="space-y-4 mb-6">
                  {/*{cart.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                        </p>
                        <p className="text-yellow-500 text-sm font-bold mt-1">
                          KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}*
                  {cart.items.map((item) => {
                  const imageUrl = item.product.images?.[0]?.url || null;
                  return (
                    <div key={item._id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product.images[0]?.alt || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Truck className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                        </p>
                        <p className="text-yellow-500 text-sm font-bold mt-1">
                          KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-yellow-500">
                      KSh {cart.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}*/

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  AlertCircle, 
  Smartphone,
  Copy,
  Check,
  Clock,
  Info
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [mpesaCopied, setMpesaCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "cash">("mpesa");

  const [formData, setFormData] = useState({
    // Shipping Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Kenya",
    // Contact Info
    email: "",
    phone: "",
    // M-Pesa Details
    mpesaTransactionCode: "",
    // Card Details (optional, only shown if card selected)
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const mpesaNumber = "0799 600560";

  useEffect(() => {
    if (!loading && (!cart || cart.items.length === 0)) {
      router.push("/cart");
    }
  }, [cart, loading, router]);

  const copyMpesaNumber = () => {
    navigator.clipboard.writeText(mpesaNumber.replace(/\s/g, ''));
    setMpesaCopied(true);
    setTimeout(() => setMpesaCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      // Validate required fields based on payment method
      if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
        throw new Error("Please fill in all shipping address fields");
      }

      if (!formData.email || !formData.phone) {
        throw new Error("Email and phone are required");
      }

      if (paymentMethod === "mpesa" && !formData.mpesaTransactionCode) {
        throw new Error("Please enter the M-Pesa transaction code");
      }

      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
          totalAmount: cart.totalAmount,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          email: formData.email,
          phone: formData.phone,
          paymentMethod,
          mpesaTransactionCode: paymentMethod === "mpesa" ? formData.mpesaTransactionCode : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Handle validation errors
          const errorMessages = Object.values(data.errors).join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Failed to create order");
      }

      // Clear cart and redirect to success page
      await clearCart();
      router.push(`/orders/${data.order._id}/success`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/cart"
              className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-yellow-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold">
              CHECK<span className="text-yellow-500">OUT</span>
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-yellow-500' : 'bg-gray-800'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-yellow-500' : 'bg-gray-800'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                3
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Shipping */}
                {step === 1 && (
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
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          placeholder="e.g., 123 Kenyatta Avenue"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="e.g., Nairobi"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            State/Province <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="e.g., Nairobi County"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            ZIP/Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            placeholder="e.g., 00100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          >
                            <option value="Kenya">Kenya</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Tanzania">Tanzania</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
                  >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-yellow-500" />
                      Payment Information
                    </h2>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Select Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("mpesa")}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            paymentMethod === "mpesa"
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        >
                          <Smartphone className={`h-6 w-6 mx-auto mb-2 ${
                            paymentMethod === "mpesa" ? "text-yellow-500" : "text-gray-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            paymentMethod === "mpesa" ? "text-yellow-500" : "text-gray-400"
                          }`}>M-Pesa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            paymentMethod === "card"
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        >
                          <CreditCard className={`h-6 w-6 mx-auto mb-2 ${
                            paymentMethod === "card" ? "text-yellow-500" : "text-gray-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            paymentMethod === "card" ? "text-yellow-500" : "text-gray-400"
                          }`}>Card</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cash")}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            paymentMethod === "cash"
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        >
                          <Truck className={`h-6 w-6 mx-auto mb-2 ${
                            paymentMethod === "cash" ? "text-yellow-500" : "text-gray-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            paymentMethod === "cash" ? "text-yellow-500" : "text-gray-400"
                          }`}>Cash on Delivery</span>
                        </button>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          placeholder="e.g., 0712345678"
                        />
                      </div>
                    </div>

                    {/* M-Pesa Payment Details */}
                    {paymentMethod === "mpesa" && (
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
                            {/*<p className="text-sm text-gray-300 mb-2">3. Select <span className="text-yellow-500 font-semibold">Pay Bill</span></p>
                            <p className="text-sm text-gray-300 mb-2">4. Enter Business Number: <span className="text-yellow-500 font-semibold">880100</span></p>
                            <p className="text-sm text-gray-300 mb-2">5. Enter Account Number: <span className="text-yellow-500 font-semibold">Your Phone Number</span></p>*/}
                            <p className="text-sm text-gray-300">2. Enter Amount: <span className="text-yellow-500 font-semibold">KSh {cart.totalAmount.toLocaleString()}</span></p>
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
                              {mpesaCopied ? (
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
                              value={formData.mpesaTransactionCode}
                              onChange={handleChange}
                              required={paymentMethod === "mpesa"}
                              placeholder="e.g., QWE1234RT5"
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Enter the transaction code from your M-Pesa confirmation SMS
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Card Payment Details */}
                    {paymentMethod === "card" && (
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                              onChange={handleChange}
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
                              onChange={handleChange}
                              placeholder="***"
                              maxLength={3}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Cash on Delivery Info */}
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
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 border-2 border-gray-700 text-gray-300 font-bold rounded-lg hover:border-yellow-500 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
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
                        <p className="text-gray-400 text-sm capitalize">
                          {paymentMethod === "mpesa" ? "M-Pesa" : 
                           paymentMethod === "card" ? "Credit Card" : "Cash on Delivery"}
                        </p>
                        {paymentMethod === "mpesa" && formData.mpesaTransactionCode && (
                          <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                            <p className="text-xs text-green-400">
                              Transaction Code: {formData.mpesaTransactionCode}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
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
                          `Place Order • KSh ${cart.totalAmount.toLocaleString()}`
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Your Order</h2>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.items.map((item) => {
                  const imageUrl = item.product.images?.[0]?.url || null;
                  return (
                    <div key={item._id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product.images[0]?.alt || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Truck className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                        </p>
                        <p className="text-yellow-500 text-sm font-bold mt-1">
                          KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold">KSh {cart.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-800">
                    <span>Total</span>
                    <span className="text-yellow-500">
                      KSh {cart.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure checkout powered by</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">M-Pesa</div>
                    <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Visa</div>
                    <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Mastercard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}