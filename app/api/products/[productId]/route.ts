import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products/[productId] - Get single product by ID
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  console.log(`📦 [GET /api/products/${params.productId}] Request received`);

  try {
    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    const product = await Product.findById(params.productId)
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    if (!product) {
      console.log(`❌ Product not found: ${params.productId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: "Product not found" 
        },
        { status: 404 }
      );
    }

    console.log(`✅ Product fetched successfully: ${product.name}`);

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching product:", error.message);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID format",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[productId] - Update product (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  console.log(`📦 [PUT /api/products/${params.productId}] Request received`);

  try {
    // Check authentication (you'll need to implement admin check)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Verify admin token here
    // const token = authHeader.split(" ")[1];
    // const user = await verifyAdminToken(token);

    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    const updates = await request.json();

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;

    const product = await Product.findByIdAndUpdate(
      params.productId,
      { $set: updates },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).populate("category", "name slug");

    if (!product) {
      console.log(`❌ Product not found: ${params.productId}`);
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Product updated successfully: ${product.name}`);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error updating product:", error.message);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: Object.values(error.errors).map((e: any) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (e.g., duplicate SKU)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          error: `${field} already exists. Please use a different ${field}.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[productId] - Partially update product (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  console.log(`📦 [PATCH /api/products/${params.productId}] Request received`);

  try {
    // Check authentication (you'll need to implement admin check)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    const updates = await request.json();

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.__v;

    const product = await Product.findByIdAndUpdate(
      params.productId,
      { $set: updates },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!product) {
      console.log(`❌ Product not found: ${params.productId}`);
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Product updated successfully: ${product.name}`);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error updating product:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[productId] - Delete product (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  console.log(`📦 [DELETE /api/products/${params.productId}] Request received`);

  try {
    // Check authentication (you'll need to implement admin check)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    const product = await Product.findByIdAndDelete(params.productId);

    if (!product) {
      console.log(`❌ Product not found: ${params.productId}`);
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Product deleted successfully: ${product.name}`);

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        data: { id: params.productId }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting product:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}