
import { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminMessages from "@/components/AdminMessages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Users, FileText, MessageSquare } from "lucide-react";
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'messages'>('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
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
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (currentView === 'messages') {
    return <AdminMessages onBack={() => setCurrentView('dashboard')} />;
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
          <div className="flex gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentView('messages')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            >
              Logout
            </Button>
          </div>
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

        {/* Quick Status Overview */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recent Complaints Overview</CardTitle>
            <CardDescription>Quick status management for recent complaints</CardDescription>
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
                {complaints.slice(0, 5).map((complaint) => (
                  <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{complaint.name}</h3>
                        <p className="text-gray-600">{complaint.buildingCode} • {complaint.category}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(complaint.status)} border`}>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-gray-300 truncate">
                        {complaint.complaint}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint.id, 'pending')}
                        className="hover:bg-yellow-50 hover:border-yellow-300"
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                        className="hover:bg-green-50 hover:border-green-300"
                      >
                        Resolved
                      </Button>
                    </div>
                  </div>
                ))}
                {complaints.length > 5 && (
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentView('messages')}
                      className="mt-4"
                    >
                      View All Complaints & Messages
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
