
import React, { createContext, useContext, useState } from "react";
import { User } from "./AuthContext";

// Types for parking locations and slots
export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  image: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type SlotType = "compact" | "standard" | "large" | "handicapped" | "ev";

export interface ParkingSlot {
  id: string;
  locationId: string;
  number: string;
  type: SlotType;
  floor: number;
  isAvailable: boolean;
  isReserved: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  vehicleNumber: string;
  locationId: string;
  locationName: string;
  slotId: string;
  slotNumber: string;
  bookingTime: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  paymentId?: string;
  paymentMethod?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: "paid" | "refunded" | "failed" | "pending";
  paymentMethod: "credit_card" | "debit_card" | "net_banking" | "upi" | "wallet";
  transactionId: string;
  timestamp: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  bookingId?: string;
  locationId?: string;
  locationName?: string;
  rating: number;
  comment: string;
  timestamp: string;
  status: "visible" | "hidden" | "flagged";
  adminResponse?: string;
}

// Initial dummy data
const initialLocations: ParkingLocation[] = [
  {
    id: "loc-1",
    name: "Connaught Place Parking",
    address: "P Block, Connaught Place",
    area: "Connaught Place",
    city: "New Delhi",
    totalSlots: 150,
    availableSlots: 42,
    pricePerHour: 80,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    amenities: ["24/7 Security", "CCTV", "EV Charging", "Covered Parking"],
    coordinates: {
      lat: 28.6315,
      lng: 77.2167
    }
  },
  {
    id: "loc-2",
    name: "Cyber Hub Parking",
    address: "DLF Cyber City, Phase 2",
    area: "Gurugram",
    city: "Gurugram",
    totalSlots: 200,
    availableSlots: 75,
    pricePerHour: 100,
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be",
    amenities: ["24/7 Security", "CCTV", "Car Wash", "Valet Parking"],
    coordinates: {
      lat: 28.4952,
      lng: 77.0936
    }
  },
  {
    id: "loc-3",
    name: "Noida Sector 18 Parking",
    address: "Sector 18, Noida",
    area: "Sector 18",
    city: "Noida",
    totalSlots: 180,
    availableSlots: 30,
    pricePerHour: 60,
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    amenities: ["CCTV", "Wheelchair Access", "Restrooms"],
    coordinates: {
      lat: 28.5708,
      lng: 77.3219
    }
  },
  {
    id: "loc-4",
    name: "Select Citywalk Parking",
    address: "A-3, District Centre, Saket",
    area: "Saket",
    city: "New Delhi",
    totalSlots: 250,
    availableSlots: 80,
    pricePerHour: 120,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    amenities: ["24/7 Security", "CCTV", "Car Wash", "EV Charging", "Valet"],
    coordinates: {
      lat: 28.5292,
      lng: 77.2197
    }
  }
];

// Generate sample parking slots
function generateSampleSlots(): ParkingSlot[] {
  const slots: ParkingSlot[] = [];
  initialLocations.forEach(location => {
    const totalSlots = location.totalSlots;
    const availableSlots = location.availableSlots;
    
    for (let i = 1; i <= totalSlots; i++) {
      const floor = Math.floor(i / 50) + 1;
      const slotType: SlotType = 
        i % 10 === 0 ? "handicapped" : 
        i % 8 === 0 ? "ev" : 
        i % 5 === 0 ? "large" : 
        i % 3 === 0 ? "compact" : "standard";
      
      slots.push({
        id: `slot-${location.id}-${i}`,
        locationId: location.id,
        number: `${floor}${String.fromCharCode(65 + (i % 26))}-${i % 99 + 1}`,
        type: slotType,
        floor,
        isAvailable: i <= availableSlots,
        isReserved: i > availableSlots && i <= availableSlots + 20
      });
    }
  });
  return slots;
}

// Generate sample bookings
function generateSampleBookings(): Booking[] {
  return [
    {
      id: "booking-1",
      userId: "user-1",
      userName: "Rahul Sharma",
      vehicleNumber: "DL01AB1234",
      locationId: "loc-1",
      locationName: "Connaught Place Parking",
      slotId: "slot-loc-1-5",
      slotNumber: "1E-5",
      bookingTime: "2023-05-15T10:30:00",
      startTime: "2023-05-15T15:00:00",
      endTime: "2023-05-15T18:00:00",
      duration: 3,
      amount: 240,
      status: "completed",
      paymentId: "pay-1",
      paymentMethod: "credit_card"
    },
    {
      id: "booking-2",
      userId: "user-1",
      userName: "Rahul Sharma",
      vehicleNumber: "DL01AB1234",
      locationId: "loc-2",
      locationName: "Cyber Hub Parking",
      slotId: "slot-loc-2-10",
      slotNumber: "1J-10",
      bookingTime: "2023-05-18T09:15:00",
      startTime: "2023-05-18T14:00:00",
      endTime: "2023-05-18T16:00:00",
      duration: 2,
      amount: 200,
      status: "confirmed",
      paymentId: "pay-2",
      paymentMethod: "upi"
    },
    {
      id: "booking-3",
      userId: "user-2",
      userName: "Priya Singh",
      vehicleNumber: "HR26CD5678",
      locationId: "loc-3",
      locationName: "Noida Sector 18 Parking",
      slotId: "slot-loc-3-8",
      slotNumber: "1H-8",
      bookingTime: "2023-05-20T11:45:00",
      startTime: "2023-05-20T16:00:00",
      endTime: "2023-05-20T19:00:00",
      duration: 3,
      amount: 180,
      status: "confirmed",
      paymentId: "pay-3",
      paymentMethod: "debit_card"
    }
  ];
}

// Generate sample payments
function generateSamplePayments(): Payment[] {
  return [
    {
      id: "pay-1",
      bookingId: "booking-1",
      userId: "user-1",
      amount: 240,
      status: "paid",
      paymentMethod: "credit_card",
      transactionId: "txn-12345",
      timestamp: "2023-05-15T10:32:15"
    },
    {
      id: "pay-2",
      bookingId: "booking-2",
      userId: "user-1",
      amount: 200,
      status: "paid",
      paymentMethod: "upi",
      transactionId: "txn-23456",
      timestamp: "2023-05-18T09:17:30"
    },
    {
      id: "pay-3",
      bookingId: "booking-3",
      userId: "user-2",
      amount: 180,
      status: "paid",
      paymentMethod: "debit_card",
      transactionId: "txn-34567",
      timestamp: "2023-05-20T11:48:22"
    }
  ];
}

// Generate sample feedback
function generateSampleFeedback(): Feedback[] {
  return [
    {
      id: "feedback-1",
      userId: "user-1",
      userName: "Rahul Sharma",
      bookingId: "booking-1",
      locationId: "loc-1",
      locationName: "Connaught Place Parking",
      rating: 4,
      comment: "Great parking facility. Security was good and the staff was helpful.",
      timestamp: "2023-05-15T19:10:00",
      status: "visible"
    },
    {
      id: "feedback-2",
      userId: "user-2",
      userName: "Priya Singh",
      bookingId: "booking-3",
      locationId: "loc-3",
      locationName: "Noida Sector 18 Parking",
      rating: 3,
      comment: "The parking was okay, but finding the entrance was a bit confusing.",
      timestamp: "2023-05-20T19:45:00",
      status: "visible",
      adminResponse: "Thank you for your feedback. We're improving our signage."
    }
  ];
}

// Create context interface
interface DataContextType {
  locations: ParkingLocation[];
  slots: ParkingSlot[];
  bookings: Booking[];
  payments: Payment[];
  feedbacks: Feedback[];
  
  // CRUD operations
  addBooking: (booking: Omit<Booking, "id">) => string;
  cancelBooking: (bookingId: string) => void;
  addPayment: (payment: Omit<Payment, "id">) => string;
  addFeedback: (feedback: Omit<Feedback, "id">) => void;
  respondToFeedback: (feedbackId: string, response: string) => void;
  getSlotsByLocation: (locationId: string) => ParkingSlot[];
  getBookingsByUser: (userId: string) => Booking[];
  getBookingDetails: (bookingId: string) => Booking | undefined;
  getUserBookingCount: (userId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<ParkingLocation[]>(initialLocations);
  const [slots, setSlots] = useState<ParkingSlot[]>(generateSampleSlots());
  const [bookings, setBookings] = useState<Booking[]>(generateSampleBookings());
  const [payments, setPayments] = useState<Payment[]>(generateSamplePayments());
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(generateSampleFeedback());

  const addBooking = (bookingData: Omit<Booking, "id">) => {
    const newBookingId = `booking-${Date.now()}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newBookingId
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    // Update slot availability
    setSlots(prev => 
      prev.map(slot => 
        slot.id === bookingData.slotId 
          ? { ...slot, isAvailable: false, isReserved: true } 
          : slot
      )
    );
    
    return newBookingId;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
      // Update booking status
      setBookings(prev => 
        prev.map(b => 
          b.id === bookingId 
            ? { ...b, status: "cancelled" } 
            : b
        )
      );
      
      // Update slot availability
      setSlots(prev => 
        prev.map(slot => 
          slot.id === booking.slotId 
            ? { ...slot, isAvailable: true, isReserved: false } 
            : slot
        )
      );
    }
  };

  const addPayment = (paymentData: Omit<Payment, "id">) => {
    const newPaymentId = `pay-${Date.now()}`;
    const newPayment: Payment = {
      ...paymentData,
      id: newPaymentId
    };
    
    setPayments(prev => [...prev, newPayment]);
    
    // Update booking with payment info
    if (paymentData.bookingId) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === paymentData.bookingId 
            ? { 
                ...booking, 
                status: "confirmed", 
                paymentId: newPaymentId, 
                paymentMethod: paymentData.paymentMethod 
              } 
            : booking
        )
      );
    }
    
    return newPaymentId;
  };

  const addFeedback = (feedbackData: Omit<Feedback, "id">) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}`
    };
    
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  const respondToFeedback = (feedbackId: string, response: string) => {
    setFeedbacks(prev => 
      prev.map(feedback => 
        feedback.id === feedbackId 
          ? { ...feedback, adminResponse: response } 
          : feedback
      )
    );
  };

  const getSlotsByLocation = (locationId: string) => {
    return slots.filter(slot => slot.locationId === locationId);
  };

  const getBookingsByUser = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getBookingDetails = (bookingId: string) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const getUserBookingCount = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId).length;
  };

  return (
    <DataContext.Provider
      value={{
        locations,
        slots,
        bookings,
        payments,
        feedbacks,
        addBooking,
        cancelBooking,
        addPayment,
        addFeedback,
        respondToFeedback,
        getSlotsByLocation,
        getBookingsByUser,
        getBookingDetails,
        getUserBookingCount
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
