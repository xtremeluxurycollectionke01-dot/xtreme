import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAuth } from "@/lib/auth";

// GET /api/orders/[orderId] - Get single order details
export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const order = await Order.findById(params.orderId)
      .populate("items.product", "name images price sku")
      .populate("user", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        order 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[orderId] - Update order status (for admin)
export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can update order status
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const updates = await request.json();

    await dbConnect();

    const order = await Order.findByIdAndUpdate(
      params.orderId,
      { $set: updates },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Order updated successfully",
        order 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
