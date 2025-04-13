import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { subscribeRouter } from './routes/subscribe';
import { contactRouter } from './routes/contact';
import { bookingRouter } from './routes/booking';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/subscribe', subscribeRouter);
app.use('/api/contact', contactRouter);
app.use('/api/booking', bookingRouter);

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/famous-arrel';

const startServer = async () => {
  try {
    // Verify email configuration
    const isEmailConfigValid = await verifyEmailConfig();
    if (!isEmailConfigValid) {
      console.error('Email configuration is invalid. Please check your environment variables.');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Email configuration verified successfully');
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer(); 