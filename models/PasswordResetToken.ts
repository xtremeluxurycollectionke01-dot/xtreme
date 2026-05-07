// models/PasswordResetToken.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPasswordResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  phoneNumber: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const PasswordResetTokenSchema: Schema<IPasswordResetToken> = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    token: { 
      type: String, 
      required: true, 
      unique: true 
    },
    phoneNumber: { 
      type: String, 
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true,
      expires: 3600 // Automatically delete after 1 hour (MongoDB TTL)
    },
    used: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

// Index for faster lookups
PasswordResetTokenSchema.index({ token: 1 });
PasswordResetTokenSchema.index({ userId: 1, used: 1 });

const PasswordResetToken: Model<IPasswordResetToken> = 
  mongoose.models.PasswordResetToken || 
  mongoose.model<IPasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetToken;