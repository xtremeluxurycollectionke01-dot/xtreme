/*import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    let cart = await Cart.findOne({ user: user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
    }

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity = 1, size, color } = await request.json();

    await dbConnect();

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
          product: productId,
          quantity,
          size,
          color,
          price: product.price,
          _id: ""
      });
    }

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

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    await Cart.findOneAndDelete({ user: user._id });

    return NextResponse.json(
      { success: true, message: "Cart cleared" },
      { status: 200 }
    );
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
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    let cart = await Cart.findOne({ user: user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
    }

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/*export async function POST(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity = 1, size, color } = await request.json();

    await dbConnect();

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item - DON'T manually set _id, let MongoDB generate it
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price,
        _id: ""
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}*/

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // IMPORTANT: Clone the body and remove _id completely
    const body = await request.json();
    const { productId, quantity = 1, size, color } = body;

    // Debug: Log what we're receiving
    console.log("Request body:", body);
    console.log("Has _id?", "_id" in body, "Value:", body._id);

    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item: any) => 
        item.product.toString() === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // CRITICAL FIX: Create the new item object WITHOUT _id field
      const newItem = {
        product: productId,
        quantity,
        size,
        color,
        price: product.price,
      };
      
      // Double check we don't have _id
      if ('_id' in newItem) {
        delete (newItem as any)._id;
      }
      
      console.log("Pushing item:", newItem); // Should not have _id
      
      cart.items.push(newItem);
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth(request as any);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    await Cart.findOneAndDelete({ user: user._id });

    return NextResponse.json(
      { success: true, message: "Cart cleared" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}