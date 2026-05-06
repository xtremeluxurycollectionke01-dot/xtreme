// app/admin/metrics/page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Eye, Activity, Clock, TrendingUp, 
  Globe, AlarmClock, Target, Zap, BarChart3,
  Download, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';


interface MetricsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: Array<{ date: string; views: number; uniqueUsers: number }>;
  topPages: Array<{ page: string; views: number }>;
  recentViews: Array<any>;
  userActivity: Array<any>;
  trafficSources: Array<{ source: string; views: number; percentage: number }>;
  avgSessionDuration: number;
  bounceRate: number;
}

interface RealtimeData {
  activeVisitors: number;
  activeVisitorsList: Array<any>;
  hourlyViews: number;
  todayViews: number;
  pageDistribution: Array<{ page: string; activeUsers: number }>;
  recentEvents: Array<any>;
}

export default function MetricsPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMetrics();
      fetchRealtime();
      
      let interval: NodeJS.Timeout;
      if (autoRefresh) {
        interval = setInterval(() => {
          fetchRealtime();
        }, 10000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [user, days, autoRefresh]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics/overview?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtime = async () => {
    try {
      const response = await fetch('/api/metrics/realtime');
      if (!response.ok) throw new Error('Failed to fetch realtime metrics');
      const data = await response.json();
      if (data.success) {
        setRealtime(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch realtime metrics:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (authLoading || loading || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#edf6f4] to-[#cfe0db] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#cfe0db] border-t-[#1f8d6f] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#4e7c6f]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf6f4] to-[#cfe0db]">
      {/* Navigation *
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#cfe0db]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-[#cfe0db] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#4e7c6f]" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1f8d6f] to-[#0f6d54] bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-[#4e7c6f] mt-1">
                  Real-time insights and metrics
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  fetchMetrics();
                  fetchRealtime();
                }}
                className="p-2 hover:bg-[#cfe0db] rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-[#4e7c6f]" />
              </button>
              
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  autoRefresh 
                    ? 'bg-[#1f8d6f] text-white' 
                    : 'bg-white text-[#4e7c6f] border border-[#cfe0db]'
                }`}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="px-3 py-2 bg-white border border-[#cfe0db] rounded-lg text-[#4e7c6f] focus:outline-none focus:ring-2 focus:ring-[#1f8d6f]"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content *
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Realtime Stats *
        {realtime && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#044536] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#1f8d6f]" />
                  Real-time Activity
                </h3>
                <span className="text-sm text-green-600 animate-pulse">● Live</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-[#1f8d6f]">{realtime.activeVisitors}</p>
                  <p className="text-sm text-gray-600">Active Now</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1f8d6f]">{realtime.hourlyViews}</p>
                  <p className="text-sm text-gray-600">Views (Last Hour)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1f8d6f]">{realtime.todayViews}</p>
                  <p className="text-sm text-gray-600">Today's Views</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#044536] flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-[#1f8d6f]" />
                Key Metrics
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Avg. Session Duration</span>
                    <span className="font-semibold text-[#1f8d6f]">
                      {formatDuration(metrics.avgSessionDuration)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bounce Rate</span>
                    <span className="font-semibold text-[#1f8d6f]">{metrics.bounceRate}%</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pages/Session</span>
                    <span className="font-semibold text-[#1f8d6f]">
                      {(metrics.totalViews / metrics.uniqueVisitors).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#044536] flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#1f8d6f]" />
                Traffic Sources
              </h3>
              <div className="space-y-2">
                {metrics.trafficSources.map((source) => (
                  <div key={source.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{source.source}</span>
                      <span className="text-[#1f8d6f] font-medium">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#1f8d6f] to-[#0f6d54] h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Page Distribution *
        {realtime && realtime.pageDistribution.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-lg font-semibold text-[#044536] mb-4">
              Current Page Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {realtime.pageDistribution.map((page) => (
                <div key={page.page} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-[#1f8d6f]">{page.activeUsers}</p>
                  <p className="text-sm text-gray-600 truncate">{page.page}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Views Chart *
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-[#044536] mb-4">Daily Views Trend</h3>
          <div className="space-y-3">
            {metrics.viewsByDay.map((day) => {
              const maxViews = Math.max(...metrics.viewsByDay.map(d => d.views));
              const percentage = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
              
              return (
                <div key={day.date}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{new Date(day.date).toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                    <span>{day.views} views ({day.uniqueUsers} unique)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div className="relative h-full">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1f8d6f] to-[#0f6d54] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative z-10 flex items-center justify-end h-full px-3 text-xs text-white font-medium">
                        {percentage > 30 && `${day.views} views`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pages & User Activity *
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#044536] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1f8d6f]" />
              Top Pages
            </h3>
            <div className="space-y-4">
              {metrics.topPages.map((page, index) => {
                const maxViews = metrics.topPages[0]?.views || 1;
                const percentage = (page.views / maxViews) * 100;
                
                return (
                  <div key={page.page}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1f8d6f]">#{index + 1}</span>
                        <span className="font-mono">{page.page}</span>
                      </div>
                      <span>{page.views} views</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#1f8d6f] h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#044536] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1f8d6f]" />
              Most Active Users
            </h3>
            <div className="space-y-3">
              {metrics.userActivity.map((user) => (
                <div key={user.userId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{user.userName}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>{user.views} views</span>
                      {user.avgDuration > 0 && (
                        <span>Avg {formatDuration(user.avgDuration)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.userRole === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.userRole}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Last seen: {new Date(user.lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed *
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#044536] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1f8d6f]" />
              Recent Activity Feed
            </h3>
            <button
              onClick={() => {
                const csv = metrics.recentViews.map(view => 
                  `${view.userName},${view.page},${new Date(view.timestamp).toLocaleString()},${view.userRole}`
                ).join('\n');
                const blob = new Blob([`User,Page,Time,Role\n${csv}`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-${new Date().toISOString()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#1f8d6f] text-white rounded-lg hover:bg-[#0f6d54] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Page</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metrics.recentViews.slice(0, 30).map((view) => (
                  <tr key={view._id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-800 font-medium">{view.userName}</td>
                    <td className="py-3 font-mono text-xs text-gray-600">{view.page}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(view.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        view.userRole === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : view.userRole === 'customer'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {view.userRole}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {view.duration ? formatDuration(view.duration) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}*/

// app/admin/metrics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Eye, Activity, Clock, TrendingUp, 
  Globe, AlarmClock, Target, Zap, BarChart3,
  Download, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface MetricsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: Array<{ date: string; views: number; uniqueUsers: number }>;
  topPages: Array<{ page: string; views: number }>;
  recentViews: Array<any>;
  userActivity: Array<any>;
  trafficSources: Array<{ source: string; views: number; percentage: number }>;
  avgSessionDuration: number;
  bounceRate: number;
}

interface RealtimeData {
  activeVisitors: number;
  activeVisitorsList: Array<any>;
  hourlyViews: number;
  todayViews: number;
  pageDistribution: Array<{ page: string; activeUsers: number }>;
  recentEvents: Array<any>;
}

export default function MetricsPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMetrics();
      fetchRealtime();
      
      let interval: NodeJS.Timeout;
      if (autoRefresh) {
        interval = setInterval(() => {
          fetchRealtime();
        }, 10000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [user, days, autoRefresh]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics/overview?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtime = async () => {
    try {
      const response = await fetch('/api/metrics/realtime');
      if (!response.ok) throw new Error('Failed to fetch realtime metrics');
      const data = await response.json();
      if (data.success) {
        setRealtime(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch realtime metrics:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (authLoading || loading || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FDE68A] border-t-[var(--primary-yellow)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/60">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-10 border-b border-[#FFD700]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-[#FEF3C7] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--primary-black)]" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-yellow)] to-[#FFA500] bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-black/60 mt-1">
                  Real-time insights and metrics
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  fetchMetrics();
                  fetchRealtime();
                }}
                className="p-2 hover:bg-[#FEF3C7] rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-[var(--primary-black)]" />
              </button>
              
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  autoRefresh 
                    ? 'bg-[var(--primary-yellow)] text-[var(--primary-black)] shadow-md' 
                    : 'bg-white text-black/70 border border-[#FFD700]/30'
                }`}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="px-3 py-2 bg-white border border-[#FFD700]/30 rounded-lg text-black/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary-yellow)]"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Realtime Stats */}
        {realtime && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFD700]/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--primary-black)] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--primary-yellow)]" />
                  Real-time Activity
                </h3>
                <span className="text-sm text-[#FFA500] animate-pulse font-medium">● Live</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-[var(--primary-yellow)] drop-shadow-sm">{realtime.activeVisitors}</p>
                  <p className="text-sm text-black/60">Active Now</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--primary-yellow)] drop-shadow-sm">{realtime.hourlyViews}</p>
                  <p className="text-sm text-black/60">Views (Last Hour)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--primary-yellow)] drop-shadow-sm">{realtime.todayViews}</p>
                  <p className="text-sm text-black/60">Today's Views</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFD700]/10">
              <h3 className="text-lg font-semibold text-[var(--primary-black)] flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-[var(--primary-yellow)]" />
                Key Metrics
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-black/60">Avg. Session Duration</span>
                    <span className="font-semibold text-[var(--primary-yellow)]">
                      {formatDuration(metrics.avgSessionDuration)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Bounce Rate</span>
                    <span className="font-semibold text-[var(--primary-yellow)]">{metrics.bounceRate}%</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#FFD700]/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Pages/Session</span>
                    <span className="font-semibold text-[var(--primary-yellow)]">
                      {(metrics.totalViews / metrics.uniqueVisitors).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFD700]/10">
              <h3 className="text-lg font-semibold text-[var(--primary-black)] flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[var(--primary-yellow)]" />
                Traffic Sources
              </h3>
              <div className="space-y-2">
                {metrics.trafficSources.map((source) => (
                  <div key={source.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-black/60">{source.source}</span>
                      <span className="text-[var(--primary-yellow)] font-medium">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#FEF3C7] rounded-full h-2">
                      <div
                        className="gradient-yellow h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Page Distribution */}
        {realtime && realtime.pageDistribution.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8 border border-[#FFD700]/10">
            <h3 className="text-lg font-semibold text-[var(--primary-black)] mb-4">
              Current Page Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {realtime.pageDistribution.map((page) => (
                <div key={page.page} className="bg-[#FFFBEB] rounded-lg p-3 text-center border border-[#FFD700]/10">
                  <p className="text-2xl font-bold text-[var(--primary-yellow)]">{page.activeUsers}</p>
                  <p className="text-sm text-black/60 truncate">{page.page}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Views Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8 border border-[#FFD700]/10">
          <h3 className="text-lg font-semibold text-[var(--primary-black)] mb-4">Daily Views Trend</h3>
          <div className="space-y-3">
            {metrics.viewsByDay.map((day) => {
              const maxViews = Math.max(...metrics.viewsByDay.map(d => d.views));
              const percentage = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
              
              return (
                <div key={day.date}>
                  <div className="flex justify-between text-sm text-black/60 mb-1">
                    <span>{new Date(day.date).toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                    <span>{day.views} views ({day.uniqueUsers} unique)</span>
                  </div>
                  <div className="w-full bg-[#FEF3C7] rounded-full h-8 overflow-hidden">
                    <div className="relative h-full">
                      <div
                        className="absolute inset-y-0 left-0 gradient-yellow rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative z-10 flex items-center justify-end h-full px-3 text-xs text-[var(--primary-black)] font-bold">
                        {percentage > 30 && `${day.views} views`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pages & User Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFD700]/10">
            <h3 className="text-lg font-semibold text-[var(--primary-black)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--primary-yellow)]" />
              Top Pages
            </h3>
            <div className="space-y-4">
              {metrics.topPages.map((page, index) => {
                const maxViews = metrics.topPages[0]?.views || 1;
                const percentage = (page.views / maxViews) * 100;
                
                return (
                  <div key={page.page}>
                    <div className="flex justify-between text-sm text-black/60 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--primary-yellow)]">#{index + 1}</span>
                        <span className="font-mono text-[var(--primary-black)]">{page.page}</span>
                      </div>
                      <span>{page.views} views</span>
                    </div>
                    <div className="w-full bg-[#FEF3C7] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[var(--primary-yellow)] h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFD700]/10">
            <h3 className="text-lg font-semibold text-[var(--primary-black)] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--primary-yellow)]" />
              Most Active Users
            </h3>
            <div className="space-y-3">
              {metrics.userActivity.map((user) => (
                <div key={user.userId} className="flex justify-between items-center p-3 bg-[#FFFBEB] rounded-lg border border-[#FFD700]/10">
                  <div>
                    <p className="font-medium text-[var(--primary-black)]">{user.userName}</p>
                    <div className="flex gap-3 text-xs text-black/50 mt-1">
                      <span>{user.views} views</span>
                      {user.avgDuration > 0 && (
                        <span>Avg {formatDuration(user.avgDuration)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.userRole === 'admin' 
                        ? 'bg-[var(--primary-yellow)]/20 text-[var(--primary-black)]' 
                        : 'bg-[#FEF3C7] text-black/70'
                    }`}>
                      {user.userRole}
                    </span>
                    <p className="text-xs text-black/50 mt-1">
                      Last seen: {new Date(user.lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFD700]/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--primary-black)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--primary-yellow)]" />
              Recent Activity Feed
            </h3>
            <button
              onClick={() => {
                const csv = metrics.recentViews.map(view => 
                  `${view.userName},${view.page},${new Date(view.timestamp).toLocaleString()},${view.userRole}`
                ).join('\n');
                const blob = new Blob([`User,Page,Time,Role\n${csv}`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-${new Date().toISOString()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--primary-black)] text-[var(--primary-yellow)] rounded-lg hover:bg-black/80 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#FFD700]/20">
                <tr className="text-left text-sm text-black/60">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Page</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFD700]/10">
                {metrics.recentViews.slice(0, 30).map((view) => (
                  <tr key={view._id} className="text-sm hover:bg-[#FFFBEB] transition-colors">
                    <td className="py-3 text-[var(--primary-black)] font-medium">{view.userName}</td>
                    <td className="py-3 font-mono text-xs text-black/60">{view.page}</td>
                    <td className="py-3 text-black/50">
                      {new Date(view.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        view.userRole === 'admin' 
                          ? 'bg-[var(--primary-yellow)]/20 text-[var(--primary-black)]' 
                          : view.userRole === 'customer'
                          ? 'bg-[#FEF3C7] text-black/70'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {view.userRole}
                      </span>
                    </td>
                    <td className="py-3 text-black/50">
                      {view.duration ? formatDuration(view.duration) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}