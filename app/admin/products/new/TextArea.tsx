import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  required,
  maxLength,
  value = "",
  className = "",
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-gray-800 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none ${className}`}
        value={value}
        {...props}
      />
      {maxLength && (
        <p className="text-xs text-gray-500 mt-1">
          {currentLength}/{maxLength} characters
        </p>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};