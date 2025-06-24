
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shield, BarChart3, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Complaints Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamlined complaint handling system for building management and residents
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-complaints-500/30 animate-fade-in">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-complaints-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-complaints-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">User Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Submit and track your complaints easily
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Submit new complaints</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Track complaint status</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>View response updates</span>
                </div>
              </div>
              <Link to="/user" className="block">
                <Button className="w-full bg-complaints-600 hover:bg-complaints-700 text-white">
                  Access User Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/30 animate-fade-in">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Admin Dashboard</CardTitle>
              <CardDescription className="text-gray-600">
                Manage complaints and view analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>View complaint analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Manage all complaints</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Send responses to users</span>
                </div>
              </div>
              <Link to="/admin" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Access Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16 animate-fade-in">
          <p className="text-gray-500">
            Secure • Efficient • User-Friendly
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
