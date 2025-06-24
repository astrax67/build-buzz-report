import { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Users, FileText, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already logged in
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      loadComplaints();
    }
  }, []);

  const loadComplaints = () => {
    const storedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(storedComplaints);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = (complaintId: number, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
    );
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    toast({
      title: "Status Updated",
      description: `Complaint status changed to ${newStatus.replace('-', ' ')}`,
    });
  };

  const handleResponseSubmit = async () => {
    if (!selectedComplaint || !response.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response message",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingResponse(true);
    
    setTimeout(() => {
      const updatedComplaints = complaints.map(complaint => 
        complaint.id === selectedComplaint.id 
          ? { ...complaint, response: response.trim(), status: 'resolved' as const }
          : complaint
      );
      
      setComplaints(updatedComplaints);
      localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
      setResponse("");
      setSelectedComplaint(null);
      setIsSubmittingResponse(false);
      
      toast({
        title: "Response Sent",
        description: "Your response has been sent to the complainant successfully.",
      });
    }, 1000);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setResponse("");
  };

  // Calculate analytics data
  const categoryData = complaints.reduce((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
    percentage: ((count / complaints.length) * 100).toFixed(1)
  }));

  const statusData = complaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(statusData).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    count
  }));

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#84cc16'];

  const stats = [
    { label: 'Total Complaints', value: complaints.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Pending', value: statusData.pending || 0, icon: Users, color: 'text-yellow-600' },
    { label: 'In Progress', value: statusData['in-progress'] || 0, icon: BarChart3, color: 'text-blue-600' },
    { label: 'Resolved', value: statusData.resolved || 0, icon: FileText, color: 'text-green-600' }
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
    loadComplaints();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    setComplaints([]);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-fade-in hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
              <CardDescription>Distribution of complaint categories</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No complaints data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Complaints by Status</CardTitle>
              <CardDescription>Current status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {barData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No complaints data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Complaints List */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
            <CardDescription>Manage and respond to complaints</CardDescription>
          </CardHeader>
          <CardContent>
            {complaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No complaints submitted yet</p>
                <p className="text-gray-400 text-sm">Complaints will appear here once users submit them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{complaint.name}</h3>
                        <p className="text-gray-600">{complaint.buildingCode} • {complaint.category}</p>
                        <p className="text-sm text-gray-500">
                          Submitted on {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(complaint.status)} border`}>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                        {complaint.complaint}
                      </p>
                    </div>
                    
                    {complaint.response && (
                      <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                        <p className="text-sm font-medium text-green-800 mb-1">Admin Response:</p>
                        <p className="text-green-700">{complaint.response}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint.id, 'pending')}
                        className="hover:bg-yellow-50 hover:border-yellow-300"
                      >
                        Mark Pending
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                        className="hover:bg-green-50 hover:border-green-300"
                      >
                        Mark Resolved
                      </Button>
                      <Button
                        size="sm"
                        className="bg-complaints-600 hover:bg-complaints-700"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Send Response</CardTitle>
                  <CardDescription>
                    Responding to {selectedComplaint.name} ({selectedComplaint.buildingCode})
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                  <p className="text-sm font-medium text-gray-600 mb-1">Original Complaint:</p>
                  <p className="text-gray-800">{selectedComplaint.complaint}</p>
                </div>
                <div>
                  <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                    Response Message
                  </label>
                  <Textarea
                    id="response"
                    placeholder="Type your response to the complainant..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="focus:ring-2 focus:ring-complaints-500 min-h-[100px]"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleResponseSubmit}
                    disabled={isSubmittingResponse || !response.trim()}
                    className="bg-complaints-600 hover:bg-complaints-700 flex-1"
                  >
                    {isSubmittingResponse ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Response
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
