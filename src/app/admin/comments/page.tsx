'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  likes: number;
  status: 'approved' | 'pending' | 'rejected';
}

const initialComments: Comment[] = [
  {
    id: '1',
    user: 'AyoMusic',
    content: 'Your latest track is absolutely fire! The beat drops are insane.',
    timestamp: '2024-03-20T10:30:00',
    likes: 45,
    status: 'approved'
  },
  {
    id: '2',
    user: 'ChimaVibes',
    content: 'When is your next concert in Lagos? Can\'t wait to see you perform!',
    timestamp: '2024-03-20T09:15:00',
    likes: 32,
    status: 'pending'
  },
  // Add more sample comments here
];

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleStatusChange = (commentId: string, newStatus: Comment['status']) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, status: newStatus } : comment
    ));
  };

  const handleDelete = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const filteredComments = comments
    .filter(comment => {
      if (filter === 'all') return true;
      return comment.status === filter;
    })
    .filter(comment => 
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      comment.user.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Comments Management</h1>
        <div className="flex space-x-4">
          <select
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Comments</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search comments..."
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 pl-10 border border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          className="absolute left-3 top-3 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold">{comment.user}</h3>
                <p className="text-gray-400 text-sm">
                  {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  comment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  comment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                </span>
                <span className="text-gray-400">
                  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {comment.likes}
                </span>
              </div>
            </div>
            <p className="text-white mb-4">{comment.content}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleStatusChange(comment.id, 'approved')}
                className={`px-3 py-1 rounded ${
                  comment.status === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-green-500/20'
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(comment.id, 'rejected')}
                className={`px-3 py-1 rounded ${
                  comment.status === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-red-500/20'
                }`}
              >
                Reject
              </button>
              <button
                onClick={() => handleDelete(comment.id)}
                className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 