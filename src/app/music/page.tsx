'use client';

import MusicPlayer from '@/components/MusicPlayer/MusicPlayer';
import Link from 'next/link';
import Comments from '@/components/Comments/Comments';

const samplePlaylist = [
  {
    id: '1',
    title: 'Uthando',
    artist: 'Famous Arrel',
    duration: '4:35',
    coverArt: '/images/Uthando.jpeg',
    audioUrl: '/music/Uthando.mp3',
    fanlinkUrl: 'https://fanlink.to/uthando-famousarrel'
  },
  {
    id: '2',
    title: 'Igwe',
    artist: 'Famous Arrel',
    duration: '3:58',
    coverArt: '/images/igwe.jpg',
    audioUrl: '/music/igwe.mp3',
    fanlinkUrl: 'https://fanlink.to/igwe-famousarrel'
  },
  {
    id: '3',
    title: 'Anita',
    artist: 'Famous Arrel',
    duration: '5:12',
    coverArt: '/images/Anita.png',
    audioUrl: '/music/Anita.mp3',
    fanlinkUrl: 'https://fanlink.to/anita-famousarrel'
  },
  {
    id: '4',
    title: 'Ogologo',
    artist: 'Famous Arrel',
    duration: '4:15',
    coverArt: '/images/ogologo.jpg',
    audioUrl: '/music/ogologo.mp3',
    fanlinkUrl: 'https://fanlink.to/ogologo-famousarrel'
  },
  {
    id: '5',
    title: 'Pull Up',
    artist: 'Famous Arrel',
    duration: '3:45',
    coverArt: '/images/pullup.jpg',
    audioUrl: '/music/pullup.mp3',
    fanlinkUrl: 'https://fanlink.to/pullup-famousarrel'
  },
  {
    id: '6',
    title: 'Whyne',
    artist: 'Famous Arrel',
    duration: '4:02',
    coverArt: '/images/whyne.jpg',
    audioUrl: '/music/whyne.mp3',
    fanlinkUrl: 'https://fanlink.to/whyne-famousarrel'
  },
  {
    id: '7',
    title: 'Our Father',
    artist: 'Famous Arrel',
    duration: '5:30',
    coverArt: '/images/ourfather.jpg',
    audioUrl: '/music/ourfather.mp3',
    fanlinkUrl: 'https://fanlink.to/ourfather-famousarrel'
  },
  {
    id: '8',
    title: 'Lagos',
    artist: 'Famous Arrel',
    duration: '4:20',
    coverArt: '/images/lagos.jpg',
    audioUrl: '/music/lagos.mp3',
    fanlinkUrl: 'https://fanlink.to/lagos-famousarrel'
  },
  {
    id: '9',
    title: 'Chanel',
    artist: 'Famous Arrel',
    duration: '3:55',
    coverArt: '/images/chanel.jpg',
    audioUrl: '/music/chanel.mp3',
    fanlinkUrl: 'https://fanlink.to/chanel-famousarrel'
  },
  {
    id: '10',
    title: 'Kimkardashian',
    artist: 'Famous Arrel',
    duration: '4:45',
    coverArt: '/images/kimkardashian.jpg',
    audioUrl: '/music/kimkardashian.mp3',
    fanlinkUrl: 'https://fanlink.to/kimkardashian-famousarrel'
  },
  {
    id: '11',
    title: 'Girlsthem',
    artist: 'Famous Arrel',
    duration: '4:08',
    coverArt: '/images/girlsthem.jpg',
    audioUrl: '/music/girlsthem.mp3',
    fanlinkUrl: 'https://fanlink.to/girlsthem-famousarrel'
  },
  {
    id: '12',
    title: 'Bendova',
    artist: 'Famous Arrel',
    duration: '3:50',
    coverArt: '/images/bendova.jpg',
    audioUrl: '/music/bendova.mp3',
    fanlinkUrl: 'https://fanlink.to/bendova-famousarrel'
  },
  {
    id: '13',
    title: 'Let\'s Go',
    artist: 'Famous Arrel',
    duration: '4:25',
    coverArt: '/images/letsgo.jpg',
    audioUrl: '/music/letsgo.mp3',
    fanlinkUrl: 'https://fanlink.to/letsgo-famousarrel'
  }
];

const musicVideos = [
  {
    id: 'NAzQNpU-k2E',
    title: 'Famous Arrel - Marry me',
    description: 'Experience the latest hit from Famous Arrel'
  },
  {
    id: 'PBCsqaZn9jc',
    title: 'Famous Arrel - Latest Release',
    description: 'Brand new release showcasing unique artistry'
  },
  {
    id: 'yzT6oqiY1hk',
    title: 'Famous Arrel - Whyne',
    description: 'Captivating live performance by Famous Arrel'
  },
  {
    id: 'FFpeoZod_9c',
    title: 'Famous Arrel - Girls Them',
    description: 'Official music video for "Girls Them"'
  }
];

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">My Music</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Latest Album</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <img
                  src="/images/album.jpg"
                  alt="The Fishermanson Album"
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                  onError={(e) => { e.currentTarget.src = '/images/logo.png'; }}
                />
                <h3 className="text-xl font-bold text-white">The Fishermanson Album</h3>
                <p className="text-gray-400 mb-4">Released: March 2019</p>
                <p className="text-gray-300 mb-6">
                  Experience the fusion of traditional and modern sounds in this groundbreaking album.
                  Journey through the rhythms of Afrobeats and Dancehall music.
                </p>
                <div className="flex gap-4">
                  <button className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition">
                    Listen Now
                  </button>
                  <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Featured Songs</h2>
              <MusicPlayer playlist={samplePlaylist.map(song => ({
                ...song,
                extraContent: (
                  <a
                    href={song.fanlinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1.5 rounded-lg hover:bg-yellow-300 transition text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                )
              }))} />
            </div>
          </div>

          {/* Music Videos Section */}
          <div className="mb-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white">Music Videos</h2>
              <Link 
                href="https://www.youtube.com/@famousarrel?sub_confirmation=1"
                target="_blank"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe on YouTube
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {musicVideos.map((video, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden group hover:transform hover:scale-105 transition duration-300">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">
                      {video.title}
                    </h3>
                    <p className="text-gray-400">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-2xl font-semibold text-white mb-8">Singles</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Pullup',
                  year: '2022',
                  cover: '/images/cat.jpg',
                  fanlinkUrl: 'https://fanlink.to/pullup-famousarrel'
                },
                {
                  title: 'Whyne',
                  year: '2023',
                  cover: '/images/cat2.jpg',
                  fanlinkUrl: 'https://fanlink.to/whyne-famousarrel'
                },
                {
                  title: 'Ogologo',
                  year: '2023',
                  cover: '/images/cat3.png',
                  fanlinkUrl: 'https://fanlink.to/ogologo-famousarrel'
                },
                {
                  title: 'Uthando',
                  year: '2024',
                  cover: '/images/Uthando.jpeg',
                  fanlinkUrl: 'https://fanlink.to/uthando-famousarrel'
                }
              ].map((album, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition duration-300"
                >
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold">{album.title}</h3>
                    <p className="text-gray-400">{album.year}</p>
                    <a
                      href={album.fanlinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition text-sm font-medium w-full justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Share Your Thoughts</h2>
                <p className="text-gray-400 text-lg">Join the conversation and connect with other fans</p>
              </div>
              <Comments />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 