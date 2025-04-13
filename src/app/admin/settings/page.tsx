'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const initialNotificationSettings: NotificationSetting[] = [
  {
    id: 'new_comments',
    title: 'New Comments',
    description: 'Get notified when someone comments on your tracks',
    enabled: true
  },
  {
    id: 'new_likes',
    title: 'New Likes',
    description: 'Get notified when someone likes your tracks or comments',
    enabled: true
  },
  {
    id: 'track_stats',
    title: 'Track Statistics',
    description: 'Receive weekly statistics about your tracks performance',
    enabled: false
  }
];

export default function Settings() {
  const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: '/default-avatar.jpg'
  });

  const toggleNotification = (id: string) => {
    setNotificationSettings(settings =>
      settings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-300 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">{setting.title}</h3>
                <p className="text-gray-400 text-sm">{setting.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(setting.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  setting.enabled ? 'bg-yellow-400' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Security</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="pt-4">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition">
              Update Password
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 