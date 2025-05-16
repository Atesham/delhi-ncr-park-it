
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import {
  Search,
  MessageSquare,
  User,
  MapPin,
  Star,
  Check,
  Filter,
  ThumbsUp,
  SendHorizontal,
  Flag,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useData, Feedback } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminFeedbacks() {
  const { feedbacks, respondToFeedback } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackResponse, setFeedbackResponse] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Filter feedbacks based on search, status, and rating
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const searchMatch = 
      feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.locationName && feedback.locationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (feedback.comment && feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const statusMatch = statusFilter === 'all' || feedback.status === statusFilter;
    const ratingMatch = ratingFilter === 'all' || feedback.rating === parseInt(ratingFilter);
    
    return searchMatch && statusMatch && ratingMatch;
  });

  const averageRating = feedbacks.reduce((total, feedback) => total + feedback.rating, 0) / 
    (feedbacks.length || 1);

  // Group feedbacks by rating for stats
  const ratingStats = {
    5: feedbacks.filter(f => f.rating === 5).length,
    4: feedbacks.filter(f => f.rating === 4).length,
    3: feedbacks.filter(f => f.rating === 3).length,
    2: feedbacks.filter(f => f.rating === 2).length,
    1: feedbacks.filter(f => f.rating === 1).length,
  };

  const handleResponseChange = (id: string, value: string) => {
    setFeedbackResponse({
      ...feedbackResponse,
      [id]: value
    });
  };

  const handleSubmitResponse = (id: string) => {
    if (!feedbackResponse[id]?.trim()) return;
    
    respondToFeedback(id, feedbackResponse[id]);
    
    toast({
      title: "Response submitted",
      description: "Your response has been submitted successfully.",
    });
    
    // Reset the input
    setFeedbackResponse({
      ...feedbackResponse,
      [id]: ''
    });
  };

  const handleFlagFeedback = (id: string) => {
    toast({
      title: "Feedback flagged",
      description: "The feedback has been flagged for review.",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AdminLayout title="Manage Feedback">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Rating" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Feedback Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center my-2">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    }`} 
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {feedbacks.length} reviews
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(ratingStats)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([rating, count]) => {
                  const percentage = (count / feedbacks.length) * 100 || 0;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="text-sm w-8">{rating} ★</div>
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground w-8 text-right">
                        {count}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>With response:</span>
                <span>
                  {feedbacks.filter(f => f.adminResponse).length} of {feedbacks.length}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>No response:</span>
                <span>
                  {feedbacks.filter(f => !f.adminResponse).length} of {feedbacks.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest feedback and responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {feedbacks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No feedback data available
                </p>
              ) : (
                feedbacks.slice(0, 3).map((feedback) => (
                  <div key={feedback.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex flex-col items-center">
                      <Avatar>
                        <AvatarFallback>{getInitials(feedback.userName)}</AvatarFallback>
                      </Avatar>
                      <div className="mt-2 flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{feedback.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(feedback.timestamp)}
                        </div>
                      </div>
                      
                      {feedback.locationName && (
                        <div className="text-sm text-muted-foreground mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {feedback.locationName}
                        </div>
                      )}
                      
                      <p className="mt-2 text-sm">{feedback.comment}</p>
                      
                      {feedback.adminResponse && (
                        <div className="mt-2 bg-muted p-3 rounded-md">
                          <div className="text-xs text-muted-foreground mb-1">Admin Response:</div>
                          <p className="text-sm">{feedback.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" /> All Feedback 
            <Badge className="ml-2 bg-gray-100 text-gray-800">{feedbacks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unresponded" className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" /> Needs Response
            <Badge className="ml-2 bg-red-100 text-red-800">
              {feedbacks.filter(f => !f.adminResponse).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" /> Responded
            <Badge className="ml-2 bg-green-100 text-green-800">
              {feedbacks.filter(f => f.adminResponse).length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {renderFeedbackCards(filteredFeedbacks)}
          </div>
        </TabsContent>
        
        <TabsContent value="unresponded" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {renderFeedbackCards(filteredFeedbacks.filter(f => !f.adminResponse))}
          </div>
        </TabsContent>
        
        <TabsContent value="responded" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {renderFeedbackCards(filteredFeedbacks.filter(f => f.adminResponse))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredFeedbacks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No feedback found</h3>
          <p className="text-muted-foreground">
            No feedback matches your current filters.
          </p>
        </div>
      )}

      {/* Helper function to render feedback cards */}
      {function renderFeedbackCards(feedbacks: Feedback[]) {
        if (feedbacks.length === 0) {
          return (
            <div className="col-span-full">
              <p className="text-center text-muted-foreground py-8">
                No feedback data available
              </p>
            </div>
          );
        }
        
        return feedbacks.map((feedback) => (
          <Card key={feedback.id} className={feedback.status === 'flagged' ? 'border-red-300' : ''}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(feedback.userName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{feedback.userName}</CardTitle>
                    <div className="flex mt-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {feedback.status === 'flagged' && (
                  <Badge variant="outline" className="border-red-300 text-red-500">
                    <Flag className="h-3 w-3 mr-1" /> Flagged
                  </Badge>
                )}
              </div>
              
              {feedback.locationName && (
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {feedback.locationName}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(feedback.timestamp)}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm">{feedback.comment}</p>
              
              {feedback.adminResponse && (
                <div className="mt-3 bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Admin Response:</div>
                  <p className="text-sm">{feedback.adminResponse}</p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2">
              {!feedback.adminResponse ? (
                <>
                  <Textarea 
                    placeholder="Write a response..."
                    value={feedbackResponse[feedback.id] || ''}
                    onChange={(e) => handleResponseChange(feedback.id, e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex justify-between w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFlagFeedback(feedback.id)}
                    >
                      <Flag className="h-3 w-3 mr-1" /> Flag
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmitResponse(feedback.id)}
                      disabled={!feedbackResponse[feedback.id]?.trim()}
                    >
                      <SendHorizontal className="h-3 w-3 mr-1" /> Respond
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleFlagFeedback(feedback.id)}
                  >
                    <Flag className="h-3 w-3 mr-1" /> Flag
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ));
      }}
    </AdminLayout>
  );
}

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
}
