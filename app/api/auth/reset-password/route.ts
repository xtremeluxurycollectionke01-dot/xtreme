// app/api/auth/reset-password/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { token, newPassword } = await request.json();
    
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required" },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    // Find valid token
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findById(resetToken.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    // Mark token as used
    resetToken.used = true;
    await resetToken.save();
    
    // Delete all other unused tokens for this user
    await PasswordResetToken.deleteMany({
      userId: user._id,
      used: false
    });
    
    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now login with your new password."
    });
    
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}*/

// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import {dbConnect }from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { token, newPassword } = await request.json();
    
    console.log("Reset password request", { token: token?.substring(0, 10) });
    
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Token and new password are required" },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    // Find valid token
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findById(resetToken.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    // Hash the new password
    //const salt = await bcrypt.genSalt(12);
    //const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password directly
    //user.password = hashedPassword;
    //await user.save();

    user.password = newPassword;
    await user.save();
    
    // Verify the password was saved correctly - Fixed null check
    const verifiedUser = await User.findById(resetToken.userId).select("+password");
    
    // Check if verifiedUser exists
    if (!verifiedUser) {
      throw new Error("Could not verify password update - user not found");
    }
    
    const isValid = await bcrypt.compare(newPassword, verifiedUser.password);
    
    if (!isValid) {
      throw new Error("Password verification failed after update");
    }
    
    // Mark token as used
    resetToken.used = true;
    await resetToken.save();
    
    // Delete any other unused tokens
    await PasswordResetToken.deleteMany({
      userId: user._id,
      used: false
    });
    
    return NextResponse.json({
      success: true,
      message: "Password reset successfully"
    });
    
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}