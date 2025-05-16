
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Car 
} from 'lucide-react';
import { useData, ParkingLocation } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminLocations() {
  const { locations } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    toast({
      title: "Location deleted",
      description: "The parking location has been deleted successfully.",
    });
  };

  return (
    <AdminLayout title="Manage Locations">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New Location
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead className="hidden md:table-cell">Area</TableHead>
                <TableHead className="hidden lg:table-cell">Total Slots</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No locations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="font-medium">{location.name}</div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1">
                        {location.area}, {location.city}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{location.address}</TableCell>
                    <TableCell className="hidden md:table-cell">{location.area}, {location.city}</TableCell>
                    <TableCell className="hidden lg:table-cell">{location.totalSlots}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={location.availableSlots > 10 ? "success" : location.availableSlots > 0 ? "warning" : "destructive"}
                        className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                      >
                        {location.availableSlots}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/locations/${location.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={location.image} 
                alt={location.name} 
                className="object-cover w-full h-full" 
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-background/80 backdrop-blur-sm">
                  <Car className="mr-1 h-3 w-3" /> {location.availableSlots}/{location.totalSlots}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{location.name}</h3>
                <Badge variant="outline">₹{location.pricePerHour}/hr</Badge>
              </div>
              <div className="flex items-center text-muted-foreground mb-3">
                <MapPin className="mr-1 h-3.5 w-3.5" />
                <span className="text-sm">
                  {location.address}, {location.area}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {location.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {location.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{location.amenities.length - 3} more
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to={`/admin/locations/${location.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleDelete(location.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
