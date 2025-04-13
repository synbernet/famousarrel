import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/PaymentService';
import type { PaymentDetails } from '@/lib/services/PaymentService';

export async function POST(request: Request) {
  try {
    const { paymentDetails, orderDetails } = await request.json();

    // Validate request data
    if (!paymentDetails || !orderDetails) {
      return NextResponse.json(
        { error: 'Missing payment or order details' },
        { status: 400 }
      );
    }

    // Process the payment
    const result = await PaymentService.processPayment(paymentDetails);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function storeOrder(orderData: any): Promise<void> {
  // Implement order storage in your database
  // This should be implemented with your database of choice (e.g., PostgreSQL, MongoDB)
} 