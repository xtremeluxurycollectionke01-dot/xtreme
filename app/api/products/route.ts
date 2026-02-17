/*import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({}).sort({ created_at: -1 });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}*/

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  console.log("📦 [GET /api/products] Request received");

  try {
    // Connect to DB
    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    // Fetch products
    const products = await Product.find({}).sort({ created_at: -1 });

    console.log(`✅ Products fetched successfully. Count: ${products.length}`);

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        data: products,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching products:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
