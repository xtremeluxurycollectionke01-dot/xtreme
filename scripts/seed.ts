import dbConnect from "../lib/mongodb";
import Product from "../models/Product";
import products from "../products.json";

async function seed() {
  try {
    await dbConnect();

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("Products inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
