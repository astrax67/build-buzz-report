
import { useState, useEffect } from "react";
import UserLogin from "@/components/UserLogin";
import UserDashboard from "@/components/UserDashboard";
import ComplaintForm from "@/components/ComplaintForm";
import ComplaintSuccess from "@/components/ComplaintSuccess";

const User = () => {
  const [user, setUser] = useState<{ name: string; password: string } | null>(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('userLoggedIn');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData: { name: string; password: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setUser(null);
    setShowComplaintForm(false);
  };

  const handleComplaintSuccess = () => {
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setShowComplaintForm(true);
  };

  const backToDashboard = () => {
    setIsSubmitted(false);
    setShowComplaintForm(false);
  };

  // If user is not logged in, show login form
  if (!user) {
    return <UserLogin onLogin={handleLogin} />;
  }

  // Success page after complaint submission
  if (isSubmitted) {
    return (
      <ComplaintSuccess 
        onSubmitAnother={resetForm}
        onBackToDashboard={backToDashboard}
      />
    );
  }

  // Complaint form
  if (showComplaintForm) {
    return (
      <ComplaintForm
        user={user}
        onBack={() => setShowComplaintForm(false)}
        onSuccess={handleComplaintSuccess}
      />
    );
  }

  // Show user dashboard
  return (
    <UserDashboard 
      user={user} 
      onLogout={handleLogout}
      onNewComplaint={() => setShowComplaintForm(true)}
    />
  );
};

export default User;
