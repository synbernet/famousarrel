import { NextResponse } from 'next/server';

// Pricing data
const PRICING = {
  'Guest Speaker': 500.00,
  '15-minute Performance': 500.00,
  '30-minute Performance': 1000.00,
  '60-minute Performance': 2000.00,
  'Radio/Internet VoiceOver': 500.00,
  'Custom Produced Instrumental': 1500.00
};

export async function GET() {
  return NextResponse.json(PRICING);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Make API call to backend
    const response = await fetch('http://localhost:5000/api/booking/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit booking');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit booking' },
      { status: 500 }
    );
  }
} 