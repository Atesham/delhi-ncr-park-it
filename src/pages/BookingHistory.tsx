
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { MapPin, CalendarCheck, Clock } from 'lucide-react';

export default function BookingHistory() {
  const { user } = useAuth();
  const { getBookingsByUser } = useData();
  const [activeTab, setActiveTab] = useState('all');

  const userBookings = user ? getBookingsByUser(user.id) : [];
  
  // Filter bookings based on active tab
  const filteredBookings = userBookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking History</h1>
        <p className="text-gray-600">
          View and manage all your past and upcoming parking bookings
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="confirmed">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredBookings.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="py-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'all'
                    ? "You haven't made any parking bookings yet."
                    : `You don't have any ${activeTab} bookings.`}
                </p>
                <Button asChild>
                  <Link to="/book">Book Parking Now</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{booking.locationName}</h3>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <MapPin size={16} />
                              <span>Slot {booking.slotNumber}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{booking.amount}</div>
                            <div className="text-sm text-gray-600">{booking.duration} hours</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <CalendarCheck size={16} className="text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">Date</div>
                              <div className="text-sm text-gray-600">
                                {new Date(booking.startTime).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">Time</div>
                              <div className="text-sm text-gray-600">
                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t flex flex-wrap gap-3 justify-end">
                          <Button variant="outline" asChild size="sm">
                            <Link to={`/booking/${booking.id}`}>View Details</Link>
                          </Button>
                          
                          {booking.status === 'confirmed' && (
                            <Button variant="destructive" size="sm">
                              Cancel Booking
                            </Button>
                          )}
                          
                          {booking.status === 'completed' && !booking.locationId.includes('feedback') && (
                            <Button asChild size="sm">
                              <Link to={`/feedback/${booking.id}`}>Leave Feedback</Link>
                            </Button>
                          )}
                          
                          {booking.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              Book Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
