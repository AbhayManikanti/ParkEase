// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isHost: boolean;
  createdAt: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Parking slot types
export interface ParkingSlot {
  id: string;
  title: string;
  description: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  dimensions: {
    width: number;
    length: number;
    height?: number;
  };
  pricePerHour: number;
  availableFrom: string;
  availableTo: string;
  imageUrl: string;
  hostId: string;
  hostName: string;
  amenities: string[];
  restrictions?: string[];
  rating?: number;
  reviewCount?: number;
}

// Booking types
export interface Booking {
  id: string;
  parkingSlotId: string;
  parkingSlotTitle: string;
  userId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// Navigation types
export type TabParamList = {
  index: undefined;
  explore: undefined;
  bookings: undefined;
  host: undefined;
  account: undefined;
}