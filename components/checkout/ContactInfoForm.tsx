// components/checkout/ContactInfoForm.tsx

interface ContactInfoFormProps {
  email: string;
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactInfoForm({ email, phone, onChange }: ContactInfoFormProps) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
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
          value={phone}
          onChange={onChange}
          required
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
          placeholder="e.g., 0712345678"
        />
      </div>
    </div>
  );
}