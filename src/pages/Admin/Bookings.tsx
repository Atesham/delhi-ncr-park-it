
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useData, Booking } from '@/contexts/DataContext';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  MoreHorizontal,
  CalendarCheck,
  MapPin,
  Car
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function AdminBookings() {
  const { bookings } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter bookings based on search and status filter
  const filteredBookings = bookings.filter(booking => {
    const searchMatch = 
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking cancelled",
      description: "The booking has been cancelled successfully.",
    });
  };

  const handleCompleteBooking = (bookingId: string) => {
    toast({
      title: "Booking completed",
      description: "The booking has been marked as completed.",
    });
  };

  return (
    <AdminLayout title="All Bookings">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Booking ID</TableHead>
                <TableHead className="hidden md:table-cell">User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="hidden lg:table-cell">Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">#{booking.id.substring(8)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <CalendarCheck className="inline w-3 h-3 mr-1" />
                        {format(new Date(booking.bookingTime), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      <div>{booking.userName}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Car className="inline w-3 h-3 mr-1" />
                        {booking.vehicleNumber}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="truncate max-w-[200px]">{booking.locationName}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <MapPin className="inline w-3 h-3 mr-1" />
                        Slot {booking.slotNumber}
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell">
                      <div>
                        <span className="font-medium">From:</span> {formatDate(booking.startTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">To:</span> {formatDate(booking.endTime)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <div className="text-sm mt-1">
                        ₹{booking.amount}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/booking/${booking.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          
                          {booking.status === 'confirmed' && (
                            <>
                              <DropdownMenuItem onClick={() => handleCompleteBooking(booking.id)}>
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancelBooking(booking.id)}>
                                Cancel Booking
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {booking.status === 'pending' && (
                            <DropdownMenuItem onClick={() => {}}>
                              Confirm Booking
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => {}}>
                            Delete Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Booking Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Bookings</h4>
              <p className="text-3xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Confirmed</h4>
              <p className="text-3xl font-bold text-green-600">
                {bookings.filter(booking => booking.status === 'confirmed').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed</h4>
              <p className="text-3xl font-bold text-blue-600">
                {bookings.filter(booking => booking.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Cancelled</h4>
              <p className="text-3xl font-bold text-red-600">
                {bookings.filter(booking => booking.status === 'cancelled').length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
