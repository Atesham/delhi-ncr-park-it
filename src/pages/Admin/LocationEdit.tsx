
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Trash2, Plus, X, Map } from 'lucide-react';
import { useData, ParkingLocation } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function AdminLocationEdit() {
  const { locationId } = useParams<{ locationId: string }>();
  const { locations } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ParkingLocation | null>(null);
  const [amenity, setAmenity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Find the location with the matching id
    const locationData = locations.find(loc => loc.id === locationId);
    
    if (locationData) {
      setFormData(locationData);
    } else {
      toast({
        title: "Location not found",
        description: "The requested location does not exist.",
        variant: "destructive"
      });
      navigate('/admin/locations');
    }
  }, [locationId, locations, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (!prev) return prev;
      
      if (name === 'totalSlots' || name === 'availableSlots' || name === 'pricePerHour') {
        return {
          ...prev,
          [name]: parseInt(value, 10) || 0
        };
      }

      if (name === 'lat' || name === 'lng') {
        return {
          ...prev,
          coordinates: {
            ...prev.coordinates,
            [name]: parseFloat(value) || 0
          }
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleAddAmenity = () => {
    if (!amenity.trim() || !formData) return;
    
    setFormData({
      ...formData,
      amenities: [...formData.amenities, amenity.trim()]
    });
    
    setAmenity('');
  };

  const handleRemoveAmenity = (index: number) => {
    if (!formData) return;
    
    const updatedAmenities = [...formData.amenities];
    updatedAmenities.splice(index, 1);
    
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Location updated",
        description: "The parking location has been updated successfully.",
      });
      setIsLoading(false);
      navigate('/admin/locations');
    }, 800);
  };

  if (!formData) {
    return (
      <AdminLayout title="Edit Location">
        <div className="flex justify-center items-center h-64">
          <p>Loading location data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Location">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/locations')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Locations
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Location Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input 
                        id="area" 
                        name="area" 
                        value={formData.area} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalSlots">Total Slots</Label>
                      <Input 
                        id="totalSlots" 
                        name="totalSlots" 
                        type="number" 
                        value={formData.totalSlots} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availableSlots">Available Slots</Label>
                      <Input 
                        id="availableSlots" 
                        name="availableSlots" 
                        type="number" 
                        value={formData.availableSlots} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pricePerHour">Price Per Hour (₹)</Label>
                      <Input 
                        id="pricePerHour" 
                        name="pricePerHour" 
                        type="number" 
                        value={formData.pricePerHour} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Location Coordinates</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input 
                      id="lat" 
                      name="lat" 
                      type="number" 
                      step="0.0001" 
                      value={formData.coordinates.lat} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input 
                      id="lng" 
                      name="lng" 
                      type="number" 
                      step="0.0001" 
                      value={formData.coordinates.lng} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="mt-4 bg-muted rounded-md h-40 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Map className="h-8 w-8 mx-auto mb-2" />
                    <p>Map preview would display here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Location Image</h3>
                
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt={formData.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleChange} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Amenities</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.amenities.map((item, index) => (
                    <Badge key={index} className="pr-1 pl-3 py-1.5">
                      {item}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveAmenity(index)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input 
                      value={amenity} 
                      onChange={(e) => setAmenity(e.target.value)} 
                      placeholder="Add new amenity..." 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAmenity();
                        }
                      }}
                    />
                  </div>
                  <Button type="button" onClick={handleAddAmenity} disabled={!amenity.trim()}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you delete this location, there is no going back.
                  </p>
                  <div className="mt-2">
                    <Button variant="destructive" type="button" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete This Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/locations')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
