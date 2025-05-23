import React, { createContext, useState, useContext, useEffect } from 'react';
import { ParkingSlot, Booking } from '../types';
import { mockParkingSlots, mockBookings } from '../utils/data';
import { useAuth } from './auth-context';

interface ParkingContextType {
  parkingSlots: ParkingSlot[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  getParkingSlotById: (id: string) => ParkingSlot | undefined;
  getUserBookings: () => Booking[];
  createBooking: (parkingSlotId: string, startTime: string, endTime: string) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  createParkingSlot: (parkingSlot: Omit<ParkingSlot, 'id' | 'hostId' | 'hostName'>) => Promise<ParkingSlot | null>;
  getUserHostedParkingSlots: () => ParkingSlot[];
}

const ParkingContext = createContext<ParkingContextType>({
  parkingSlots: [],
  bookings: [],
  loading: false,
  error: null,
  getParkingSlotById: () => undefined,
  getUserBookings: () => [],
  createBooking: async () => null,
  cancelBooking: async () => false,
  createParkingSlot: async () => null,
  getUserHostedParkingSlots: () => [],
});

export const useParking = () => useContext(ParkingContext);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    // Load initial data
    const loadData = () => {
      try {
        // In a real app, these would be API calls
        setParkingSlots(mockParkingSlots);
        setBookings(mockBookings);
        setLoading(false);
      } catch (err) {
        setError('Failed to load parking data');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getParkingSlotById = (id: string): ParkingSlot | undefined => {
    return parkingSlots.find(slot => slot.id === id);
  };

  const getUserBookings = (): Booking[] => {
    if (!user) return [];
    return bookings.filter(booking => booking.userId === user.id);
  };

  const createBooking = async (
    parkingSlotId: string, 
    startTime: string, 
    endTime: string
  ): Promise<Booking | null> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const parkingSlot = getParkingSlotById(parkingSlotId);
      if (!parkingSlot) throw new Error('Parking slot not found');
      
      // Calculate hours difference
      const start = new Date(startTime);
      const end = new Date(endTime);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Calculate total price
      const totalPrice = parkingSlot.pricePerHour * hours;
      
      const newBooking: Booking = {
        id: `b${bookings.length + 1}`,
        parkingSlotId,
        parkingSlotTitle: parkingSlot.title,
        userId: user.id,
        startTime,
        endTime,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would be an API call
      setBookings([...bookings, newBooking]);
      
      return newBooking;
    } catch (error) {
      console.error('Create booking failed', error);
      setError(error instanceof Error ? error.message : 'Failed to create booking');
      return null;
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      return true;
    } catch (error) {
      console.error('Cancel booking failed', error);
      setError('Failed to cancel booking');
      return false;
    }
  };

  const createParkingSlot = async (
    parkingSlotData: Omit<ParkingSlot, 'id' | 'hostId' | 'hostName'>
  ): Promise<ParkingSlot | null> => {
    try {
      if (!user) throw new Error('User not authenticated');
      if (!user.isHost) throw new Error('User is not a host');
      
      const newParkingSlot: ParkingSlot = {
        id: `p${parkingSlots.length + 1}`,
        ...parkingSlotData,
        hostId: user.id,
        hostName: user.name,
      };
      
      // In a real app, this would be an API call
      setParkingSlots([...parkingSlots, newParkingSlot]);
      
      return newParkingSlot;
    } catch (error) {
      console.error('Create parking slot failed', error);
      setError(error instanceof Error ? error.message : 'Failed to create parking slot');
      return null;
    }
  };

  const getUserHostedParkingSlots = (): ParkingSlot[] => {
    if (!user) return [];
    return parkingSlots.filter(slot => slot.hostId === user.id);
  };

  return (
    <ParkingContext.Provider 
      value={{ 
        parkingSlots,
        bookings,
        loading,
        error,
        getParkingSlotById,
        getUserBookings,
        createBooking,
        cancelBooking,
        createParkingSlot,
        getUserHostedParkingSlots,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};