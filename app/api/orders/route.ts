/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAuth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

// GET /api/orders/[orderId] - Get single order details
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await context.params;

    await dbConnect();

    const order = await Order.findById(orderId)
      .populate("items.product", "name images price sku")
      .populate("user", "name email");

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH /api/orders/[orderId] - Update order status (admin only)
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update order status
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { orderId } = await context.params;
    const updates = await request.json();

    await dbConnect();

    const order = await Order.findByIdAndUpdate(orderId, { $set: updates }, { new: true })
      .populate("user", "name email");

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Order updated successfully", order },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update order" }, { status: 500 });
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAuth } from "@/lib/auth";

// GET /api/orders/[orderId]
export async function GET(
  request: NextRequest,
  context: { params: { orderId: string } }  // ✅ just plain object
) {
  try {
    const user = await requireAuth(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { orderId } = context.params;  // ✅ now TypeScript knows orderId exists

    await dbConnect();

    const order = await Order.findById(orderId)
      .populate("items.product", "name images price sku")
      .populate("user", "name email");

    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    if (order.user._id.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH /api/orders/[orderId]
export async function PATCH(
  request: NextRequest,
  context: { params: { orderId: string } }  // ✅ plain object
) {
  try {
    const user = await requireAuth(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { orderId } = context.params;
    const updates = await request.json();

    await dbConnect();

    const order = await Order.findByIdAndUpdate(orderId, { $set: updates }, { new: true }).populate("user", "name email");

    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Order updated successfully", order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update order" }, { status: 500 });
  }
}