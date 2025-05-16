
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Logo color="white" />
            <p className="text-gray-300 mt-2">
              Find and reserve the perfect parking spot across Delhi NCR. Save time, money and avoid the hassle of searching for parking.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Home</Link>
            <Link to="/locations" className="text-gray-300 hover:text-secondary transition-colors">Parking Locations</Link>
            <Link to="/about" className="text-gray-300 hover:text-secondary transition-colors">About Us</Link>
            <Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors">Contact Us</Link>
            <Link to="/faqs" className="text-gray-300 hover:text-secondary transition-colors">FAQs</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold mb-2">Our Services</h3>
            <Link to="/services" className="text-gray-300 hover:text-secondary transition-colors">Parking Reservations</Link>
            <Link to="/services/monthly" className="text-gray-300 hover:text-secondary transition-colors">Monthly Subscriptions</Link>
            <Link to="/services/corporate" className="text-gray-300 hover:text-secondary transition-colors">Corporate Solutions</Link>
            <Link to="/services/events" className="text-gray-300 hover:text-secondary transition-colors">Event Parking</Link>
            <Link to="/services/valet" className="text-gray-300 hover:text-secondary transition-colors">Valet Services</Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="mt-1 flex-shrink-0" />
              <p className="text-gray-300">Block A, Connaught Place, New Delhi, Delhi 110001, India</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} className="flex-shrink-0" />
              <p className="text-gray-300">+91 98765 43210</p>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={18} className="flex-shrink-0" />
              <p className="text-gray-300">support@letsparkitapp.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Lets Park It. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-5 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
            <Link to="/refund" className="hover:text-secondary transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
