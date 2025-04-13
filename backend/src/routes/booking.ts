import { Router, Request, Response } from 'express';
import { Booking, IBooking } from '../models/Booking';
import { sendBookingNotification } from '../utils/bookingEmail';

export const bookingRouter = Router();

// Package prices
const PACKAGE_PRICES = {
  'Guest Speaker': 500,
  '15-minute Performance': 500,
  '30-minute Performance': 1000,
  '60-minute Performance': 2000,
  'Radio/Internet VoiceOver': 500,
  'Custom Produced Instrumental': 1500,
};

interface BookingRequest extends Omit<IBooking, 'status' | 'depositPaid' | 'createdAt'> {
  selectedPackageType: keyof typeof PACKAGE_PRICES;
}

bookingRouter.post('/', async (req: Request<{}, {}, BookingRequest>, res: Response) => {
  try {
    // Extract and validate the package type
    const { selectedPackageType, ...bookingData } = req.body;
    const packagePrice = PACKAGE_PRICES[selectedPackageType];

    if (!packagePrice) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package type selected',
      });
    }

    // Calculate deposit amount (50% of total)
    const depositAmount = packagePrice * 0.5;

    // Create booking object
    const booking = await Booking.create({
      ...bookingData,
      selectedPackage: {
        type: selectedPackageType,
        price: packagePrice,
      },
      totalAmount: packagePrice,
      depositAmount,
      status: 'pending',
      depositPaid: false,
    });

    // Send email notifications
    await sendBookingNotification(booking);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully!',
      data: {
        bookingId: booking._id,
        depositAmount,
        totalAmount: packagePrice,
      },
    });
  } catch (error) {
    console.error('Booking error:', error);

    // Handle mongoose validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as any;
      return res.status(400).json({
        success: false,
        message: Object.values(validationError.errors)
          .map((err: any) => err.message)
          .join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit booking request. Please try again later.',
    });
  }
});

// Get booking status
bookingRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id).select('status depositPaid');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: {
        status: booking.status,
        depositPaid: booking.depositPaid,
      },
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking status',
    });
  }
}); 