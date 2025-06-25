
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  complaintId: number;
  sender: 'user' | 'admin';
  message: string;
  timestamp: string;
  senderName: string;
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

interface UserMessagesProps {
  user: { name: string; password: string };
  onBack: () => void;
}

const UserMessages = ({ user, onBack }: UserMessagesProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserComplaints();
  }, [user.name]);

  useEffect(() => {
    if (selectedComplaint) {
      loadMessages(selectedComplaint.id);
    }
  }, [selectedComplaint]);

  const loadUserComplaints = () => {
    const allComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const userComplaints = allComplaints.filter((complaint: Complaint) => complaint.name === user.name);
    setComplaints(userComplaints);
  };

  const loadMessages = (complaintId: number) => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const complaintMessages = allMessages.filter((msg: Message) => msg.complaintId === complaintId);
    setMessages(complaintMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedComplaint) return;

    setIsSending(true);
    
    setTimeout(() => {
      const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
      const message: Message = {
        id: Date.now(),
        complaintId: selectedComplaint.id,
        sender: 'user',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        senderName: user.name
      };
      
      allMessages.push(message);
      localStorage.setItem('messages', JSON.stringify(allMessages));
      
      setMessages([...messages, message]);
      setNewMessage("");
      setIsSending(false);
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the admin.",
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

  if (selectedComplaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedComplaint(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Complaints
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Conversation</h1>
                <p className="text-gray-600">{selectedComplaint.category} - {selectedComplaint.buildingCode}</p>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Original Complaint</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(selectedComplaint.status)}>
                    {selectedComplaint.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedComplaint.complaint}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-complaints-600 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {message.sender === 'user' ? 'You' : 'Admin'}
                          </p>
                          <p>{message.message}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessage.trim()}
                    className="bg-complaints-600 hover:bg-complaints-700"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Your Conversations</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select a Complaint to View Conversation</CardTitle>
              <CardDescription>
                Click on any complaint to start or continue the conversation with admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complaints.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No complaints submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{complaint.category}</h3>
                          <p className="text-sm text-gray-600">{complaint.buildingCode}</p>
                        </div>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm truncate">{complaint.complaint}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserMessages;
