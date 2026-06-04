// app/api/auth/forgot-password/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import crypto from "crypto";

// Step 1: Verify email and check if phone exists
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, phoneNumber, step = 1 } = body;
    
    // Step 1: Verify email only
    if (step === 1) {
      if (!email) {
        return NextResponse.json(
          { success: false, error: "Email is required" },
          { status: 400 }
        );
      }
      
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        // For security, don't reveal if email exists
        return NextResponse.json(
          { 
            success: false, 
            error: "If an account with this email exists, you will be able to reset your password." 
          },
          { status: 200 }
        );
      }
      
      // Check if user has a phone number
      const hasPhone = !!user.phone;
      
      return NextResponse.json({
        success: true,
        data: {
          userId: user._id,
          hasPhone,
          email: user.email,
        },
        message: hasPhone 
          ? "Phone number found. Please enter your WhatsApp number to receive reset link."
          : "No phone number found. Please add your WhatsApp number to receive reset link."
      });
    }
    
    // Step 2: Generate reset token and send via WhatsApp
    if (step === 2) {
      if (!email || !phoneNumber) {
        return NextResponse.json(
          { success: false, error: "Email and phone number are required" },
          { status: 400 }
        );
      }
      
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }
      
      // Save phone number if it doesn't exist
      if (!user.phone) {
        user.phone = phoneNumber;
        await user.save();
      }
      
      // Generate unique token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      
      // Delete any existing unused tokens for this user
      await PasswordResetToken.deleteMany({ 
        userId: user._id, 
        used: false 
      });
      
      // Create new token
      await PasswordResetToken.create({
        userId: user._id,
        token,
        phoneNumber: user.phone || phoneNumber,
        expiresAt,
        used: false,
      });
      
      // Create reset link
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${token}`;
      
      // Create WhatsApp message
      const message = `🔐 *Password Reset Request*\n\nHello ${user.name || 'User'},\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this message.\n\n*Note:* This link is for your use only. Do not share it with anyone.`;
      
      // Format phone number for WhatsApp
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      }
      if (!formattedPhone.startsWith('254') && formattedPhone.length === 9) {
        formattedPhone = '254' + formattedPhone;
      }
      
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      
      return NextResponse.json({
        success: true,
        data: {
          whatsappUrl,
          resetLink, // For debugging - remove in production
        },
        message: "Reset link generated. Click the button to send via WhatsApp."
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid step" },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}*/

// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, phoneNumber, step = 1 } = body;
    
    // Step 1: Verify email only
    if (step === 1) {
      if (!email) {
        return NextResponse.json(
          { success: false, error: "Email is required" },
          { status: 400 }
        );
      }
      
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        // For security, don't reveal if email exists
        return NextResponse.json(
          { 
            success: false, 
            error: "If an account with this email exists, you will be able to reset your password." 
          },
          { status: 200 }
        );
      }
      
      // Check if user has a phone number (check both locations with proper null checks)
      const hasPhone = !!(user.phone || user.address?.phone);
      
      return NextResponse.json({
        success: true,
        data: {
          userId: user._id,
          hasPhone,
          email: user.email,
        },
        message: hasPhone 
          ? "Phone number found. Please enter your WhatsApp number to receive reset link."
          : "No phone number found. Please add your WhatsApp number to receive reset link."
      });
    }
    
    // Step 2: Generate reset token and send via WhatsApp
    if (step === 2) {
      if (!email || !phoneNumber) {
        return NextResponse.json(
          { success: false, error: "Email and phone number are required" },
          { status: 400 }
        );
      }
      
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }
      
      // Format phone number
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      }
      if (!formattedPhone.startsWith('254') && formattedPhone.length === 9) {
        formattedPhone = '254' + formattedPhone;
      }
      
      // Save phone number to user model (top-level)
      if (!user.phone) {
        user.phone = formattedPhone;
        
        // Safely initialize address if it doesn't exist
        if (!user.address) {
          user.address = {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "Kenya"
          };
        }
        
        // Save phone to address as well
        user.address.phone = formattedPhone;
        await user.save();
        console.log("Phone number saved for user:", user.email);
      }
      
      // Generate unique token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Delete any existing unused tokens
      await PasswordResetToken.deleteMany({ 
        userId: user._id, 
        used: false 
      });
      
      // Create new token
      await PasswordResetToken.create({
        userId: user._id,
        token,
        phoneNumber: formattedPhone,
        expiresAt,
        used: false,
      });
      
      // Create reset link
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${token}`;
      
      // Create WhatsApp message
      const message = `🔐 *Password Reset Request*\n\nHello ${user.name || 'User'},\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this message.`;
      
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      
      return NextResponse.json({
        success: true,
        data: {
          whatsappUrl,
        },
        message: "Reset link generated. Click the button to send via WhatsApp."
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid step" },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}