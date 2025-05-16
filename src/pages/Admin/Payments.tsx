
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData, Payment } from '@/contexts/DataContext';
import { format } from 'date-fns';
import {
  Search,
  Calendar,
  Download,
  CreditCard,
  BarChart,
  FileText,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export default function AdminPayments() {
  const { payments } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter payments based on search and status filter
  const filteredPayments = payments.filter(payment => {
    const searchMatch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'refunded': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'failed': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'net_banking':
        return <FileText className="h-4 w-4" />;
      case 'upi':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report downloaded",
      description: "The payment report has been downloaded successfully.",
    });
  };

  // Calculate total revenue
  const totalRevenue = payments
    .filter(payment => payment.status === 'paid')
    .reduce((total, payment) => total + payment.amount, 0);

  // Mock data for chart visualization
  const paymentMethods = {
    'credit_card': payments.filter(p => p.paymentMethod === 'credit_card').length,
    'debit_card': payments.filter(p => p.paymentMethod === 'debit_card').length,
    'upi': payments.filter(p => p.paymentMethod === 'upi').length,
    'net_banking': payments.filter(p => p.paymentMethod === 'net_banking').length,
    'wallet': payments.filter(p => p.paymentMethod === 'wallet').length,
  };

  return (
    <AdminLayout title="Payment Reports">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments by ID, transaction ID..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">₹{totalRevenue.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>From {payments.length} transactions</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Successful Payments</CardDescription>
            <CardTitle className="text-3xl">
              {payments.filter(p => p.status === 'paid').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(1)}% success rate
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Transaction</CardDescription>
            <CardTitle className="text-3xl">
              ₹{(totalRevenue / (payments.filter(p => p.status === 'paid').length || 1)).toFixed(0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Per successful transaction
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Most Popular Method</CardDescription>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Credit Card</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {((paymentMethods.credit_card / payments.length) * 100).toFixed(1)}% of all payments
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-muted/50 rounded-md flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">Revenue chart would display here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-muted/50 rounded-md flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 text-muted-foreground/50 mx-auto mb-2 flex items-center justify-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    {/* Mocked pie chart */}
                    <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 0 0, 0 50%)' }}></div>
                    <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 100%, 50% 100%)' }}></div>
                    <div className="absolute inset-0 bg-yellow-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%, 100% 75%)' }}></div>
                  </div>
                </div>
                <p className="text-muted-foreground">Payment methods breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Transaction ID</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">{payment.transactionId}</div>
                      <div className="text-xs text-muted-foreground">#{payment.id.substring(4)}</div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">#{payment.bookingId.substring(8)}</div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPaymentIcon(payment.paymentMethod)}
                        <span>
                          {payment.paymentMethod
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">₹{payment.amount}</div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(payment.timestamp)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
