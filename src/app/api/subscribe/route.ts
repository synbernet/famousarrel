import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Make API call to backend
    const response = await fetch('http://localhost:5000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to subscribe' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to the subscription service. Please try again later.' },
      { status: 500 }
    );
  }
} 