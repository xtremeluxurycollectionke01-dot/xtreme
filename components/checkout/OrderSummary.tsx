// components/checkout/OrderSummary.tsx
import Image from "next/image";
import { Truck, Shield } from "lucide-react";

// Define CartItem type locally to avoid import issues
interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images?: Array<{
      url: string;
      alt?: string;
    }>;
    price: number;
  };
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
}

export function OrderSummary({ items, totalAmount }: OrderSummaryProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-6">Your Order</h2>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => {
          const imageUrl = item.product.images?.[0]?.url || null;
          return (
            <div key={item._id} className="flex gap-3">
              <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.product.images?.[0]?.alt || item.product.name}
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
          <span className="font-bold">KSh {totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Shipping</span>
          <span className="text-green-500">Free</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-800">
          <span>Total</span>
          <span className="text-yellow-500">
            KSh {totalAmount.toLocaleString()}
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
  );
}