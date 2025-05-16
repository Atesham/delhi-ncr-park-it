
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Car, 
  User, 
  Receipt, 
  Download,
  AlertTriangle
} from 'lucide-react';

export default function BookingDetail() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { getBookingDetails, cancelBooking } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<any>(null);
  const [cancelDialog, setCancelDialog] = useState<boolean>(false);

  useEffect(() => {
    if (bookingId) {
      const bookingDetails = getBookingDetails(bookingId);
      if (bookingDetails) {
        setBooking(bookingDetails);
      } else {
        toast({
          title: "Booking Not Found",
          description: "We couldn't find the booking you're looking for.",
          variant: "destructive",
        });
        navigate('/bookings');
      }
    }
  }, [bookingId, getBookingDetails, navigate, toast]);

  const handleCancelBooking = () => {
    if (!booking) return;
    
    cancelBooking(booking.id);
    
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
      variant: "default",
    });
    
    setCancelDialog(false);
    
    // Refresh booking details
    setBooking({
      ...booking,
      status: "cancelled"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (!booking) {
    return <div className="container py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Booking Details</h1>
            <p className="text-gray-600">Booking ID: {booking.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {booking.status === 'confirmed' && (
              <Button variant="destructive" onClick={() => setCancelDialog(true)}>
                Cancel Booking
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/bookings">Back to Bookings</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold">{booking.locationName}</h2>
                <p className="text-gray-600">Slot {booking.slotNumber}</p>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{new Date(booking.startTime).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm">{booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{booking.locationName}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Car size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{booking.vehicleNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <User size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Booked By</p>
                    <p className="font-medium">{booking.userName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Receipt size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <p className="font-medium">{new Date(booking.bookingTime).toLocaleDateString()}, {new Date(booking.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-3">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{booking.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{booking.paymentId ? "Paid" : "Pending"}</span>
                </div>
                {booking.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium capitalize">
                      {booking.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                )}
                {booking.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{booking.paymentId}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Download Receipt
              </Button>
              
              {booking.status === 'completed' && !booking.locationId.includes('feedback') && (
                <Button asChild>
                  <Link to={`/feedback/${booking.id}`}>Leave Feedback</Link>
                </Button>
              )}
              
              {booking.status === 'completed' && (
                <Button variant="outline">Book Again</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        {booking.status === 'confirmed' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">1</span>
                  </div>
                  <span>Show your booking confirmation at the entrance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">2</span>
                  </div>
                  <span>Follow signs for pre-booked parking to find your spot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">3</span>
                  </div>
                  <span>Your spot is marked with your slot number {booking.slotNumber}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs">4</span>
                  </div>
                  <span>Need help? Contact facility management or the Let's Park It support team.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking at {booking.locationName}?
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-md text-sm">
            <p>Cancellation Policy:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Full refund if cancelled more than 1 hour before start time.</li>
              <li>50% refund if cancelled less than 1 hour before start time.</li>
              <li>No refund if cancelled after the booking has started.</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
