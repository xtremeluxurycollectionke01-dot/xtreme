import mongoose, { Schema, Document, Model } from "mongoose";

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

export default Product;
