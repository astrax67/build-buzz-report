
import { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminMessages from "@/components/AdminMessages";
import AdminDashboardStats from "@/components/AdminDashboardStats";
import AdminDashboardCharts from "@/components/AdminDashboardCharts";
import AdminComplaintsList from "@/components/AdminComplaintsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

        <AdminDashboardStats complaints={complaints} />
        <AdminDashboardCharts complaints={complaints} />
        <AdminComplaintsList 
          complaints={complaints} 
          onStatusUpdate={handleStatusUpdate}
          onViewMessages={() => setCurrentView('messages')}
        />
      </div>
    </div>
  );
};

export default Admin;
