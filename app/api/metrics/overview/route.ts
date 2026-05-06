// app/api/metrics/overview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');
    
    // Verify admin access - AWAIT the function
    const adminUser = await requireAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    // Parallel queries for better performance
    const [
      totalViews,
      uniqueVisitors,
      viewsByDay,
      topPages,
      recentViews,
      userActivity,
      trafficSources,
      avgSessionDuration,
      bounceRate
    ] = await Promise.all([
      // Total views
      PageView.countDocuments({ timestamp: { $gte: startDate, $lte: endDate } }),
      
      // Unique visitors
      PageView.distinct('sessionId', { timestamp: { $gte: startDate, $lte: endDate } }),
      
      // Views by day
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            views: { $sum: 1 },
            uniqueUsers: { $addToSet: '$sessionId' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      
      // Top pages
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$page', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ]),
      
      // Recent views
      PageView.find({
        timestamp: { $gte: startDate, $lte: endDate }
      })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean(),
      
      // User activity - only for authenticated users
      PageView.aggregate([
        { 
          $match: { 
            timestamp: { $gte: startDate, $lte: endDate },
            userId: { $ne: null, }
          } 
        },
        {
          $group: {
            _id: '$userId',
            userName: { $first: '$userName' },
            userRole: { $first: '$userRole' },
            views: { $sum: 1 },
            avgDuration: { $avg: '$duration' },
            lastSeen: { $max: '$timestamp' },
            firstSeen: { $min: '$timestamp' }
          }
        },
        { $sort: { views: -1 } },
        { $limit: 20 }
      ]),
      
      // Traffic sources
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$referrer', null] },
                'Direct',
                {
                  $cond: [
                    { $regexMatch: { input: '$referrer', regex: /google/i } },
                    'Google',
                    {
                      $cond: [
                        { $regexMatch: { input: '$referrer', regex: /facebook|instagram|twitter|linkedin/i } },
                        'Social Media',
                        {
                          $cond: [
                            { $regexMatch: { input: '$referrer', regex: /mail|outlook|yahoo/i } },
                            'Email',
                            'Other'
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Average session duration
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: '$sessionId',
            totalDuration: { $sum: '$duration' }
          }
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$totalDuration' }
          }
        }
      ]),
      
      // Bounce rate (sessions with only 1 page view)
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: '$sessionId',
            pageCount: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            bouncedSessions: {
              $sum: { $cond: [{ $eq: ['$pageCount', 1] }, 1, 0] }
            }
          }
        }
      ])
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        viewsByDay: viewsByDay.map(day => ({
          date: `${day._id.year}-${String(day._id.month).padStart(2, '0')}-${String(day._id.day).padStart(2, '0')}`,
          views: day.views,
          uniqueUsers: day.uniqueUsers.length
        })),
        topPages: topPages.map(page => ({
          page: page._id || 'home',
          views: page.views
        })),
        recentViews: recentViews.map(view => ({
          ...view,
          _id: view._id.toString()
        })),
        userActivity: userActivity.map(user => ({
          userId: user._id,
          userName: user.userName,
          userRole: user.userRole,
          views: user.views,
          avgDuration: Math.round(user.avgDuration || 0),
          lastSeen: user.lastSeen,
          firstSeen: user.firstSeen
        })),
        trafficSources: trafficSources.map(source => ({
          source: source._id,
          views: source.count,
          percentage: totalViews > 0 ? Math.round((source.count / totalViews) * 100) : 0
        })),
        avgSessionDuration: Math.round(avgSessionDuration[0]?.avgDuration || 0),
        bounceRate: bounceRate[0] 
          ? Math.round((bounceRate[0].bouncedSessions / bounceRate[0].totalSessions) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}