import { Category, ColorOption, SizeSystemKey, SizeSystem } from "./product.types";

export const CATEGORIES: Category[] = [
  {
    _id: "sneakers",
    name: "Sneakers",
    slug: "sneakers",
    subcategories: ["Running", "Basketball", "Lifestyle", "Skateboarding", "Training"]
  },
  {
    _id: "formal-shoes",
    name: "Formal Shoes",
    slug: "formal-shoes",
    subcategories: ["Oxfords", "Loafers", "Derby", "Monk Strap", "Dress Boots"]
  },
  {
    _id: "boots",
    name: "Boots",
    slug: "boots",
    subcategories: ["Work Boots", "Hiking Boots", "Chelsea Boots", "Combat Boots"]
  },
  {
    _id: "sandals",
    name: "Sandals & Slides",
    slug: "sandals",
    subcategories: ["Athletic Slides", "Flip Flops", "Sandals"]
  },
  {
    _id: "accessories",
    name: "Accessories",
    slug: "accessories",
    subcategories: ["Insoles", "Laces", "Cleaning Kits", "Shoe Care"]
  }
];

export const SHOE_BRANDS = [
  "Nike", "Adidas", "Puma", "New Balance", "Jordan", "Converse", 
  "Vans", "Reebok", "ASICS", "Under Armour", "Timberland", 
  "Dr. Martens", "Clarks", "Crocs", "Birkenstock", "Other"
];

export const SIZE_SYSTEMS: Record<SizeSystemKey, SizeSystem> = {
  US: { label: "US", sizes: Array.from({ length: 18 }, (_, i) => (i + 4).toString()) },
  UK: { label: "UK", sizes: Array.from({ length: 15 }, (_, i) => (i + 3).toString()) },
  EU: { label: "EU", sizes: Array.from({ length: 25 }, (_, i) => (35 + i).toString()) },
  CM: { label: "CM", sizes: Array.from({ length: 20 }, (_, i) => (22 + i * 0.5).toFixed(1)) }
};

export const SHOE_COLORS: ColorOption[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Orange", hex: "#F97316" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Brown", hex: "#92400E" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Beige", hex: "#D4C4B5" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Multi-color", hex: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)" }
];

export const GENDER_OPTIONS = [
  { value: "unisex", label: "Unisex" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" }
];

export const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" }
];