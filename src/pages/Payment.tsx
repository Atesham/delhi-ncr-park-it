
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, CreditCard, Landmark, Wallet, ArrowRight } from 'lucide-react';

export default function Payment() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { getBookingDetails, addPayment } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "debit_card" | "net_banking" | "upi" | "wallet">("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  useEffect(() => {
    if (bookingId) {
      const bookingDetails = getBookingDetails(bookingId);
      if (bookingDetails) {
        setBooking(bookingDetails);
      } else {
        toast({
          title: "Booking Not Found",
          description: "We couldn't find the booking you're looking for.",
          variant: "destructive",
        });
        navigate('/bookings');
      }
    }
  }, [bookingId, getBookingDetails, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = () => {
    if (!booking || !user) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      try {
        // Add payment record
        const paymentData = {
          bookingId: booking.id,
          userId: user.id,
          amount: booking.amount,
          status: "paid" as const,
          paymentMethod: paymentMethod,
          transactionId: `txn-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        
        addPayment(paymentData);
        
        toast({
          title: "Payment Successful",
          description: "Your parking spot has been reserved successfully.",
          variant: "default",
        });
        
        navigate('/booking-confirmation', { state: { booking, paymentId: paymentData.transactionId } });
      } catch (error) {
        toast({
          title: "Payment Failed",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (!booking) {
    return <div className="container py-12 text-center">Loading...</div>;
  }

  const renderCardForm = () => (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardInfo.cardNumber}
          onChange={handleInputChange}
          maxLength={19}
          className="font-mono"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cardName">Name on Card</Label>
        <Input
          id="cardName"
          name="cardName"
          placeholder="John Doe"
          value={cardInfo.cardName}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/YY"
            value={cardInfo.expiryDate}
            onChange={handleInputChange}
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            name="cvv"
            type="password"
            placeholder="123"
            value={cardInfo.cvv}
            onChange={handleInputChange}
            maxLength={3}
            className="font-mono"
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentMethodContent = () => {
    switch (paymentMethod) {
      case "credit_card":
      case "debit_card":
        return renderCardForm();
      case "net_banking":
        return (
          <div className="mt-4">
            <Label>Select Your Bank</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"].map((bank) => (
                <Button key={bank} variant="outline" className="justify-start">
                  {bank}
                </Button>
              ))}
            </div>
          </div>
        );
      case "upi":
        return (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
              />
              <p className="text-xs text-muted-foreground">
                Enter your UPI ID (e.g., yourname@upi)
              </p>
            </div>
          </div>
        );
      case "wallet":
        return (
          <div className="mt-4">
            <Label>Select Your Wallet</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"].map((wallet) => (
                <Button key={wallet} variant="outline" className="justify-start">
                  {wallet}
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <p className="text-gray-600">Complete your payment to confirm your booking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
              
              <RadioGroup 
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as any)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 bg-white border rounded-md p-3">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard size={18} />
                    <span>Credit Card</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-white border rounded-md p-3">
                  <RadioGroupItem value="debit_card" id="debit_card" />
                  <Label htmlFor="debit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard size={18} />
                    <span>Debit Card</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-white border rounded-md p-3">
                  <RadioGroupItem value="net_banking" id="net_banking" />
                  <Label htmlFor="net_banking" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Landmark size={18} />
                    <span>Net Banking</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-white border rounded-md p-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                    <ArrowRight size={18} />
                    <span>UPI</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-white border rounded-md p-3">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Wallet size={18} />
                    <span>Mobile Wallet</span>
                  </Label>
                </div>
              </RadioGroup>
              
              {renderPaymentMethodContent()}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{booking.locationName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(booking.startTime).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{booking.duration} hours</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking Slot:</span>
                    <span className="font-medium">{booking.slotNumber}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{booking.amount}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ₹{booking.amount}
                    </>
                  )}
                </Button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 flex items-center justify-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    Secure Payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
