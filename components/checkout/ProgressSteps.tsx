// components/checkout/ProgressSteps.tsx
import { motion } from "framer-motion";

interface ProgressStepsProps {
  step: number;
}

export function ProgressSteps({ step }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {[1, 2, 3].map((number, index) => (
          <div key={number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= number ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {number}
            </div>
            {index < 2 && (
              <div
                className={`w-16 h-1 ${step >= number + 1 ? 'bg-yellow-500' : 'bg-gray-800'}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}