// app/api/metrics/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import PageView from '@/models/PageView';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { page, userId, userName, userRole, sessionId, referrer, userAgent, ipAddress } = body;

    // Create page view record
    const pageView = await PageView.create({
      page,
      userId: userId || null,
      userName: userName || 'Guest',
      userRole: userRole || 'guest',
      sessionId,
      referrer,
      userAgent,
      ipAddress,
      timestamp: new Date(),
    });

    // Update previous page view duration for this session
    const previousView = await PageView.findOne({
      sessionId,
      _id: { $ne: pageView._id }
    }).sort({ timestamp: -1 });

    if (previousView && previousView.timestamp) {
      const timeDiff = (new Date().getTime() - new Date(previousView.timestamp).getTime()) / 1000;
      if (timeDiff < 3600) { // Only if less than 1 hour
        await PageView.findByIdAndUpdate(previousView._id, {
          duration: Math.min(timeDiff, 1800) // Max 30 minutes
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}