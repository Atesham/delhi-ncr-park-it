
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  BookOpen, 
  CreditCard, 
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/locations', icon: MapPin, label: 'Manage Locations' },
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
    { path: '/admin/bookings', icon: BookOpen, label: 'View All Bookings' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payment Reports' },
    { path: '/admin/feedback', icon: MessageSquare, label: 'Manage Feedback' },
  ];

  const isActive = (path: string) => {
    // Check if the current path matches the item path exactly
    // or if it's a subpath (for location edit pages)
    if (location.pathname === path) return true;
    if (path !== '/admin' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b py-4">
            <Logo color="primary" className="mx-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        isActive={isActive(item.path)}
                        tooltip={item.label}
                        className="hover:bg-primary/10"
                        asChild
                      >
                        <Link to={item.path}>
                          <item.icon className="size-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={logout}
                      tooltip="Logout"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="size-5" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-background">
          <div className="px-4 py-8 md:px-8 w-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
              <SidebarTrigger className="p-2 rounded-md hover:bg-gray-100">
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className="h-[2px] w-full bg-gray-600 rounded-full"></span>
                  <span className="h-[2px] w-3/4 bg-gray-600 rounded-full self-end"></span>
                  <span className="h-[2px] w-full bg-gray-600 rounded-full"></span>
                </div>
              </SidebarTrigger>
            </div>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
