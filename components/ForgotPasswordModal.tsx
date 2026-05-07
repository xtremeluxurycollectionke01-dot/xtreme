// components/ForgotPasswordModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Send, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "phone" | "success">("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [hasPhone, setHasPhone] = useState(false);

  // Step 1: Verify email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, step: 1 }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to verify email");
      }

      if (result.success) {
        setUserId(result.data.userId);
        setHasPhone(result.data.hasPhone);
        
        if (result.data.hasPhone) {
          // User has phone, move to phone verification step
          setStep("phone");
        } else {
          // User doesn't have phone, move to add phone step
          setStep("phone");
          setError("No phone number found. Please add your WhatsApp number to continue.");
        }
      } else {
        setError(result.error);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send reset link via WhatsApp
  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          phoneNumber, 
          step: 2,
          userId 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send reset link");
      }

      if (result.success && result.data?.whatsappUrl) {
        setWhatsappUrl(result.data.whatsappUrl);
        setStep("success");
        
        // Automatically open WhatsApp after a short delay
        setTimeout(() => {
          window.open(result.data.whatsappUrl, '_blank');
        }, 500);
      } else {
        setError(result.error || "Failed to generate reset link");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setPhoneNumber("");
    setUserId("");
    setError(null);
    setWhatsappUrl(null);
    onClose();
  };

  const handleBack = () => {
    setStep("email");
    setError(null);
    setPhoneNumber("");
  };

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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  {step !== "email" && (
                    <button
                      onClick={handleBack}
                      className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </button>
                  )}
                  <h2 className="text-xl font-bold text-white">
                    {step === "email" && "Reset Password"}
                    {step === "phone" && (hasPhone ? "Verify WhatsApp" : "Add WhatsApp Number")}
                    {step === "success" && "Check Your WhatsApp"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === "email" && (
                  <form onSubmit={handleVerifyEmail} className="space-y-6">
                    <div className="text-center mb-6">
                      <p className="text-gray-400 text-sm">
                        Enter your email address to reset your password.
                        We'll send a reset link to your WhatsApp.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-500 text-sm">{error}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Continue
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {step === "phone" && (
                  <form onSubmit={handleSendResetLink} className="space-y-6">
                    <div className="text-center mb-6">
                      <p className="text-gray-400 text-sm">
                        {hasPhone 
                          ? "Enter your WhatsApp number to receive the reset link."
                          : "No phone number found. Please add your WhatsApp number to receive password reset links via WhatsApp."}
                      </p>
                    </div>

                    {error && (
                      <div className={`rounded-lg p-3 flex items-center gap-2 ${
                        error.includes("No phone number found")
                          ? "bg-yellow-500/10 border border-yellow-500/50"
                          : "bg-red-500/10 border border-red-500/50"
                      }`}>
                        <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                          error.includes("No phone number found")
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`} />
                        <p className={`text-sm ${
                          error.includes("No phone number found")
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}>
                          {error}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        WhatsApp Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          placeholder="0712345678 or +254712345678"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Include country code (e.g., 254 for Kenya)
                      </p>
                    </div>

                    {!hasPhone && (
                      <div className="bg-blue-500/10 rounded-lg p-3">
                        <p className="text-blue-400 text-xs">
                          ℹ️ This number will be saved to your account for future password resets.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Generating Link...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Reset Link via WhatsApp
                        </>
                      )}
                    </button>
                  </form>
                )}

                {step === "success" && (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        WhatsApp Message Ready
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Click the button below to open WhatsApp and send yourself the reset link.
                      </p>
                    </div>

                    <div className="bg-yellow-500/10 rounded-lg p-4">
                      <p className="text-yellow-400 text-sm font-medium">
                        💡 Tip: The message will be pre-filled. Just tap Send!
                      </p>
                    </div>

                    <button
                      onClick={handleOpenWhatsApp}
                      className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      Open WhatsApp
                    </button>

                    <button
                      onClick={handleOpenWhatsApp}
                      className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      Didn't open automatically? Click here
                    </button>

                    <p className="text-xs text-gray-500">
                      After sending the message, check your WhatsApp for the reset link.
                      The link will expire in 1 hour.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}