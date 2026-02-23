import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products/[productId] - Get single product
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params; // <- important
  await dbConnect();
  const product = await Product.findById(productId)
    .populate("category", "name slug")
    .populate("subcategory", "name slug");

  if (!product)
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: product }, { status: 200 });
}

// PUT / PATCH / DELETE all follow the same pattern:
export async function PUT(
  request: NextRequest,
  context: { params: { productId: string } }
) {
  const { productId } = context.params;
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

export async function PATCH(
  request: NextRequest,
  context: { params: { productId: string } }
) {
  return PUT(request, context); // same logic as PUT for partial updates
}

export async function DELETE(
  request: NextRequest,
  context: { params: { productId: string } }
) {
  const { productId } = context.params;
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product deleted successfully", data: { id: productId } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}