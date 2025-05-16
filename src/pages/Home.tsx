
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CarFront,
  Search,
  Clock,
  Shield,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { locations } = useData();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1487958449943-2429e8be8625')`,
              opacity: 0.2
            }}
          />
        </div>
        <div className="container relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Easy Parking Solutions for Delhi NCR
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Pre-book your parking spot and say goodbye to parking hassles. 
              Find, book, and pay for parking spaces in advance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                <Link to="/locations">Find Parking</Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/register">Sign Up Now</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Booking a parking spot with Lets Park It is simple and hassle-free. 
              Follow these easy steps and never worry about finding parking again.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover-scale">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Location</h3>
              <p className="text-gray-600">
                Search for parking locations near your destination across Delhi NCR.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover-scale">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Your Slot</h3>
              <p className="text-gray-600">
                Select your preferred time slot and reserve your parking spot in advance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover-scale">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CarFront className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Park with Ease</h3>
              <p className="text-gray-600">
                Show your booking confirmation when you arrive and enjoy hassle-free parking.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Locations */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Parking Locations</h2>
              <p className="text-gray-600">Most popular parking spots around Delhi NCR</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/locations">View All Locations</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.slice(0, 3).map((location) => (
              <div key={location.id} className="bg-white rounded-lg overflow-hidden shadow-md hover-scale">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={location.image} 
                    alt={location.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
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
                  <div className="flex justify-between items-center mt-4">
                    <span className={`text-sm ${location.availableSlots > 10 ? 'text-green-600' : 'text-orange-500'} font-medium`}>
                      {location.availableSlots} spots available
                    </span>
                    <Button asChild size="sm">
                      <Link to={`/book/${location.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Lets Park It</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make parking easy, stress-free, and affordable across Delhi NCR.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Guaranteed Spot</h3>
              <p className="text-gray-600">
                Your parking spot is reserved and waiting for you when you arrive.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Parking</h3>
              <p className="text-gray-600">
                All our parking locations have security and CCTV surveillance.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                No more circling around looking for parking spaces; head straight to your spot.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">
                Strategically located parking spots across Delhi, Noida, Gurgaon, and more.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 parking-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Park Smarter?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who never worry about parking again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/locations">Find Parking</Link>
            </Button>
            {!isAuthenticated && (
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/register">Create an Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
