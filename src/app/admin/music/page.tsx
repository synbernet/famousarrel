'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  duration: string;
  releaseDate: string;
  audioFile?: string;
  coverImage?: string;
  featured: boolean;
  lyrics?: string;
  genre: string;
  description: string;
}

const initialTracks: Track[] = [
  {
    id: '1',
    title: 'Desert Nights',
    duration: '4:32',
    releaseDate: '2024-01-15',
    genre: 'World Fusion',
    description: 'A mesmerizing blend of traditional and modern sounds',
    featured: true
  },
  {
    id: '2',
    title: 'Sahara Dreams',
    duration: '5:15',
    releaseDate: '2024-01-10',
    genre: 'World Music',
    description: 'Journey through the mystical sounds of the desert',
    featured: false
  }
];

export default function MusicManagement() {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [showModal, setShowModal] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    releaseDate: '',
    genre: '',
    description: '',
    lyrics: '',
    audioFile: null as File | null,
    coverImage: null as File | null,
    audioFileName: '',
    imageFileName: ''
  });
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'audio' | 'image'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        [type === 'audio' ? 'audioFile' : 'coverImage']: file,
        [type === 'audio' ? 'audioFileName' : 'imageFileName']: file.name
      });
    }
  };

  const handleFileDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: 'audio' | 'image'
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({
        ...formData,
        [type === 'audio' ? 'audioFile' : 'coverImage']: file,
        [type === 'audio' ? 'audioFileName' : 'imageFileName']: file.name
      });
    }
  };

  const handleEdit = (track: Track) => {
    setEditingTrack(track);
    setFormData({
      title: track.title,
      duration: track.duration,
      releaseDate: track.releaseDate,
      genre: track.genre,
      description: track.description,
      lyrics: track.lyrics || '',
      audioFile: null,
      coverImage: null,
      audioFileName: track.audioFile || '',
      imageFileName: track.coverImage || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let audioPath = editingTrack?.audioFile;
      let imagePath = editingTrack?.coverImage;

      if (formData.audioFile) {
        const audioFormData = new FormData();
        audioFormData.append('audio', formData.audioFile);
        const audioResponse = await fetch('/api/upload', {
          method: 'POST',
          body: audioFormData
        });
        if (!audioResponse.ok) throw new Error('Failed to upload audio');
        const audioData = await audioResponse.json();
        audioPath = audioData.filePath;
      }

      if (formData.coverImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.coverImage);
        const imageResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        });
        if (!imageResponse.ok) throw new Error('Failed to upload image');
        const imageData = await imageResponse.json();
        imagePath = imageData.filePath;
      }

      const newTrack: Track = {
        id: editingTrack?.id || Date.now().toString(),
        title: formData.title,
        duration: formData.duration,
        releaseDate: formData.releaseDate,
        genre: formData.genre,
        description: formData.description,
        lyrics: formData.lyrics,
        audioFile: audioPath,
        coverImage: imagePath,
        featured: editingTrack?.featured || false
      };

      if (editingTrack) {
        setTracks(prev =>
          prev.map(track => (track.id === editingTrack.id ? newTrack : track))
        );
      } else {
        setTracks(prev => [newTrack, ...prev]);
      }

      setShowModal(false);
      setEditingTrack(null);
      setFormData({
        title: '',
        duration: '',
        releaseDate: '',
        genre: '',
        description: '',
        lyrics: '',
        audioFile: null,
        coverImage: null,
        audioFileName: '',
        imageFileName: ''
      });
    } catch (error) {
      console.error('Error saving track:', error);
      alert('Failed to save track. Please try again.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this track?')) {
      setTracks(prev => prev.filter(track => track.id !== id));
    }
  };

  const toggleFeature = (id: string) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === id ? { ...track, featured: !track.featured } : track
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Music Management</h1>
          <p className="text-gray-400">Manage your music tracks</p>
        </div>
        <button
          onClick={() => {
            setEditingTrack(null);
            setFormData({
              title: '',
              duration: '',
              releaseDate: '',
              genre: '',
              description: '',
              lyrics: '',
              audioFile: null,
              coverImage: null,
              audioFileName: '',
              imageFileName: ''
            });
            setShowModal(true);
          }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Track</span>
        </button>
      </div>

      <div className="grid gap-6">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {track.coverImage ? (
                    <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{track.title}</h3>
                  <div className="flex space-x-4 text-sm text-gray-400">
                    <span>{track.duration}</span>
                    <span>{track.genre}</span>
                    <span>{new Date(track.releaseDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{track.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleFeature(track.id)}
                  className={`px-3 py-1 rounded ${
                    track.featured
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-yellow-400/20'
                  }`}
                >
                  {track.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => handleEdit(track)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(track.id)}
                  className="text-gray-400 hover:text-red-400 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingTrack ? 'Edit Track' : 'Add New Track'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
                  required
                  placeholder="e.g., 3:45"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Release Date</label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Lyrics (Optional)</label>
                <textarea
                  value={formData.lyrics}
                  onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400 resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  {editingTrack ? 'Update Audio File (Optional)' : 'Audio File'}
                </label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-yellow-400 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFileDrop(e, 'audio')}
                  onClick={() => audioInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={(e) => handleFileSelect(e, 'audio')}
                    accept="audio/*"
                    className="hidden"
                  />
                  {formData.audioFileName ? (
                    <p className="text-yellow-400">{formData.audioFileName}</p>
                  ) : (
                    <div>
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <p className="text-gray-400">
                        {editingTrack
                          ? 'Drag and drop new audio file here or click to browse'
                          : 'Drag and drop audio file here or click to browse'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  {editingTrack ? 'Update Cover Image (Optional)' : 'Cover Image'}
                </label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-yellow-400 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFileDrop(e, 'image')}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={(e) => handleFileSelect(e, 'image')}
                    accept="image/*"
                    className="hidden"
                  />
                  {formData.imageFileName ? (
                    <p className="text-yellow-400">{formData.imageFileName}</p>
                  ) : (
                    <div>
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400">
                        {editingTrack
                          ? 'Drag and drop new image here or click to browse'
                          : 'Drag and drop image here or click to browse'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTrack(null);
                    setFormData({
                      title: '',
                      duration: '',
                      releaseDate: '',
                      genre: '',
                      description: '',
                      lyrics: '',
                      audioFile: null,
                      coverImage: null,
                      audioFileName: '',
                      imageFileName: ''
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300"
                >
                  {editingTrack ? 'Update' : 'Add Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 