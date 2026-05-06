// app/api/metrics/realtime/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Verify admin access - AWAIT the function
    const adminUser = await requireAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const [
      activeVisitors,
      hourlyViews,
      todayViews,
      pageDistribution,
      realtimeEvents
    ] = await Promise.all([
      // Active visitors in last 5 minutes
      PageView.aggregate([
        { $match: { timestamp: { $gte: fiveMinutesAgo } } },
        {
          $group: {
            _id: '$sessionId',
            userName: { $last: '$userName' },
            userRole: { $last: '$userRole' },
            currentPage: { $last: '$page' },
            lastSeen: { $max: '$timestamp' },
            duration: { $max: '$duration' }
          }
        },
        { $sort: { lastSeen: -1 } },
        { $limit: 50 }
      ]),
      
      // Views in last hour
      PageView.countDocuments({ timestamp: { $gte: oneHourAgo } }),
      
      // Views today
      PageView.countDocuments({ 
        timestamp: { 
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
        } 
      }),
      
      // Current page distribution
      PageView.aggregate([
        { $match: { timestamp: { $gte: fiveMinutesAgo } } },
        {
          $group: {
            _id: '$page',
            activeUsers: { $addToSet: '$sessionId' }
          }
        },
        {
          $project: {
            page: '$_id',
            activeCount: { $size: '$activeUsers' }
          }
        },
        { $sort: { activeCount: -1 } },
        { $limit: 10 }
      ]),
      
      // Recent events for activity feed
      PageView.find({
        timestamp: { $gte: twentyFourHoursAgo }
      })
      .sort({ timestamp: -1 })
      .limit(30)
      .lean()
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        activeVisitors: activeVisitors.length,
        activeVisitorsList: activeVisitors.map(v => ({
          sessionId: v._id,
          userName: v.userName,
          userRole: v.userRole,
          page: v.currentPage,
          lastSeen: v.lastSeen,
          isActive: (now.getTime() - new Date(v.lastSeen).getTime()) < 60000
        })),
        hourlyViews,
        todayViews,
        pageDistribution: pageDistribution.map(p => ({
          page: p.page,
          activeUsers: p.activeCount
        })),
        recentEvents: realtimeEvents.map(event => ({
          id: event._id,
          user: event.userName,
          action: `Viewed ${event.page}`,
          timestamp: event.timestamp,
          userRole: event.userRole
        }))
      }
    });
  } catch (error) {
    console.error('Realtime metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch realtime metrics' },
      { status: 500 }
    );
  }
}