import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface UserDashboardProps {
  user: { name: string; password: string };
  onLogout: () => void;
  onNewComplaint: () => void;
}

interface Complaint {
  id: number;
  name: string;
  buildingCode: string;
  category: string;
  complaint: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  response: string | null;
}

const UserDashboard = ({ user, onLogout, onNewComplaint }: UserDashboardProps) => {
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Load user's complaints
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const filteredComplaints = complaints.filter((complaint: Complaint) => complaint.name === user.name);
    setUserComplaints(filteredComplaints);
  }, [user.name]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <MessageSquare className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
              <p className="text-gray-600">Manage your complaints and view responses</p>
            </div>
            <div className="flex gap-4">
              <Button 
                className="bg-complaints-600 hover:bg-complaints-700"
                onClick={onNewComplaint}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Complaint
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Complaints</CardTitle>
                <CardDescription>
                  Track the status of your submitted complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userComplaints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No complaints submitted yet.</p>
                    <Button 
                      className="mt-4 bg-complaints-600 hover:bg-complaints-700"
                      onClick={onNewComplaint}
                    >
                      Submit Your First Complaint
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userComplaints.map((complaint) => (
                      <Card key={complaint.id} className="border-l-4 border-l-complaints-600">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getStatusColor(complaint.status)}>
                                  {getStatusIcon(complaint.status)}
                                  <span className="ml-1 capitalize">{complaint.status.replace('-', ' ')}</span>
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {new Date(complaint.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="font-semibold text-lg">{complaint.category}</h3>
                              <p className="text-sm text-gray-600 mb-1">Building: {complaint.buildingCode}</p>
                            </div>
                            <span className="text-xs text-gray-400">ID: #{complaint.id.toString().slice(-6)}</span>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Complaint Details:</h4>
                            <p className="text-gray-600 bg-gray-50 p-3 rounded">{complaint.complaint}</p>
                          </div>

                          {complaint.response && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Admin Response:
                              </h4>
                              <p className="text-blue-800">{complaint.response}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
