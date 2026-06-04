// app/api/orders/guest/route.ts
import { NextRequest, NextResponse } from "next/server";
import {dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderNumber } from "@/lib/utils";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      items, 
      shippingAddress, 
      contactInfo, 
      paymentMethod = "mpesa",
      notes 
    } = body;

    // Validate required fields
    if (!items || !items.length || !shippingAddress || !contactInfo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate stock availability and collect product data
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      // Check if product exists
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found` },
          { status: 404 }
        );
      }

      // Check stock based on whether size is specified
      let availableStock = product.stock;
      if (item.size && product.sizes && product.sizes.length > 0) {
        const sizeObj = product.sizes.find((s: any) => s.size === item.size);
        if (!sizeObj) {
          return NextResponse.json(
            { success: false, error: `Size ${item.size} not available for ${product.name}` },
            { status: 400 }
          );
        }
        availableStock = sizeObj.stock;
      }

      if (availableStock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      // Calculate item total
      const itemTotal = (product.price || 0) * item.quantity;
      totalAmount += itemTotal;
      
      // Add to order items
      orderItems.push({
        product: new mongoose.Types.ObjectId(item.productId),
        name: product.name || "Product",
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: product.price || 0,
      });
    }

    // Create order with guest user reference (undefined instead of null)
    const orderNumber = generateOrderNumber();
    
    // Prepare order data - omit user field for guest orders
    const orderData: any = {
      orderNumber,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || "",
        zipCode: shippingAddress.zipCode || "",
        country: shippingAddress.country || "Kenya",
      },
      contactInfo: {
        email: contactInfo.email,
        phone: contactInfo.phone,
        fullName: contactInfo.fullName,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "awaiting_confirmation" : "pending",
      orderStatus: "pending",
      notes: notes || "",
    };
    
    // Only add user field if it's not null/undefined and is a valid ObjectId
    // For guest orders, we don't set the user field at all
    if (contactInfo.userId && mongoose.Types.ObjectId.isValid(contactInfo.userId)) {
      orderData.user = new mongoose.Types.ObjectId(contactInfo.userId);
    }
    
    const order = await Order.create(orderData);

    // For M-Pesa payments, initiate payment
    if (paymentMethod === "mpesa" && contactInfo.phone) {
      // You can integrate M-Pesa STK push here
      // For now, just return the order with payment pending
      return NextResponse.json({
        success: true,
        data: {
          order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
          },
          requiresPayment: true,
          paymentMethod: "mpesa",
        },
        message: "Order created. Complete payment to confirm your order.",
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
        },
      },
      message: "Order created successfully",
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating guest order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}