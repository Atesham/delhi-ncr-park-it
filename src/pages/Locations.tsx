
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData, ParkingLocation } from '@/contexts/DataContext';
import { MapPin, Search, CarFront, ParkingMeter } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Locations() {
  const { locations } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  
  const areas = ['all', ...Array.from(new Set(locations.map(loc => loc.area)))];
  
  const filteredLocations = locations.filter(location => {
    const areaMatch = filterArea === 'all' || location.area === filterArea;
    const searchMatch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       location.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    return areaMatch && searchMatch;
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Parking Locations</h1>
        <p className="text-gray-600">
          Find and book the perfect parking spot across Delhi NCR
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input 
            placeholder="Search by location name, area or address..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <Tabs defaultValue="all" onValueChange={setFilterArea}>
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 h-auto">
              {areas.map((area) => (
                <TabsTrigger key={area} value={area} className="capitalize">
                  {area}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredLocations.length === 0 ? (
        <div className="text-center py-12">
          <ParkingMeter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium">No parking locations found</h3>
          <p className="text-gray-500 mt-2">Try changing your search terms or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  );
}

function LocationCard({ location }: { location: ParkingLocation }) {
  return (
    <Card className="overflow-hidden hover-scale">
      <div className="h-48 overflow-hidden">
        <img 
          src={location.image} 
          alt={location.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{location.name}</h3>
          <span className="bg-secondary/10 text-secondary px-2 py-1 text-xs rounded-full font-medium">
            ₹{location.pricePerHour}/hr
          </span>
        </div>
        
        <div className="flex items-start gap-2 text-gray-600 mb-3">
          <MapPin size={18} className="flex-shrink-0 mt-1" />
          <p className="text-sm">{location.address}, {location.area}, {location.city}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {location.amenities.slice(0, 3).map((amenity, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {location.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              +{location.amenities.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex justify-between items-center border-t mt-4">
        <div className="flex items-center gap-2">
          <CarFront size={16} className="text-gray-500" />
          <span className={`text-sm ${location.availableSlots > 10 ? 'text-green-600' : 'text-orange-500'} font-medium`}>
            {location.availableSlots} spots available
          </span>
        </div>
        <Button asChild>
          <Link to={`/book/${location.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
