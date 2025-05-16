
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Home,
  CalendarCheck,
  Clock,
  User,
  LogIn,
  ParkingMeter,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavLink = ({ to, children, className, onClick }: { to: string; children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'px-4 py-2 rounded-md transition-colors flex items-center gap-2',
        isActive ? 'bg-secondary/10 text-secondary font-medium' : 'hover:bg-muted',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Locations', path: '/locations', icon: ParkingMeter },
  ];

  const authenticatedLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: User },
    { name: 'My Bookings', path: '/bookings', icon: CalendarCheck },
    { name: 'Booking History', path: '/history', icon: Clock },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: User },
  ];

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const renderNavLinks = (links: Array<{ name: string; path: string; icon: React.FC<any> }>) => {
    return links.map((link) => (
      <NavLink 
        key={link.path} 
        to={link.path} 
        onClick={handleLinkClick}
      >
        <link.icon size={18} />
        {link.name}
      </NavLink>
    ));
  };

  const mobileNavContent = (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex justify-between items-center">
        <Logo size="md" />
        <SheetTrigger asChild onClick={() => setIsSheetOpen(false)}>
          <Button variant="ghost" size="icon">
            <X size={24} />
          </Button>
        </SheetTrigger>
      </div>
      <div className="flex flex-col space-y-2">
        {renderNavLinks(navLinks)}
        {isAuthenticated && user?.role === 'user' && renderNavLinks(authenticatedLinks)}
        {isAuthenticated && user?.role === 'admin' && renderNavLinks(adminLinks)}
      </div>
      <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
        {!isAuthenticated ? (
          <>
            <Button asChild variant="outline" onClick={handleLinkClick}>
              <Link to="/login" className="flex items-center gap-2">
                <LogIn size={18} />
                Login
              </Link>
            </Button>
            <Button asChild onClick={handleLinkClick}>
              <Link to="/register">Register</Link>
            </Button>
          </>
        ) : (
          <Button variant="destructive" onClick={() => { logout(); setIsSheetOpen(false); }}>
            Logout
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo size="md" />
          <nav className="hidden md:flex items-center space-x-1">
            {renderNavLinks(navLinks)}
            {isAuthenticated && user?.role === 'user' && renderNavLinks(authenticatedLinks)}
            {isAuthenticated && user?.role === 'admin' && renderNavLinks(adminLinks)}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="outline">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          )}

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              {mobileNavContent}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
