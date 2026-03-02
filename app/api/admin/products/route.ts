/*import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await requireAdmin(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const productData = await request.json();

    await dbConnect();

    // Validate category ID format
    if (!/^[0-9a-fA-F]{24}$/.test(productData.category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID format" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Validate and transform sizes
    if (productData.sizes) {
      productData.sizes = productData.sizes.map((size: any) => ({
        size: String(size.size),
        system: size.system,
        stock: Number(size.stock) || 0,
      }));
    }

    // Validate and transform colors
    if (productData.colors) {
      productData.colors = productData.colors.map((color: any) => ({
        name: color.name,
        hex: color.hex,
      }));
    }

    // Validate and transform images
    if (productData.images) {
      productData.images = productData.images.map((img: any) => ({
        url: img.url,
        alt: img.alt || "",
        isPrimary: Boolean(img.isPrimary),
      }));

      // Ensure only one primary image
      const hasPrimary = productData.images.some((img: any) => img.isPrimary);
      if (!hasPrimary && productData.images.length > 0) {
        productData.images[0].isPrimary = true;
      }
    }

    console.log("Creating product with data:", JSON.stringify(productData, null, 2));

    const product = await Product.create(productData);

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}*/


/*import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import "@/models/Category"; 

export async function POST(request: Request) {
  try {
    const user = await requireAdmin(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const productData = await request.json();

    await dbConnect();

    // Validate category ID format
    if (!/^[0-9a-fA-F]{24}$/.test(productData.category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID format" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Validate and transform sizes
    if (productData.sizes) {
      productData.sizes = productData.sizes.map((size: any) => ({
        size: String(size.size),
        system: size.system,
        stock: Number(size.stock) || 0,
      }));
    }

    // Validate and transform colors
    if (productData.colors) {
      productData.colors = productData.colors.map((color: any) => ({
        name: color.name,
        hex: color.hex,
      }));
    }

    // Validate and transform images
    if (productData.images) {
      productData.images = productData.images.map((img: any) => ({
        url: img.url,
        alt: img.alt || "",
        isPrimary: Boolean(img.isPrimary),
        // Add Cloudinary fields if available
        ...(img.publicId && { publicId: img.publicId }),
        ...(img.width && { width: img.width }),
        ...(img.height && { height: img.height }),
        ...(img.format && { format: img.format }),
      }));

      // Ensure only one primary image
      const hasPrimary = productData.images.some((img: any) => img.isPrimary);
      if (!hasPrimary && productData.images.length > 0) {
        productData.images[0].isPrimary = true;
      }
    }

    // Calculate total stock
    productData.stock = productData.sizes?.reduce((sum: number, size: any) => sum + size.stock, 0) || 0;

    console.log("Creating product with data:", JSON.stringify(productData, null, 2));

    const product = await Product.create(productData);

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import "@/models/Category";

// GET /api/admin/products - List all products with pagination and search
export async function GET(request: NextRequest) {
  try {
    // Check admin auth
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to DB
    await dbConnect();

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // optional filter
    const category = searchParams.get("category"); // optional filter

    // Build query
    const query: any = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status (active/inactive)
    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      //products,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.sku || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate SKU
    const existingProduct = await Product.findOne({ sku: body.sku });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "SKU already exists" },
        { status: 409 }
      );
    }

    const product = await Product.create(body);
    await product.populate("category");

    return NextResponse.json(
      { success: true, product, message: "Product created successfully" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}