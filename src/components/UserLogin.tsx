
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserLoginProps {
  onLogin: (user: { name: string; password: string }) => void;
}

const UserLogin = ({ onLogin }: UserLoginProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isSignUp) {
        // Sign up logic
        if (!credentials.name || !credentials.password) {
          toast({
            title: "Error",
            description: "Please fill in all fields",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        if (credentials.password !== credentials.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Store user account
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find((u: any) => u.name === credentials.name);
        
        if (existingUser) {
          toast({
            title: "Error",
            description: "User already exists",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        users.push({ name: credentials.name, password: credentials.password });
        localStorage.setItem('users', JSON.stringify(users));
        
        toast({
          title: "Success",
          description: "Account created successfully! Please sign in.",
        });
        
        setIsSignUp(false);
        setCredentials({ name: "", password: "", confirmPassword: "" });
      } else {
        // Sign in logic
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.name === credentials.name && u.password === credentials.password);
        
        if (user) {
          localStorage.setItem('userLoggedIn', JSON.stringify(user));
          onLogin(user);
          toast({
            title: "Login Successful",
            description: `Welcome back, ${user.name}!`,
          });
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid name or password",
            variant: "destructive"
          });
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isSignUp ? <UserPlus className="w-8 h-8 text-blue-600" /> : <User className="w-8 h-8 text-blue-600" />}
          </div>
          <CardTitle className="text-2xl">{isSignUp ? 'Create Account' : 'User Login'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your account to submit complaints' : 'Sign in to view and submit complaints'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={credentials.name}
                  onChange={(e) => setCredentials(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={credentials.confirmPassword}
                    onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-complaints-600 hover:bg-complaints-700" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isSignUp ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setCredentials({ name: "", password: "", confirmPassword: "" });
              }}
              className="text-complaints-600"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
