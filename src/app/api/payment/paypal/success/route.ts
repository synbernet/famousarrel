import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { PaymentService } from '@/lib/services/PaymentService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');

    if (!token || !payerId) {
      return redirect('/checkout?error=missing_paypal_params');
    }

    // Verify the payment with PayPal
    const result = await PaymentService.verifyPayment(token, 'paypal');

    if (!result.success) {
      return redirect('/checkout?error=payment_failed');
    }

    // Redirect to success page
    return redirect('/checkout?status=success');
  } catch (error) {
    console.error('PayPal success callback error:', error);
    return redirect('/checkout?error=internal_error');
  }
} 