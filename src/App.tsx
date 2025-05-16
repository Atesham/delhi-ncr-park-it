
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
