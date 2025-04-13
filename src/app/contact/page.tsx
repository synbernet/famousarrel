'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

type InquiryType = 'general' | 'booking' | 'merch' | 'press' | 'other';

interface ContactForm {
  name: string;
  email: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    inquiryType: 'general',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        inquiryType: 'general',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-40">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-gray-400 text-lg">
              Have a question or inquiry? We'd love to hear from you. Fill out the form below
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Inquiry Type */}
            <div>
              <label htmlFor="inquiryType" className="block text-white mb-2">Type of Inquiry</label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors"
              >
                <option value="general">General Inquiry</option>
                <option value="booking">Booking & Events</option>
                <option value="merch">Merchandise Support</option>
                <option value="press">Press & Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-white mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors"
                placeholder="What's your message about?"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-white mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors resize-none"
                placeholder="Type your message here..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </div>
          </form>

          {/* Additional Contact Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400 text-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400">contact@yourartist.com</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400 text-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400 text-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-400">Los Angeles, CA</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 