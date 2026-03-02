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
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    // Authenticate user
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse quantity from request
    const { quantity } = await request.json();
    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Connect to DB
    await dbConnect();

    // Find user's cart
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    // Find item in cart safely
    const itemIndex = cart.items.findIndex(
      (item) => item._id && item._id.toString() === params.itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Save cart and populate products
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
    // Authenticate user
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to DB
    await dbConnect();

    // Find user's cart
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    // Remove item safely
    cart.items = cart.items.filter(
      (item) => item._id && item._id.toString() !== params.itemId
    );

    // Save cart and populate products
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