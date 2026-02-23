/*import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  created_at: Date;
  category_id?: number;
  subcategory_id?: number;
  brand_id?: number;
}

const ProductSchema: Schema<IProduct> = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  stock: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  category_id: { type: Number },
  subcategory_id: { type: Number },
  brand_id: { type: Number },
});

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;*/

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  sku: string;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
