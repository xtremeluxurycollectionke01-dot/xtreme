export type SizeSystemKey = "US" | "UK" | "EU" | "CM";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: string[];
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  comparePrice: string;
  costPerItem: string;
  sku: string;
  stock: string;
  category: string;
  subcategory: string;
  brand: string;
  gender: string;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  sizes: Array<{size: string; system: string; stock: number}>;
  colors: Array<{name: string; hex: string}>;
  images: Array<{url: string; alt: string; isPrimary: boolean}>;
  weight: string;
  material: string;
  styleCode: string;
  releaseDate: string;
  condition: string;
}

export interface SizeSystem {
  label: string;
  sizes: string[];
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export type ActiveTab = 'basic' | 'pricing' | 'inventory' | 'media' | 'attributes';