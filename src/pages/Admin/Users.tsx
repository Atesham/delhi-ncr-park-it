
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Car 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth, User } from '@/contexts/AuthContext';

// Sample user data
const sampleUsers: User[] = [
  {
    id: "user-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "user",
    phone: "9998887776",
    vehicle: {
      type: "Car",
      number: "DL01AB1234"
    }
  },
  {
    id: "user-2",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    role: "user",
    phone: "8887776665",
    vehicle: {
      type: "Motorcycle",
      number: "HR26CD5678"
    }
  },
  {
    id: "user-3",
    name: "Amit Kumar",
    email: "amit@example.com",
    role: "user",
    phone: "7776665554",
    vehicle: {
      type: "Car",
      number: "UP16EF9012"
    }
  },
  {
    id: "user-4",
    name: "Sneha Gupta",
    email: "sneha@example.com",
    role: "user",
    phone: "6665554443",
    vehicle: {
      type: "Car",
      number: "DL02GH3456"
    }
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@letsparkitapp.com",
    role: "admin",
    phone: "9876543210"
  }
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredUsers = sampleUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.vehicle?.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
    });
  };

  const handleResetPassword = (userId: string) => {
    toast({
      title: "Password reset",
      description: "A password reset link has been sent to the user's email.",
    });
  };

  return (
    <AdminLayout title="Manage Users">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden sm:table-cell">Vehicle</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      {user.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center mt-1">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden sm:table-cell">
                      {user.vehicle ? (
                        <div>
                          <div className="flex items-center">
                            <Car className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span>{user.vehicle.type}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {user.vehicle.number}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not provided</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={user.role === "admin" ? "default" : "outline"}
                        className={user.role === "admin" ? "bg-primary" : ""}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {}}>
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Users</h4>
              <p className="text-3xl font-bold">{filteredUsers.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Admins</h4>
              <p className="text-3xl font-bold">
                {filteredUsers.filter(user => user.role === "admin").length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Regular Users</h4>
              <p className="text-3xl font-bold">
                {filteredUsers.filter(user => user.role === "user").length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">With Vehicles</h4>
              <p className="text-3xl font-bold">
                {filteredUsers.filter(user => user.vehicle).length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
