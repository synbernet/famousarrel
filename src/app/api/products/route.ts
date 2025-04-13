import { NextResponse } from 'next/server';

// Mock data (replace with database calls later)
const products = [
  {
    id: '1',
    name: 'Classic Logo T-Shirt',
    description: 'Premium cotton t-shirt with embroidered logo',
    price: 29.99,
    image: '/images/merch/tshirt.jpg',
    stock: 50,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'Desert Vibes Hoodie',
    description: 'Cozy hoodie with unique desert-inspired design',
    price: 59.99,
    image: '/images/merch/hoodie.jpg',
    stock: 30,
    sizes: ['M', 'L', 'XL'],
  }
];

export async function GET() {
  try {
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate and process the product data
    // Add to database (mock for now)
    return NextResponse.json({ message: 'Product created successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 