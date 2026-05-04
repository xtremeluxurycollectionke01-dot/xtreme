import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  console.log("⭐ [GET /api/products/featured] Request received");

  try {
    // Connect to DB
    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    // Fetch only featured products, limit to 8, sort by creation date
    const products = await Product.find({ 
      isFeatured: true,
      isActive: true // Only show active products
    })
    .sort({ createdAt: -1 })
    .limit(8);

    console.log(`✅ Featured products fetched successfully. Count: ${products.length}`);

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        data: products,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching featured products:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch featured products",
      },
      { status: 500 }
    );
  }
}