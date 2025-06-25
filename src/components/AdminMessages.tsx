
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, ArrowLeft, User, Clock, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  complaintId: number;
  sender: 'user' | 'admin';
  message: string;
  timestamp: string;
  senderName: string;
  read?: boolean;
}

interface Complaint {
  id: number;
  name: string;
  buildingCode: string;
  category: string;
  complaint: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

interface AdminMessagesProps {
  onBack: () => void;
}

const AdminMessages = ({ onBack }: AdminMessagesProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Auto-refresh messages every 3 seconds when viewing a conversation
  useEffect(() => {
    if (selectedComplaint) {
      const interval = setInterval(() => {
        loadMessages(selectedComplaint.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedComplaint]);

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    if (selectedComplaint) {
      loadMessages(selectedComplaint.id);
    }
  }, [selectedComplaint]);

  const loadComplaints = () => {
    const allComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(allComplaints);
  };

  const loadMessages = (complaintId: number) => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const complaintMessages = allMessages.filter((msg: Message) => msg.complaintId === complaintId);
    setMessages(complaintMessages);
  };

  const getUnreadCount = (complaintId: number) => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const complaintMessages = allMessages.filter((msg: Message) => 
      msg.complaintId === complaintId && msg.sender === 'user' && !msg.read
    );
    return complaintMessages.length;
  };

  const markMessagesAsRead = (complaintId: number) => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const updatedMessages = allMessages.map((msg: Message) => 
      msg.complaintId === complaintId && msg.sender === 'user' 
        ? { ...msg, read: true }
        : msg
    );
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedComplaint) return;

    setIsSending(true);
    
    setTimeout(() => {
      const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
      const message: Message = {
        id: Date.now(),
        complaintId: selectedComplaint.id,
        sender: 'admin',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        senderName: 'CSR Agent',
        read: false
      };
      
      allMessages.push(message);
      localStorage.setItem('messages', JSON.stringify(allMessages));
      
      setMessages([...messages, message]);
      setNewMessage("");
      setIsSending(false);
      
      toast({
        title: "Message Sent",
        description: "Your response has been sent to the customer.",
      });
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (complaintId: number, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
    );
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
    
    toast({
      title: "Status Updated",
      description: `Case status changed to ${newStatus.replace('-', ' ')}`,
    });
  };

  if (selectedComplaint) {
    // Mark messages as read when viewing conversation
    markMessagesAsRead(selectedComplaint.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedComplaint(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cases
              </Button>
              <div>
                <h1 className="text-2xl font-bold">CSR Dashboard - Customer Support</h1>
                <p className="text-gray-600">Responding to {selectedComplaint.name}</p>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Case #{selectedComplaint.id} - {selectedComplaint.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedComplaint.category} • {selectedComplaint.buildingCode} • {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(selectedComplaint.status)}>
                    {selectedComplaint.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold mb-2">Customer Issue:</h4>
                  <p className="text-gray-700">{selectedComplaint.complaint}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedComplaint.id, 'pending')}
                    className="hover:bg-yellow-50"
                  >
                    Set Pending
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedComplaint.id, 'in-progress')}
                    className="hover:bg-blue-50"
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedComplaint.id, 'resolved')}
                    className="hover:bg-green-50"
                  >
                    Resolve Case
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Customer Conversation
                  <Badge variant="secondary" className="ml-2">
                    Live Support
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4 bg-gray-50 p-4 rounded-lg">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No conversation yet. Start helping the customer!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-xs lg:max-w-md">
                          <div
                            className={`px-4 py-3 rounded-lg ${
                              message.sender === 'admin'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-800 border'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium">
                                {message.sender === 'admin' ? 'CSR Agent (You)' : message.senderName}
                              </p>
                              {message.sender === 'admin' && (
                                <CheckCheck className="w-3 h-3 opacity-75" />
                              )}
                            </div>
                            <p className="text-sm">{message.message}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <Clock className="w-3 h-3 opacity-75" />
                              <p className="text-xs opacity-75">
                                {new Date(message.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your response to the customer..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={3}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isSending || !newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 self-end"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter + Ctrl to send • Auto-refreshing every 3 seconds
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">CSR Customer Support Portal</h1>
              <p className="text-gray-600">Manage customer conversations and support tickets</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Active Support Cases
              </CardTitle>
              <CardDescription>
                Click on any case to start or continue customer support conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complaints.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No support cases submitted yet.</p>
                  <p className="text-gray-400 text-sm">Cases will appear here when customers need help</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => {
                    const unreadCount = getUnreadCount(complaint.id);
                    return (
                      <div
                        key={complaint.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white hover:bg-gray-50"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Case #{complaint.id} - {complaint.name}
                              </h3>
                              {unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {unreadCount} new
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {complaint.category} • {complaint.buildingCode}
                            </p>
                          </div>
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-sm truncate bg-gray-50 p-2 rounded">
                          {complaint.complaint}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </p>
                          {unreadCount > 0 && (
                            <p className="text-xs text-blue-600 font-medium">
                              Customer replied • Needs response
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
