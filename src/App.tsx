
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import BookingHistory from "./pages/BookingHistory";
import BookParking from "./pages/BookParking";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingDetail from "./pages/BookingDetail";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminLocations from "./pages/Admin/Locations";
import AdminUsers from "./pages/Admin/Users";
import AdminBookings from "./pages/Admin/Bookings";
import AdminPayments from "./pages/Admin/Payments";
import AdminFeedbacks from "./pages/Admin/Feedbacks";
import AdminLocationEdit from "./pages/Admin/LocationEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to conditionally render the Footer
const ConditionalFooter = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Don't render the Footer on admin pages
  if (isAdminPage) return null;
  
  return <Footer />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/bookings" element={<BookingHistory />} />
                  <Route path="/book" element={<BookParking />} />
                  <Route path="/book/:locationId" element={<BookParking />} />
                  <Route path="/payment/:bookingId" element={<Payment />} />
                  <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                  <Route path="/booking/:bookingId" element={<BookingDetail />} />
                  <Route path="/feedback/:bookingId" element={<Feedback />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/locations" element={<AdminLocations />} />
                  <Route path="/admin/locations/:locationId" element={<AdminLocationEdit />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/bookings" element={<AdminBookings />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/feedback" element={<AdminFeedbacks />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <ConditionalFooter />
            </div>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
