
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Star, MessageSquare, Loader2 } from 'lucide-react';

export default function Feedback() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { getBookingDetails, addFeedback } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  useEffect(() => {
    if (bookingId && user) {
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
  }, [bookingId, user, getBookingDetails, navigate, toast]);

  const handleSubmit = () => {
    if (!user || !booking || rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      addFeedback({
        userId: user.id,
        userName: user.name,
        bookingId: booking.id,
        locationId: booking.locationId,
        locationName: booking.locationName,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        status: "visible"
      });
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for sharing your feedback with us!",
        variant: "default",
      });
      
      navigate('/bookings');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking) {
    return <div className="container py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-secondary mb-4" />
        <h1 className="text-3xl font-bold mb-2">Share Your Feedback</h1>
        <p className="text-gray-600">
          How was your parking experience at {booking.locationName}?
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Your booking details:</div>
            <div className="p-4 bg-muted rounded-md">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{booking.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(booking.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slot:</span>
                  <span className="font-medium">{booking.slotNumber}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="mb-2">
              <label className="block font-medium mb-2">Rate your experience</label>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    className={`cursor-pointer transition-all ${
                      (hoverRating || rating) >= star 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-gray-600">
                {rating === 1 && "Poor"}
                {rating === 2 && "Below Average"}
                {rating === 3 && "Average"}
                {rating === 4 && "Good"}
                {rating === 5 && "Excellent"}
                {rating === 0 && "Select a rating"}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Comments (optional)
            </label>
            <Textarea
              placeholder="Share your experience with this parking location..."
              className="min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/bookings')}>
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
