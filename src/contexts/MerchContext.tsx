'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCart } from './CartContext';
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
  category: string;
}

type Product = ClothingProduct | OtherProduct;

interface MerchContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number, size?: string) => void;
  updateStock: (productId: string, newStock: number) => void;
  fetchProducts: () => Promise<void>;
}

const MerchContext = createContext<MerchContextType | null>(null);

export function MerchProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart: addToCartContext } = useCart();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (product: Product, quantity: number, size?: string) => {
    try {
      // Check if it's a clothing product and requires size
      if ('sizes' in product && !size) {
        toast.error('Please select a size');
        return;
      }

      if (product.stock < quantity) {
        toast.error('Not enough stock available');
        return;
      }

      // Update stock in the backend
      const response = await fetch(`/api/products/${product.id}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: product.stock - quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      // Update local state
      updateStock(product.id, product.stock - quantity);

      // Add to cart with the first image from the images array
      addToCartContext({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        size,
      });

      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: newStock }
          : product
      )
    );
  };

  return (
    <MerchContext.Provider
      value={{
        products,
        isLoading,
        error,
        addToCart,
        updateStock,
        fetchProducts,
      }}
    >
      {children}
    </MerchContext.Provider>
  );
}

export function useMerch() {
  const context = useContext(MerchContext);
  if (!context) {
    throw new Error('useMerch must be used within a MerchProvider');
  }
  return context;
} 