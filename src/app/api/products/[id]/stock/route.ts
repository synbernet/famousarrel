import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { stock } = await request.json();
    const { id } = params;

    // In a real application, update the database
    // For now, just return success
    return NextResponse.json({ 
      message: 'Stock updated successfully',
      productId: id,
      newStock: stock
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
} 