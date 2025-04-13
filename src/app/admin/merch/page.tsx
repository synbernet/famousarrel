'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMerch } from '@/contexts/MerchContext';

interface FormData {
  name: string;
  price: string;
  description: string;
  stock: string;
  category: 'clothing' | 'accessories' | 'music' | 'other';
  image: File | null;
  imageFileName: string;
}

export default function MerchManagement() {
  const { merchItems, addItem, updateItem, deleteItem, toggleFeature } = useMerch();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof merchItems[0] | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: 'clothing',
    image: null,
    imageFileName: ''
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({
        ...formData,
        image: file,
        imageFileName: file.name
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imageFileName: file.name
      });
    }
  };

  const handleEdit = (item: typeof merchItems[0]) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      stock: item.stock.toString(),
      category: item.category,
      image: null,
      imageFileName: item.image || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imagePath = editingItem?.image;

      if (formData.image) {
        // Create FormData for image upload
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image);

        // Upload image through API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        imagePath = data.imagePath;
      }

      const itemData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: parseInt(formData.stock),
        category: formData.category,
        image: imagePath,
        featured: editingItem?.featured || false
      };

      if (editingItem) {
        updateItem(editingItem.id, itemData);
      } else {
        addItem(itemData);
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: 'clothing',
        image: null,
        imageFileName: ''
      });
    } catch (error) {
      console.error('Error saving merchandise:', error);
      alert('Failed to save merchandise. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Merchandise Management</h1>
          <p className="text-gray-400">Manage your store items</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              name: '',
              price: '',
              description: '',
              stock: '',
              category: 'clothing',
              image: null,
              imageFileName: ''
            });
            setShowModal(true);
          }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Item</span>
        </button>
      </div>

      <div className="grid gap-6">
        {merchItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <div className="flex space-x-4 text-sm text-gray-400">
                    <span>${item.price.toFixed(2)}</span>
                    <span>{item.stock} in stock</span>
                    <span className="capitalize">{item.category}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleFeature(item.id)}
                  className={`px-3 py-1 rounded ${
                    item.featured
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-yellow-400/20'
                  }`}
                >
                  {item.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
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
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                <label className="block text-gray-400 mb-2">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FormData['category'] })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
                  required
                >
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="music">Music</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  {editingItem ? 'Update Image (Optional)' : 'Image'}
                </label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-yellow-400 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageSelect}
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
                        {editingItem
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
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      price: '',
                      description: '',
                      stock: '',
                      category: 'clothing',
                      image: null,
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
                  {editingItem ? 'Update' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 