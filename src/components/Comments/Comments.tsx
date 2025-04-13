'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
}

// Generate a large number of sample comments
const generateComments = () => {
  const usernames = [
    // African Names
    'Amara_K', 'ChimaVibes', 'KofiBeats', 'AyoMusic', 'ZainabSounds', 
    'AdannaRhythm', 'FemiGroove', 'OlayinkaJams', 'ChidiFlow', 'NnamdiSoul',
    'Malaika_M', 'TundeBeats', 'AminataVibes', 'KwameMusic', 'SeunDrums',
    
    // European Names
    'LucaMusic', 'SophieChords', 'AlessandroKeys', 'EmmaRose', 'HenrikBeats',
    'IsabellaSound', 'MathieuGroove', 'ClaraHarmony', 'FranzMelody', 'ElenaVibe',
    'PierreSoul', 'AnnikaSings', 'GiovanniKeys', 'CamilleArt', 'LarsBeats',
    
    // American Names
    'JaydenMusic', 'AvaRhythm', 'EthanBeats', 'MadisonFlow', 'BraydenSoul',
    'ZoeyTunes', 'CalebVibes', 'BrooklynJams', 'AidenGroove', 'RileySound',
    'HarperMuse', 'MasonBeats', 'KinsleyArt', 'LiamVibes', 'OliviaJazz'
  ];

  const comments = [
    // Cultural Appreciation Comments
    'The fusion of African drums with modern beats is incredible! Love how you represent our culture! 🥁✨',
    'Reminds me of the traditional music from my village, but with a modern twist. Beautiful work! 🌍🎵',
    'This sound takes me back to Lagos nights! The energy is unmatched! 🌟🎶',
    'The Kora samples in Desert Wind are pure genius! African music at its finest! 🎸🌅',
    
    // Technical Appreciation
    'That bass line in track 3 is insane! The mixing is top-notch! 🎧🔥',
    'The production quality is world-class! Every instrument sits perfectly in the mix! 🎹✨',
    'Love how you incorporated the talking drum with those electronic elements! 🥁💫',
    'The vocal harmonies in Oasis Dreams are heavenly! Such clean production! 🎤🌊',
    
    // Personal Impact
    'Been playing this on repeat since release! My kids love dancing to it! 💃🕺',
    'This album got me through some tough times. Thank you for the healing vibes 🙏💖',
    'Your music inspired me to start learning African percussion! 🥁🌍',
    'Played this at my wedding and everyone was asking about it! Pure magic! 💑✨',
    
    // Specific Track Comments
    'Desert Wind is my morning motivation! That rhythm section is fire! 🌅🔥',
    'Moonlight Serenade hits different at 2 AM! Pure vibes! 🌙💫',
    'The storytelling in Oasis Dreams is so powerful! Gives me chills! 🎭🌊',
    'Urban Fusion is the perfect blend of traditional and modern! 🏙️🎵',
    
    // Concert/Performance Related
    'Saw you perform in London last month. Even better live! 🎫🎭',
    'Your Glastonbury set was legendary! When are you coming back? 🎪🎵',
    'The live band brings these tracks to another level! Incredible performance in Paris! 🎸🗼',
    'That festival performance in Lagos was epic! The crowd went wild! 🎉🌍',
    
    // Album Appreciation
    'This album deserves a Grammy! Innovative and authentic! 🏆✨',
    'Best album of 2024! The attention to detail is remarkable! 📀🌟',
    'Every track tells a story. This is more than music - it\'s art! 🎨🎵',
    'The way you blend cultures in this album is revolutionary! 🌍🤝',
    
    // Collaboration Requests/Appreciation
    'The collab with that jazz ensemble was perfect! Please do more! 🎷🤝',
    'Would love to hear you work with more traditional artists! 🌍🎵',
    'Your remix of that classic Afrobeat track is genius! 🎧🔥',
    'The guest features on this album are perfectly chosen! 🎤✨'
  ];

  const timeUnits = ['minutes', 'hours', 'days', 'weeks'];
  const locations = ['Lagos', 'London', 'Paris', 'New York', 'Berlin', 'Accra', 'Nairobi', 'Amsterdam', 'Toronto', 'Cape Town'];
  const sampleComments: Comment[] = [];

  for (let i = 0; i < 200; i++) {
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    const randomTime = Math.floor(Math.random() * 60) + 1;
    const randomTimeUnit = timeUnits[Math.floor(Math.random() * timeUnits.length)];
    const randomLikes = Math.floor(Math.random() * 50);
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    sampleComments.push({
      id: (i + 1).toString(),
      username: randomUsername,
      content: randomComment,
      timestamp: `${randomTime} ${randomTimeUnit} ago from ${randomLocation}`,
      likes: randomLikes
    });
  }

  return sampleComments.sort((a, b) => b.likes - a.likes); // Sort by likes for more realism
};

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  useEffect(() => {
    setComments(generateComments());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !username.trim()) return;

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      username: username,
      content: newComment,
      timestamp: 'Just now',
      likes: 0
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
    setCurrentPage(1); // Return to first page after posting
  };

  const handleLike = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  // Calculate pagination
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-6 py-4 rounded-xl bg-black/20
              text-white placeholder-gray-400 text-lg
              border-2 border-gray-700
              focus:outline-none focus:border-yellow-400
              focus:ring-2 focus:ring-yellow-400/20
              transition-all duration-300"
            />
          </div>

          <div className="relative group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              required
              rows={4}
              className="w-full px-6 py-4 rounded-xl bg-black/20
              text-white placeholder-gray-400 text-lg
              border-2 border-gray-700
              focus:outline-none focus:border-yellow-400
              focus:ring-2 focus:ring-yellow-400/20
              transition-all duration-300
              resize-none"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-4 rounded-full
            bg-yellow-400 text-black font-semibold text-lg
            transform transition-all duration-300
            hover:bg-yellow-300
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </span>
          </motion.button>
        </div>
      </form>

      {/* Comments Stats */}
      <div className="flex justify-between items-center mb-8 text-gray-400">
        <span>{comments.length} comments</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Comments List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {currentComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6
              hover:bg-gray-800/60 transition-all duration-300"
            >
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{comment.username}</h3>
                  <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                </div>
                
                <p className="text-gray-300 mb-4">{comment.content}</p>
                
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{comment.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      <div className="mt-12 flex justify-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
          } else {
            pageNumber = currentPage - 2 + i;
          }
          
          return (
            <button
              key={i}
              onClick={() => paginate(pageNumber)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === pageNumber
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
} 