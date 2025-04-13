import { Router, Request, Response } from 'express';
import { Contact } from '../models/Contact';
import { sendContactNotification } from '../utils/email';

export const contactRouter = Router();

interface ContactRequest {
  name: string;
  email: string;
  inquiryType: 'General Inquiry' | 'Booking' | 'Media' | 'Other';
  subject: string;
  message: string;
}

contactRouter.post('/', async (req: Request<{}, {}, ContactRequest>, res: Response) => {
  try {
    // Validate request body
    const { name, email, inquiryType, subject, message } = req.body;
    
    if (!name || !email || !inquiryType || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create new contact entry
    const contact = await Contact.create({
      name,
      email,
      inquiryType,
      subject,
      message,
    });

    // Send email notifications
    await sendContactNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: contact,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    
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
      message: 'Failed to send message. Please try again later.',
    });
  }
}); 