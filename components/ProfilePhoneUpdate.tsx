// components/ProfilePhoneUpdate.tsx
"use client";

import { useState } from "react";
import { Phone, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePhoneUpdate() {
  const { user, updateUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update phone number");
      }

      updateUser({ phone: result.data.phone });
      setMessage({ type: "success", text: "Phone number updated successfully!" });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">WhatsApp Number</h3>
      <p className="text-gray-400 text-sm mb-4">
        Add your WhatsApp number to receive password reset links and order updates.
      </p>
      
      <form onSubmit={handleUpdatePhone} className="space-y-4">
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
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="0712345678 or +254712345678"
            />
          </div>
        </div>

        {message && (
          <div className={`flex items-center gap-2 text-sm ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save WhatsApp Number
        </button>
      </form>
    </div>
  );
}