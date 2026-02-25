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

/*import mongoose, { Schema, Document, Model } from "mongoose";

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
export default Product;*/




/*import mongoose, { Schema, Document, Model } from "mongoose";

// Define size schema
export interface IProductSize {
  size: string;
  system: "US" | "UK" | "EU";
  stock: number;
}

// Define color schema
export interface IProductColor {
  name: string;
  hex: string;
  images?: string[]; // Optional color-specific images
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: {
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }[];
  stock: number;
  sku: string;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  brand?: string;
  sizes: IProductSize[];
  colors: IProductColor[];
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Size sub-schema
const ProductSizeSchema = new Schema({
  size: { type: String, required: true },
  system: { type: String, enum: ["US", "UK", "EU"], required: true },
  stock: { type: Number, default: 0, min: 0 },
});

// Color sub-schema
const ProductColorSchema = new Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true, match: /^#[0-9A-Fa-f]{6}$/ },
  images: [{ type: String }],
});

// Image sub-schema
const ProductImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String },
  isPrimary: { type: Boolean, default: false },
});

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    images: [ProductImageSchema],
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String },
    sizes: [ProductSizeSchema],
    colors: [ProductColorSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total stock across sizes
ProductSchema.virtual("totalStock").get(function() {
  if (this.sizes && this.sizes.length > 0) {
    return this.sizes.reduce((total, size) => total + size.stock, 0);
  }
  return this.stock;
});

// Create slug from name before saving
ProductSchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;*/



import mongoose, { Schema, Document, Model } from "mongoose";

// Define size schema
export interface IProductSize {
  size: string;
  system: "US" | "UK" | "EU";
  stock: number;
}

// Define color schema
export interface IProductColor {
  name: string;
  hex: string;
  images?: string[]; // Optional color-specific images
}

// Define image schema with Cloudinary fields
export interface IProductImage {
  url: string;
  publicId: string;
  alt?: string;
  isPrimary?: boolean;
  width?: number;
  height?: number;
  format?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  costPerItem?: number;
  images: IProductImage[];
  stock: number;
  sku: string;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  brand?: string;
  gender: string;
  sizes: IProductSize[];
  colors: IProductColor[];
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  weight?: number;
  material?: string;
  styleCode?: string;
  releaseDate?: Date;
  condition: string;
  createdAt: Date;
  updatedAt: Date;
  totalStock: number;
}

// Image sub-schema with Cloudinary fields
const ProductImageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: false },
  alt: { type: String },
  isPrimary: { type: Boolean, default: false },
  width: { type: Number },
  height: { type: Number },
  format: { type: String },
});

// Size sub-schema
const ProductSizeSchema = new Schema({
  size: { type: String, required: true },
  system: { type: String, enum: ["US", "UK", "EU", "CM"], required: true },
  stock: { type: Number, default: 0, min: 0 },
});

// Color sub-schema
const ProductColorSchema = new Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  images: [{ type: String }],
});

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, maxlength: 160 },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    costPerItem: { type: Number, min: 0 },
    images: [ProductImageSchema],
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: String },
    brand: { type: String },
    gender: { 
      type: String, 
      enum: ["unisex", "men", "women", "kids"],
      default: "unisex"
    },
    sizes: [ProductSizeSchema],
    colors: [ProductColorSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    weight: { type: Number, min: 0 },
    material: { type: String },
    styleCode: { type: String },
    releaseDate: { type: Date },
    condition: { 
      type: String, 
      enum: ["new", "used", "refurbished"],
      default: "new"
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total stock across sizes
ProductSchema.virtual("totalStock").get(function() {
  if (this.sizes && this.sizes.length > 0) {
    return this.sizes.reduce((total, size) => total + size.stock, 0);
  }
  return this.stock;
});

// Ensure only one primary image
ProductSchema.pre("save", function(next) {
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }

});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;