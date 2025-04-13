'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ShoppingCart from '@/components/ShoppingCart/ShoppingCart';
import { useMerch } from '@/contexts/MerchContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
}

interface ClothingProduct extends BaseProduct {
  sizes: string[];
}

interface OtherProduct extends BaseProduct {
  sizes?: never;
}

type Product = ClothingProduct;

// Mock product data (updated to include multiple images per product)
const products: Product[] = [
  {
    id: '1',
    name: 'Brown Classic Logo Hoodie',
    description: 'Crafted from premium cotton for a comfortable and stylish fit.',
    price: 54.99,
    images: [
      '/images/merch/brownhoodie_front.jpg',
      '/images/merch/brownhoodie_back.jpg',
    ],
    stock: 50,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'Black Classic Logo Hoodie',
    description: 'Made with premium cotton for a sleek, comfortable fit',
    price: 54.99,
    images: [
      '/images/merch/blackhoodie_front.jpg',
      '/images/merch/blackhoodie_back.jpg',
    ],
    stock: 30,
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: '1-copy',
    name: 'White Classic Logo T-Shirt',
    description: 'Designed with soft cotton for a fresh, comfortable feel.',
    price: 34.99,
    images: [
      '/images/merch/whiteroundneck_front.jpg',
      '/images/merch/whiteroundneck_back.jpg',
    ],
    stock: 40,
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '2-copy',
    name: 'Black Classic Logo Tee',
    description: 'Made with soft cotton for a cool, comfortable fit.',
    price: 34.99,
    images: [
      '/images/merch/blackroundneck_front.jpg',
      '/images/merch/blackroundneck_back.jpg',
    ],
    stock: 25,
    sizes: ['L', 'XL', 'XXL'],
  },
];

export default function MerchPage() {
  const { products: contextProducts, addToCart, error } = useMerch();
  const { state: cartState } = useCart();
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  const filteredProducts = products;

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, selectedSize[product.id]);
  };

  const nextImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-40">
      {/* Cart Preview Button */}
      <div className="fixed top-32 right-4 z-40">
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 hover:bg-yellow-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-semibold">Cart ({cartState.items.length})</span>
          {cartState.total > 0 && (
            <span className="font-bold">${cartState.total.toFixed(2)}</span>
          )}
        </button>
      </div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Official Merchandise</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            When you wear our merchandise, you're not just getting clothes—you're becoming part of our artistic journey. Each piece is carefully crafted to bring you closer to the music and the message behind it. By choosing our premium-quality merch, you're not only supporting our creative vision but also wearing a piece of our story. Let's create memories together through these unique designs.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative aspect-square group">
                <Image
                  src={product.images[currentImageIndex[product.id] || 0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Image Navigation Buttons */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      prevImage(product.id, product.images.length);
                    }}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nextImage(product.id, product.images.length);
                    }}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {/* Image Indicator Dots */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(prev => ({ ...prev, [product.id]: index }));
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        (currentImageIndex[product.id] || 0) === index
                          ? 'bg-yellow-400'
                          : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                    Only {product.stock} left!
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4">{product.description}</p>
                
                <div className="mb-4">
                  <label className="text-white mb-2 block">Select Size:</label>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize({ ...selectedSize, [product.id]: size })}
                        className={`px-3 py-1 rounded-lg ${
                          selectedSize[product.id] === size
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        } transition-colors`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-yellow-400">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    disabled={product.stock === 0}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Slide-over */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
} 