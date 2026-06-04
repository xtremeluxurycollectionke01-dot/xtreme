// app/api/auth/update-phone/route.ts

import { NextRequest, NextResponse } from "next/server";
import {dbConnect }from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get authenticated user
    const sessionUser = await getSession();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is required",
        },
        { status: 400 }
      );
    }

    // Remove non-numeric characters
    let formattedPhone = phoneNumber.replace(/\D/g, "");

    // Convert 07XXXXXXXX to 2547XXXXXXXX
    if (formattedPhone.startsWith("0")) {
      formattedPhone =
        "254" + formattedPhone.slice(1);
    }

    // Optional validation
    if (!formattedPhone.startsWith("254")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Kenyan phone number",
        },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      sessionUser._id,
      {
        phone: formattedPhone,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        phone: user.phone,
      },
      message:
        "Phone number updated successfully",
    });
  } catch (error: any) {
    console.error(
      "Update phone error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to update phone number",
      },
      { status: 500 }
    );
  }
}