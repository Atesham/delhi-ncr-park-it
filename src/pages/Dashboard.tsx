
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CarFront, CalendarCheck, Clock, MapPin, Star, History } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { getBookingsByUser, getUserBookingCount, locations } = useData();

  const userBookings = user ? getBookingsByUser(user.id) : [];
  const activeBookings = userBookings.filter(
    booking => booking.status === 'confirmed' || booking.status === 'pending'
  );
  const bookingCount = user ? getUserBookingCount(user.id) : 0;
  
  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}</h1>
          <p className="text-gray-600">Manage your parking bookings and account</p>
        </div>
        <Button asChild>
          <Link to="/book">Book New Parking</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeBookings.length === 0 ? "No active bookings" : 
               activeBookings.length === 1 ? "1 parking spot reserved" : 
               `${activeBookings.length} parking spots reserved`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingCount}</div>
            <p className="text-xs text-muted-foreground">
              {bookingCount === 0 ? "No booking history" : 
               bookingCount === 1 ? "1 booking made so far" : 
               `${bookingCount} bookings made so far`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Vehicle</CardTitle>
            <CarFront className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.vehicle?.number || "Not Added"}</div>
            <p className="text-xs text-muted-foreground">
              {user.vehicle?.type || "Add your vehicle details"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Active Bookings</h2>
          
          {activeBookings.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="py-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active bookings</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any upcoming or active parking reservations.
                </p>
                <Button asChild>
                  <Link to="/book">Book Parking Now</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBookings.map(booking => {
                const location = locations.find(loc => loc.id === booking.locationId);
                
                return (
                  <Card key={booking.id} className="hover-scale">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{booking.locationName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin size={16} />
                            <span>{location?.area}, {location?.city}</span>
                          </div>
                        </div>
                        <Badge 
                          className={booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'} 
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Spot:</span>
                          <span className="font-medium">{booking.slotNumber}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium">{booking.vehicleNumber}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Date & Time:</span>
                          <span className="font-medium">
                            {new Date(booking.startTime).toLocaleDateString()} • {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{booking.duration} hours</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="font-semibold">₹{booking.amount}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" asChild size="sm">
                            <Link to={`/booking/${booking.id}`}>Details</Link>
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.slice(0, 3).map(location => (
              <Card key={location.id} className="hover-scale">
                <div className="h-36 overflow-hidden">
                  <img 
                    src={location.image} 
                    alt={location.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{location.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span>{location.area}, {location.city}</span>
                  </div>
                  <Button asChild size="sm" className="w-full">
                    <Link to={`/book/${location.id}`}>Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
