import { NextRequest, NextResponse } from "next/server";
import {dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category"; // Import Category model to register it with Mongoose

export async function GET(request: NextRequest) {
  console.log("🔍 [GET /api/products/search] Request received");

  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : 0;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : Infinity;
    const gender = searchParams.get("gender") || "";
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build search filter
    let filter: any = {
      isActive: true,
      price: { $gte: minPrice, $lte: maxPrice }
    };

    // Text search
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { shortDescription: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
        { brand: { $regex: query, $options: "i" } }
      ];
    }

    // Category filter - handle both ID and name
    if (category) {
      // If category is a MongoDB ObjectId string
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        // If category is a name, we need to find the category ID first
        const Category = (await import("@/models/Category")).default;
        const categoryDoc = await Category.findOne({ 
          $or: [
            { slug: category.toLowerCase() },
            { name: { $regex: category, $options: "i" } }
          ]
        });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        }
      }
    }

    // Gender filter
    if (gender) {
      filter.gender = gender;
    }

    // Build sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case "price_asc":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
        sortOptions = { price: -1 };
        break;
      case "name_asc":
        sortOptions = { name: 1 };
        break;
      case "name_desc":
        sortOptions = { name: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "newest":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Execute queries - use lean() for better performance and handle population safely
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for plain JavaScript objects
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    console.log(`✅ Search completed. Found: ${totalCount} products, Returning: ${products.length}`);

    return NextResponse.json(
      {
        success: true,
        data: products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        filters: {
          query,
          category,
          minPrice,
          maxPrice,
          gender,
          sortBy
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error searching products:", error.message);
    console.error("Stack:", error.stack);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search products",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}