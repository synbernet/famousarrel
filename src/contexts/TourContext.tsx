'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
}

interface TourDate {
  id: string;
  venueId: string;
  date: string;
  time: string;
  ticketPrice: number;
  availableTickets: number;
  isVIP: boolean;
}

interface TourContextType {
  venues: Venue[];
  tourDates: TourDate[];
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  updateVenue: (id: string, venue: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;
  addTourDate: (tourDate: Omit<TourDate, 'id'>) => void;
  updateTourDate: (id: string, tourDate: Partial<TourDate>) => void;
  deleteTourDate: (id: string) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [tourDates, setTourDates] = useState<TourDate[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const savedVenues = localStorage.getItem('venues');
    const savedTourDates = localStorage.getItem('tourDates');
    
    if (savedVenues) {
      setVenues(JSON.parse(savedVenues));
    }
    if (savedTourDates) {
      setTourDates(JSON.parse(savedTourDates));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('venues', JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem('tourDates', JSON.stringify(tourDates));
  }, [tourDates]);

  const addVenue = (venue: Omit<Venue, 'id'>) => {
    const newVenue = {
      ...venue,
      id: Math.random().toString(36).substr(2, 9),
    };
    setVenues([...venues, newVenue]);
  };

  const updateVenue = (id: string, venueUpdate: Partial<Venue>) => {
    setVenues(venues.map(venue => 
      venue.id === id ? { ...venue, ...venueUpdate } : venue
    ));
  };

  const deleteVenue = (id: string) => {
    setVenues(venues.filter(venue => venue.id !== id));
    // Also delete associated tour dates
    setTourDates(tourDates.filter(date => date.venueId !== id));
  };

  const addTourDate = (tourDate: Omit<TourDate, 'id'>) => {
    const newTourDate = {
      ...tourDate,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTourDates([...tourDates, newTourDate]);
  };

  const updateTourDate = (id: string, tourDateUpdate: Partial<TourDate>) => {
    setTourDates(tourDates.map(date => 
      date.id === id ? { ...date, ...tourDateUpdate } : date
    ));
  };

  const deleteTourDate = (id: string) => {
    setTourDates(tourDates.filter(date => date.id !== id));
  };

  return (
    <TourContext.Provider value={{
      venues,
      tourDates,
      addVenue,
      updateVenue,
      deleteVenue,
      addTourDate,
      updateTourDate,
      deleteTourDate,
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
} 