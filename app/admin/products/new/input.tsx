import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  error,
  required,
  className = "",
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        )}
        <input
          className={`w-full ${
            Icon ? 'pl-10' : 'px-4'
          } pr-4 py-3 bg-gray-800 border ${
            error ? 'border-red-500' : 'border-gray-700'
          } rounded-lg focus:outline-none focus:border-yellow-500 text-white ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};