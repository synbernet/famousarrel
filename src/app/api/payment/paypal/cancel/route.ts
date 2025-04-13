import { redirect } from 'next/navigation';

export async function GET() {
  return redirect('/checkout?status=cancelled');
} 