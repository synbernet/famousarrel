'use client';

import BookingForm from '@/components/BookingForm/BookingForm';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Book Famous Arrel</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Looking to bring unique musical experience to your event? Fill out the form below
              and we'll get back to you with availability and pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Corporate Events</h3>
              <p className="text-gray-400">Perfect for company parties, product launches, and team building events</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Private Events</h3>
              <p className="text-gray-400">Ideal for weddings, birthdays, and special celebrations</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Public Shows</h3>
              <p className="text-gray-400">Available for festivals, concerts, and public performances</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Request Form</h2>
            <BookingForm />
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">What to Expect</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Response within 24-48 hours
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Detailed pricing and availability
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Customized performance options
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Technical requirements list
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Common Questions</h3>
              <div className="space-y-4 text-gray-400">
                <div>
                  <h4 className="font-semibold text-white">What's your typical performance duration?</h4>
                  <p>Standard performances are 2 hours, but can be customized based on your needs.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Do you provide sound equipment?</h4>
                  <p>Yes, we can provide sound equipment for most venues. Details will be discussed after booking.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">How far do you travel?</h4>
                  <p>Available for events worldwide. Travel costs will be included in the quote.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 