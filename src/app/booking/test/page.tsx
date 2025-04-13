'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface PricingData {
  [key: string]: number;
}

interface BookingFormData {
  eventType: string;
  eventDateTime: string;
  eventName: string;
  venueName: string;
  venueAddress: string;
  eventAttire: string;
  name: string;
  email: string;
  phone: string;
  selectedServices: string[];
  totalAmount: number;
  otherArrangement: boolean;
  paymentMethod: 'check' | 'paypal';
  equipment: {
    drumSet: boolean;
    microphones: boolean;
    visualDisplays: boolean;
    soundSystem: boolean;
    notApplicable: boolean;
  };
  travelArrangements: string;
}

export default function BookingTestPage() {
  const [pricing, setPricing] = useState<PricingData>({});
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();

  // Fetch pricing data
  useEffect(() => {
    fetch('/api/booking/pricing')
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error('Error fetching pricing:', err));
  }, []);

  // Watch for changes in selected services to calculate total
  const selectedServices = watch('selectedServices', []);
  const totalAmount = selectedServices?.reduce((sum, service) => sum + (pricing[service] || 0), 0) || 0;

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [totalAmount, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Booking request submitted successfully!');
      } else {
        throw new Error(result.error || 'Failed to submit booking');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Booking Request Form (Test)</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Event Details</h2>
          
          <div>
            <label className="block mb-2">Event Type *</label>
            <select
              {...register('eventType', { required: 'Event type is required' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select event type</option>
              {Object.keys(pricing).map(type => (
                <option key={type} value={type}>{type} - ${pricing[type]}</option>
              ))}
            </select>
            {errors.eventType && (
              <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Event Date & Time *</label>
            <input
              type="datetime-local"
              {...register('eventDateTime', { required: 'Event date and time are required' })}
              className="w-full p-2 border rounded"
            />
            {errors.eventDateTime && (
              <p className="text-red-500 text-sm mt-1">{errors.eventDateTime.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Event Name *</label>
            <input
              type="text"
              {...register('eventName', { required: 'Event name is required' })}
              placeholder="Enter event name"
              className="w-full p-2 border rounded"
            />
            {errors.eventName && (
              <p className="text-red-500 text-sm mt-1">{errors.eventName.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Venue Name *</label>
            <input
              type="text"
              {...register('venueName', { required: 'Venue name is required' })}
              placeholder="Enter venue name"
              className="w-full p-2 border rounded"
            />
            {errors.venueName && (
              <p className="text-red-500 text-sm mt-1">{errors.venueName.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Venue Address *</label>
            <input
              type="text"
              {...register('venueAddress', { required: 'Venue address is required' })}
              placeholder="Enter venue address"
              className="w-full p-2 border rounded"
            />
            {errors.venueAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.venueAddress.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Event Attire *</label>
            <input
              type="text"
              {...register('eventAttire', { required: 'Event attire is required' })}
              placeholder="Specify event attire"
              className="w-full p-2 border rounded"
            />
            {errors.eventAttire && (
              <p className="text-red-500 text-sm mt-1">{errors.eventAttire.message}</p>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Information</h2>
          
          <div>
            <label className="block mb-2">Your Name *</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter your name"
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">E-mail *</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Phone *</label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              placeholder="Enter your phone number"
              className="w-full p-2 border rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Services and Pricing */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Services and Pricing</h2>
          
          <div>
            <label className="block mb-2">Select Services *</label>
            <div className="space-y-2">
              {Object.entries(pricing).map(([service, price]) => (
                <div key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    value={service}
                    {...register('selectedServices')}
                    className="mr-2"
                  />
                  <label>{service} - ${price}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xl font-semibold">Total Amount: ${totalAmount}</p>
            <p className="text-sm text-gray-600">50% Non-refundable Deposit Required: ${totalAmount / 2}</p>
          </div>

          <div>
            <label className="block mb-2">Other Arrangement Needed?</label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="true"
                  {...register('otherArrangement')}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="false"
                  {...register('otherArrangement')}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-2">Payment Method *</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="check"
                  {...register('paymentMethod', { required: 'Payment method is required' })}
                  className="mr-2"
                />
                I will send a check made payable to Fine Art Music Empire
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="paypal"
                  {...register('paymentMethod', { required: 'Payment method is required' })}
                  className="mr-2"
                />
                Email me an invoice via Paypal
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
            )}
          </div>
        </div>

        {/* Equipment Requirements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Equipment Requirements</h2>
          <p className="text-sm text-gray-600">For performances, the artist requires the following equipment. Please check all that you will supply:</p>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('equipment.drumSet')}
                className="mr-2"
              />
              Full Professional Quality Drum Set w/headphones connected to house mix/CD player
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('equipment.microphones')}
                className="mr-2"
              />
              2 Microphones
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('equipment.visualDisplays')}
                className="mr-2"
              />
              Visual Display Screens
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('equipment.soundSystem')}
                className="mr-2"
              />
              Professional Quality Sound Systems with Speakers and Monitors
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('equipment.notApplicable')}
                className="mr-2"
              />
              N/A VoiceOver/Production Request
            </label>
          </div>
        </div>

        {/* Travel Arrangements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Travel Arrangements</h2>
          
          <div>
            <label className="block mb-2">Travel Arrangement Details</label>
            <textarea
              {...register('travelArrangements')}
              placeholder="Please provide any travel arrangement details"
              className="w-full p-2 border rounded h-32"
            />
          </div>
        </div>

        {/* Agreement and Submit */}
        <div className="space-y-4">
          <p className="text-sm">
            By submitting this form, I agree to pay in full all financial obligations including travel expenses due to Fine Art Music Empire prior to the performance. I agree to make checks payable to Fine Art Music Empire.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </div>
      </form>
    </div>
  );
} 