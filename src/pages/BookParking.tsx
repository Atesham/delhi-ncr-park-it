
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useAuth } from '@/contexts/AuthContext';
import { useData, ParkingLocation, SlotType } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  MapPin, 
  Calendar as CalendarIcon,
  Clock,
  Car,
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react';

export default function BookParking() {
  const { locationId } = useParams();
  const { user } = useAuth();
  const { locations, slots, addBooking } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedLocation, setSelectedLocation] = useState<ParkingLocation | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('10:00');
  const [duration, setDuration] = useState<number>(2);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlotType, setSelectedSlotType] = useState<SlotType | 'all'>('all');

  useEffect(() => {
    if (locationId) {
      const location = locations.find(loc => loc.id === locationId);
      if (location) setSelectedLocation(location);
    } else if (locations.length > 0) {
      setSelectedLocation(locations[0]);
    }
  }, [locationId, locations]);

  useEffect(() => {
    if (selectedLocation) {
      const locationSlots = slots.filter(slot => slot.locationId === selectedLocation.id);
      const filteredSlots = locationSlots.filter(slot => {
        if (selectedSlotType === 'all') return slot.isAvailable;
        return slot.isAvailable && slot.type === selectedSlotType;
      });
      setAvailableSlots(filteredSlots);
      
      // Clear selected slot if it's not available anymore
      if (selectedSlotId && !filteredSlots.some(slot => slot.id === selectedSlotId)) {
        setSelectedSlotId(null);
      }
    }
  }, [selectedLocation, selectedSlotType, slots, selectedSlotId]);

  const handleLocationChange = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setSelectedSlotId(null);
    }
  };

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book a parking spot.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!selectedLocation || !selectedSlotId) {
      toast({
        title: "Incomplete Booking",
        description: "Please select a location and parking slot.",
        variant: "destructive",
      });
      return;
    }

    const selectedSlot = availableSlots.find(slot => slot.id === selectedSlotId);
    
    // Create booking start and end times
    const bookingDate = new Date(date);
    const [hours, minutes] = startTime.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(bookingDate);
    endDate.setHours(endDate.getHours() + duration);
    
    // Create booking
    const bookingData = {
      userId: user.id,
      userName: user.name,
      vehicleNumber: user.vehicle?.number || "Unknown",
      locationId: selectedLocation.id,
      locationName: selectedLocation.name,
      slotId: selectedSlotId,
      slotNumber: selectedSlot.number,
      bookingTime: new Date().toISOString(),
      startTime: bookingDate.toISOString(),
      endTime: endDate.toISOString(),
      duration: duration,
      amount: selectedLocation.pricePerHour * duration,
      status: "pending" as const
    };
    
    const bookingId = addBooking(bookingData);
    toast({
      title: "Booking Created",
      description: "Proceed to payment to confirm your booking.",
      variant: "default",
    });
    
    navigate(`/payment/${bookingId}`);
  };

  const getSlotTypeIcon = (type: SlotType) => {
    switch (type) {
      case 'compact': return <Car size={16} />;
      case 'standard': return <Car size={16} />;
      case 'large': return <Car size={16} />;
      case 'handicapped': return <Car size={16} />;
      case 'ev': return <Zap size={16} />;
    }
  };

  const totalAmount = selectedLocation ? selectedLocation.pricePerHour * duration : 0;

  if (!selectedLocation) {
    return <div className="container py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Book Parking</h1>
        <p className="text-gray-600">
          Select a location, date, time, and parking slot to reserve your spot
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Location</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Parking Location</label>
                  <Select
                    value={selectedLocation.id}
                    onValueChange={handleLocationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name} - {location.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-secondary mt-1 flex-shrink-0" size={18} />
                    <div>
                      <h3 className="font-semibold">{selectedLocation.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedLocation.address}, {selectedLocation.area}, {selectedLocation.city}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedLocation.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="bg-white">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                    <Select 
                      value={duration.toString()} 
                      onValueChange={(value) => setDuration(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select Parking Slot</h2>
                <Select 
                  value={selectedSlotType} 
                  onValueChange={(value) => setSelectedSlotType(value as SlotType | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="handicapped">Handicapped</SelectItem>
                    <SelectItem value="ev">EV Charging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No available slots</h3>
                  <p className="text-muted-foreground text-sm">
                    Try changing your date, time, or filter settings
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {availableSlots.map(slot => (
                    <Button
                      key={slot.id}
                      variant={selectedSlotId === slot.id ? "default" : "outline"}
                      className="flex flex-col py-3 h-auto min-h-[80px]"
                      onClick={() => setSelectedSlotId(slot.id)}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {getSlotTypeIcon(slot.type)}
                      </div>
                      <div className="text-xs font-semibold">{slot.number}</div>
                      <div className="text-xs capitalize">{slot.type}</div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedLocation.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{format(date, "PPP")}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {startTime} ({duration} {duration === 1 ? 'hour' : 'hours'})
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking Slot:</span>
                    <span className="font-medium">
                      {selectedSlotId ? 
                       availableSlots.find(slot => slot.id === selectedSlotId)?.number || "Not selected" : 
                       "Not selected"}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span>₹{selectedLocation.pricePerHour} / hour</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                  </div>
                  
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Total:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  disabled={!selectedSlotId}
                  onClick={handleBooking}
                >
                  Proceed to Payment
                </Button>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-600">Guaranteed parking spot</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-600">Flexible cancellation up to 1 hour before</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield size={16} className="text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-600">Secure payment & booking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
