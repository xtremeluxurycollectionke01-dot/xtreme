// app/models/PageView.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageView extends Document {
  page: string;
  userId: string | null;
  userName: string;
  userRole: string;
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  timestamp: Date;
  duration?: number; // Time spent on page in seconds
  exitPage?: boolean; // If this was the last page before leaving
}

const PageViewSchema = new Schema<IPageView>({
  page: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    default: null,
    index: true,
  },
  userName: {
    type: String,
    default: 'Guest',
  },
  userRole: {
    type: String,
    default: 'guest',
    enum: ['guest', 'customer', 'admin'],
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
  referrer: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
  exitPage: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound indexes for better query performance
PageViewSchema.index({ timestamp: -1, page: 1 });
PageViewSchema.index({ userId: 1, timestamp: -1 });
PageViewSchema.index({ sessionId: 1, timestamp: -1 });

export default (mongoose.models.PageView as Model<IPageView>) || 
  mongoose.model<IPageView>('PageView', PageViewSchema);