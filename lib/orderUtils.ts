// Order status helper functions
export const orderStatuses = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400",
    icon: "Clock",
    description: "Order has been placed and is waiting for processing"
  },
  processing: {
    label: "Processing",
    color: "bg-purple-500/20 text-purple-400",
    icon: "Package",
    description: "Order is being prepared for shipping"
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-500/20 text-blue-400",
    icon: "Truck",
    description: "Order has been shipped and is on its way"
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-500/20 text-green-400",
    icon: "CheckCircle",
    description: "Order has been delivered successfully"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500/20 text-red-400",
    icon: "XCircle",
    description: "Order has been cancelled"
  }
};

export const paymentStatuses = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400"
  },
  paid: {
    label: "Paid",
    color: "bg-green-500/20 text-green-400"
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/20 text-red-400"
  }
};

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function calculateOrderTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function validateOrderItems(items: Array<any>): { valid: boolean; error?: string } {
  if (!items || items.length === 0) {
    return { valid: false, error: "No items in order" };
  }

  for (const item of items) {
    if (!item.product) {
      return { valid: false, error: "Invalid product in order" };
    }
    if (!item.quantity || item.quantity < 1) {
      return { valid: false, error: "Invalid quantity" };
    }
    if (!item.price || item.price < 0) {
      return { valid: false, error: "Invalid price" };
    }
  }

  return { valid: true };
}