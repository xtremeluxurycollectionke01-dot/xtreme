/*import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { quantity } = await request.json();

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === params.itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
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

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== params.itemId
    );

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}*/

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/auth";

interface Params {
  params: { itemId: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Authenticate user
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const quantity = body.quantity;

    if (quantity < 1) {
      return NextResponse.json({ success: false, error: "Quantity must be at least 1" }, { status: 400 });
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === params.itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item) => item._id?.toString() !== params.itemId
    );

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}