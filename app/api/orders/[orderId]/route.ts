import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    await dbConnect();

    const order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("items.product");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;
    const updates = await request.json();

    await dbConnect();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    await dbConnect();

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}