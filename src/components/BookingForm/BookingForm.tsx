'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const formSchema = z.object({
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Please select an event date'),
  eventTime: z.string().min(1, 'Please select an event time'),
  eventName: z.string().min(1, 'Please enter the event name'),
  venueName: z.string().min(1, 'Please enter the venue name'),
  venueAddress: z.string().min(1, 'Please enter the venue address'),
  eventAttire: z.string().min(1, 'Please specify the event attire'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  performanceType: z.string().min(1, 'Please select a performance type'),
  otherArrangement: z.boolean().default(false),
  paymentMethod: z.enum(['check', 'paypal']),
  equipment: z.array(z.string()),
  travelArrangements: z.string().optional(),
  agreementTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms'
  }),
});

type FormData = z.infer<typeof formSchema>;

const eventTypes = [
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'private', label: 'Private Event' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'concert', label: 'Concert/Performance' },
  { value: 'festival', label: 'Festival' },
  { value: 'other', label: 'Other' }
];

const budgetRanges = [
  { value: '1000-2500', label: '$1,000 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000+', label: '$10,000+' }
];

const performanceTypes = [
  { value: 'speaker', label: 'Guest Speaker', price: 500.00 },
  { value: '15min', label: '15-minute Performance', price: 500.00 },
  { value: '30min', label: '30-minute Performance', price: 1000.00 },
  { value: '60min', label: '60-minute Performance', price: 2000.00 },
  { value: 'voiceover', label: 'Radio/Internet VoiceOver', price: 500.00 },
  { value: 'instrumental', label: 'Custom Produced Instrumental', price: 1500.00 },
];

const equipmentOptions = [
  { value: 'drums', label: 'Full Professional Quality Drum Set w/headphones connected to house mix/CD player' },
  { value: 'mics', label: '2 Microphones' },
  { value: 'screens', label: 'Visual Display Screens' },
  { value: 'sound', label: 'Professional Quality Sound Systems with Speakers and Monitors' },
  { value: 'na', label: 'N/A VoiceOver/Production Request' },
];

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [selectedPerformance, setSelectedPerformance] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipment: [],
      otherArrangement: false,
    }
  });

  const selectedPrice = performanceTypes.find(type => type.value === selectedPerformance)?.price || 0;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically send the data to your backend
      console.log('Booking form data:', data);
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string, error?: string) => `
    w-full bg-gray-800 text-white rounded-lg px-4 py-3 
    border ${error ? 'border-red-500' : 'border-gray-700'}
    transition-all duration-200
    focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-yellow-400'} focus:border-transparent
    ${focusedField === fieldName ? `border-${error ? 'red' : 'yellow'}-400 ring-1 ring-${error ? 'red' : 'yellow'}-400` : ''}
    hover:border-gray-600
    disabled:opacity-50 disabled:cursor-not-allowed
    aria-invalid:border-red-500
  `;

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-gradient-to-b from-gray-900 to-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      noValidate
    >
      <div className="bg-indigo-900/30 text-gray-300 mb-8 p-4 rounded-lg border border-indigo-800/50">
        <p className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          For direct inquiries, please visit our{' '}
          <Link href="/contact" className="text-yellow-400 hover:text-yellow-300 transition-colors mx-1">
            contact page
          </Link>
          {' '}for all contact information.
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-lg border border-indigo-800/30">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Event Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-300 mb-2">
              Event Type <span className="text-yellow-400">*</span>
            </label>
            <select
              id="eventType"
              {...register('eventType')}
              className={`${inputClasses('eventType')} cursor-pointer`}
            >
              <option value="">Select event type</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.label}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p className="mt-1 text-sm text-red-400">{errors.eventType.message}</p>
            )}
          </motion.div>

          <motion.div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-2">
              Event Date & Time <span className="text-yellow-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  id="eventDate"
                  {...register('eventDate')}
                  className={`${inputClasses('eventDate')} cursor-pointer`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.eventDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.eventDate.message}</p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  id="eventTime"
                  {...register('eventTime')}
                  className={`${inputClasses('eventTime')} cursor-pointer`}
                />
                {errors.eventTime && (
                  <p className="mt-1 text-sm text-red-400">{errors.eventTime.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-300 mb-2">
              Name of Event <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              id="eventName"
              {...register('eventName')}
              className={inputClasses('eventName')}
              placeholder="Enter event name"
            />
          </motion.div>

          <motion.div>
            <label htmlFor="venueName" className="block text-sm font-medium text-gray-300 mb-2">
              Name of Venue <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              id="venueName"
              {...register('venueName')}
              className={inputClasses('venueName')}
              placeholder="Enter venue name"
            />
          </motion.div>

          <motion.div>
            <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-300 mb-2">
              Venue Address <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              id="venueAddress"
              {...register('venueAddress')}
              className={inputClasses('venueAddress')}
              placeholder="Enter venue address"
            />
          </motion.div>

          <motion.div>
            <label htmlFor="eventAttire" className="block text-sm font-medium text-gray-300 mb-2">
              Event Attire <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              id="eventAttire"
              {...register('eventAttire')}
              className={inputClasses('eventAttire')}
              placeholder="Specify event attire"
            />
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded-lg border border-purple-800/30">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Your Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={inputClasses('name')}
              placeholder="Enter your name"
            />
          </motion.div>

          <motion.div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              E-mail <span className="text-yellow-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={inputClasses('email')}
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Phone <span className="text-yellow-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className={inputClasses('phone')}
              placeholder="Enter your phone number"
            />
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-900/20 to-red-900/20 p-6 rounded-lg border border-pink-800/30">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Honorarium Pricing
        </h3>
        <div className="space-y-4">
          {performanceTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-3">
              <input
                type="radio"
                id={type.value}
                value={type.value}
                {...register('performanceType')}
                onChange={(e) => setSelectedPerformance(e.target.value)}
                className="text-yellow-400 focus:ring-yellow-400"
              />
              <label htmlFor={type.value} className="text-gray-300">
                {type.label} - ${type.price.toFixed(2)}
              </label>
            </div>
          ))}

          <div className="mt-6 space-y-3">
            <div className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 p-6 rounded-lg border border-indigo-500/50 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-200 font-medium text-lg">Total Amount:</span>
                <span className="text-3xl font-bold text-yellow-400 bg-black/30 px-4 py-2 rounded-lg">${selectedPrice.toFixed(2)}</span>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <p className="text-sm text-yellow-200 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prices based on performance length and do not include travel cost.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 p-6 rounded-lg border border-red-500/50 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-300 mb-1">Deposit Required</h4>
                  <p className="text-yellow-200 font-medium">
                    A <span className="text-red-400 font-bold">50% Non-refundable Deposit</span> is required to guarantee Performance/Speaking date.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-300 mb-2">Is there other arrangement?</p>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('otherArrangement')}
                  value="true"
                  className="text-yellow-400 focus:ring-yellow-400"
                />
                <span className="ml-2 text-gray-300">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('otherArrangement')}
                  value="false"
                  className="text-yellow-400 focus:ring-yellow-400"
                />
                <span className="ml-2 text-gray-300">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-300 mb-4">A 50% Non-refundable Deposit is required to guarantee Performance/Speaking date.</p>
          <p className="text-gray-300 mb-2">Payment Method:</p>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('paymentMethod')}
                value="check"
                className="text-yellow-400 focus:ring-yellow-400"
              />
              <span className="ml-2 text-gray-300">I will send a check made payable to Fine Art Music Empire</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('paymentMethod')}
                value="paypal"
                className="text-yellow-400 focus:ring-yellow-400"
              />
              <span className="ml-2 text-gray-300">Email me an invoice via Paypal</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 p-6 rounded-lg border border-red-800/30">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Equipment Requirements
        </h3>
        <div className="space-y-3">
          <p className="text-gray-300 mb-4">For performances, the artist requires the following equipment. Please check all that you will supply:</p>
          {equipmentOptions.map((option) => (
            <label key={option.value} className="flex items-start space-x-3">
              <input
                type="checkbox"
                value={option.value}
                {...register('equipment')}
                className="mt-1 text-yellow-400 focus:ring-yellow-400"
              />
              <span className="text-gray-300">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 p-6 rounded-lg border border-orange-800/30">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Travel Arrangements
        </h3>
        <div className="mt-8">
          <label htmlFor="travelArrangements" className="block text-sm font-medium text-gray-300 mb-2">
            Travel Arrangements
          </label>
          <textarea
            id="travelArrangements"
            {...register('travelArrangements')}
            className={`${inputClasses('travelArrangements')} h-32`}
            placeholder="Please provide any travel arrangement details"
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('agreementTerms')}
            className="mt-1 text-yellow-400 focus:ring-yellow-400"
          />
          <span className="text-gray-300">
            I agree to pay in full all financial obligations including travel expenses due to Fine Art Music Empire prior to the performance.
            I agree to make checks payable to Fine Art Music Empire.
          </span>
        </label>
        {errors.agreementTerms && (
          <p className="mt-1 text-sm text-red-500">{errors.agreementTerms.message}</p>
        )}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 px-6 rounded-lg
            transition-all duration-200
            hover:from-yellow-500 hover:to-yellow-600
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed
            text-lg
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Booking Request'
          )}
        </button>
      </div>

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-900 to-emerald-900 text-emerald-200 rounded-lg border border-green-800"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Your booking request has been submitted successfully. We'll get back to you soon.
          </div>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-red-900 to-rose-900 text-rose-200 rounded-lg border border-red-800"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            There was an error submitting your request. Please try again later.
          </div>
        </motion.div>
      )}
    </motion.form>
  );
} 