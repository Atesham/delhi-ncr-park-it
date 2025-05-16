
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { MapPin, Users, Calendar, CreditCard, MessageSquare, CarFront } from 'lucide-react';

export default function AdminDashboard() {
  const { locations, bookings, payments, feedbacks, slots } = useData();

  const totalUsers = 10; // Placeholder - would come from users in a real app
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = payments.reduce((total, payment) => total + payment.amount, 0);
  const todayBookings = bookings.filter(booking => {
    const today = new Date();
    const bookingDate = new Date(booking.startTime);
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear()
    );
  }).length;
  
  const recentBookings = [...bookings].sort((a, b) => 
    new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime()
  ).slice(0, 5);
  
  const recentFeedbacks = [...feedbacks].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 3);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage parking locations, bookings, and users
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/admin/bookings">View All Bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/locations">Manage Locations</Link>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {payments.length} payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalBookings} total bookings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings}</div>
            <p className="text-xs text-muted-foreground">
              {todayBookings > 0 ? `${((todayBookings / totalBookings) * 100).toFixed(1)}% of all bookings` : "No bookings today"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active app users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Bookings</CardTitle>
                <Button variant="ghost" asChild size="sm">
                  <Link to="/admin/bookings">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No bookings found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{booking.userName}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin size={14} className="mr-1" /> {booking.locationName}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(booking.startTime).toLocaleDateString()} • {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <div className="mt-1 font-medium">₹{booking.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Parking Locations Overview</CardTitle>
                <Button variant="ghost" asChild size="sm">
                  <Link to="/admin/locations">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations.map(location => {
                  const occupancyPercentage = Math.round(
                    ((location.totalSlots - location.availableSlots) / location.totalSlots) * 100
                  );
                  
                  return (
                    <div key={location.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-md mr-3 flex items-center justify-center">
                          <CarFront size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground">{location.area}, {location.city}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{location.availableSlots} / {location.totalSlots} spots</div>
                        <div className="text-sm text-muted-foreground">
                          {occupancyPercentage}% occupied
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Feedback</CardTitle>
                <Button variant="ghost" asChild size="sm">
                  <Link to="/admin/feedback">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentFeedbacks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No feedback received yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recentFeedbacks.map(feedback => (
                    <div key={feedback.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{feedback.userName}</div>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} filled={i < feedback.rating} />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {feedback.locationName}
                      </div>
                      <p className="text-sm">{feedback.comment}</p>
                      {feedback.adminResponse && (
                        <div className="mt-2 bg-gray-50 p-2 rounded-md text-sm">
                          <div className="font-medium">Admin Response:</div>
                          <p>{feedback.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/bookings">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Bookings
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/locations">
                  <MapPin className="mr-2 h-4 w-4" />
                  Edit Locations
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/payments">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Reports
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/feedback">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Manage Feedback
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2"
      className={filled ? "text-yellow-400" : "text-gray-300"}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
