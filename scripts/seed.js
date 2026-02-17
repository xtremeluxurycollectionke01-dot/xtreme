import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "../products.json" assert { type: "json" };

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    const ProductSchema = new mongoose.Schema({
      id: Number,
      name: String,
      description: String,
      price: Number,
      image: String,
      stock: Number,
      created_at: Date,
      category_id: Number,
      subcategory_id: Number,
      brand_id: Number,
    });

    const Product =
      mongoose.models.Product ||
      mongoose.model("Product", ProductSchema);

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
