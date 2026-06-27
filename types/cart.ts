// types/cart.ts
export interface CartItem {
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

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}