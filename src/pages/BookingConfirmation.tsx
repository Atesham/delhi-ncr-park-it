
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';

export default function BookingConfirmation() {
  const location = useLocation();
  const { booking, paymentId } = location.state || {};
  
  // If no booking data is available, redirect to bookings page
  if (!booking) {
    return <Navigate to="/bookings" replace />;
  }
  
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-3 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">
          Your parking spot has been reserved successfully
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Booking Details</h2>
                <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to={`/booking/${booking.id}`}>View Details</Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Parking Location</p>
                  <p className="font-semibold">{booking.locationName}</p>
                  <p className="text-sm">Parking Slot: {booking.slotNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{new Date(booking.startTime).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Time & Duration</p>
                  <p className="font-semibold">
                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm">{booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-semibold">₹{booking.amount} (Paid)</p>
                  <p className="text-sm">Transaction ID: {paymentId || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="font-semibold">Instructions</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Show this booking confirmation at the parking entrance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Arrive within 15 minutes of your booking start time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your parking spot will be reserved for the entire duration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You can cancel your booking up to 1 hour before the start time.</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button asChild className="flex-1">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/bookings">View All Bookings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
