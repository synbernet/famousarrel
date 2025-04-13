'use client';

import { useMerch } from '@/contexts/MerchContext';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { merchItems } = useMerch();
  const { logout } = useAuth();
  const router = useRouter();

  const managementSections = [
    {
      name: 'Home Page',
      description: 'Update hero section, featured content, and announcements',
      path: '/admin/home',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      name: 'Music Management',
      description: 'Manage tracks, albums, and playlists',
      path: '/admin/music',
      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
    },
    {
      name: 'Tour & Events',
      description: 'Manage tour dates, venues, and ticket information',
      path: '/admin/tour',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      name: 'Booking',
      description: 'Handle booking requests and availability',
      path: '/admin/booking',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      name: 'Fan Chat',
      description: 'Moderate chat rooms and manage user interactions',
      path: '/admin/fan-chat',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    {
      name: 'Merchandise',
      description: 'Manage products, inventory, and orders',
      path: '/admin/merch',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'merch',
      action: 'New product added',
      description: 'Limited Edition Tour T-Shirt',
      timestamp: '30 minutes ago'
    },
    {
      id: 2,
      type: 'music',
      action: 'Track updated',
      description: 'Desert Nights - Remastered',
      timestamp: '2 hours ago'
    },
    {
      id: 3,
      type: 'event',
      action: 'Event scheduled',
      description: 'Winter Tour 2024',
      timestamp: '1 day ago'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your website content and features</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementSections.map((section) => (
          <Link
            key={section.name}
            href={section.path}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-gray-600">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={section.icon}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">{section.name}</h3>
            </div>
            <p className="text-gray-400">{section.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-4 border-b border-gray-700 last:border-0"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {activity.type === 'merch' && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    )}
                    {activity.type === 'music' && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    )}
                    {activity.type === 'event' && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400">{activity.description}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Server Status</span>
            <span className="text-green-400">Operational</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Last Backup</span>
            <span className="text-gray-400">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Storage Usage</span>
            <span className="text-gray-400">42%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 