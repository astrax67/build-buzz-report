
import { useState, useEffect } from "react";
import UserLogin from "@/components/UserLogin";
import UserDashboard from "@/components/UserDashboard";
import UserMessages from "@/components/UserMessages";
import ComplaintForm from "@/components/ComplaintForm";
import ComplaintSuccess from "@/components/ComplaintSuccess";

const User = () => {
  const [user, setUser] = useState<{ name: string; password: string } | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'complaint-form' | 'complaint-success' | 'messages'>('dashboard');

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('userLoggedIn');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData: { name: string; password: string }) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleComplaintSuccess = () => {
    setCurrentView('complaint-success');
  };

  const resetForm = () => {
    setCurrentView('complaint-form');
  };

  const backToDashboard = () => {
    setCurrentView('dashboard');
  };

  // If user is not logged in, show login form
  if (!user) {
    return <UserLogin onLogin={handleLogin} />;
  }

  // Handle different views
  switch (currentView) {
    case 'complaint-success':
      return (
        <ComplaintSuccess 
          onSubmitAnother={resetForm}
          onBackToDashboard={backToDashboard}
        />
      );
    
    case 'complaint-form':
      return (
        <ComplaintForm
          user={user}
          onBack={backToDashboard}
          onSuccess={handleComplaintSuccess}
        />
      );
    
    case 'messages':
      return (
        <UserMessages
          user={user}
          onBack={backToDashboard}
        />
      );
    
    default:
      return (
        <UserDashboard 
          user={user} 
          onLogout={handleLogout}
          onNewComplaint={() => setCurrentView('complaint-form')}
          onViewMessages={() => setCurrentView('messages')}
        />
      );
  }
};

export default User;
