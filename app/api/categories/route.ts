import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();
    
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 });

    return NextResponse.json(
      { 
        success: true, 
        data: categories 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}