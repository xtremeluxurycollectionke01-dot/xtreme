/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products/[productId]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params; // await params
  console.log(`📦 [GET /api/products/${productId}] Request received`);

  try {
    await dbConnect();

    const product = await Product.findById(productId)
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[productId]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params; // await params
  try {
    await dbConnect();
    const updates = await request.json();
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;

    const product = await Product.findByIdAndUpdate(productId, { $set: updates }, { new: true, runValidators: true });

    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product, message: "Product updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

// PATCH /api/products/[productId]
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  return PUT(request, context); // same logic as PUT
}

// DELETE /api/products/[productId]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params; // await params
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product deleted successfully", data: { id: productId } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category"; // Import to ensure Category model is registered

// GET /api/products/[productId]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  console.log(`📦 [GET /api/products/${productId}] Request received`);

  try {
    await dbConnect();

    const product = await Product.findById(productId)
      .populate("category", "name slug");
      // REMOVED: .populate("subcategory", "name slug") 
      // Reason: subcategory is defined as String in schema, not ObjectId

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Error fetching product:", error);
    
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 });
    }
    
    if (error.name === "MissingSchemaError") {
      return NextResponse.json({ success: false, error: "Database model not found" }, { status: 500 });
    }
    
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[productId]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  try {
    await dbConnect();
    const updates = await request.json();
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;

    const product = await Product.findByIdAndUpdate(
      productId, 
      { $set: updates }, 
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product, message: "Product updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Error updating product:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update product" }, { status: 500 });
  }
}

// PATCH /api/products/[productId]
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  return PUT(request, context);
}

// DELETE /api/products/[productId]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product deleted successfully", data: { id: productId } }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Error deleting product:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete product" }, { status: 500 });
  }
}