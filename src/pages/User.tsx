
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const User = () => {
  const [formData, setFormData] = useState({
    name: "",
    buildingCode: "",
    category: "",
    complaint: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Maintenance",
    "Plumbing",
    "Electrical",
    "Noise Complaint",
    "Security",
    "Cleanliness",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.buildingCode || !formData.category || !formData.complaint) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - in real app, this would connect to MySQL
    setTimeout(() => {
      // Store in localStorage for demo purposes
      const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      const newComplaint = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        response: null
      };
      complaints.push(newComplaint);
      localStorage.setItem('complaints', JSON.stringify(complaints));
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully. You will be notified of updates.",
      });
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center animate-fade-in">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Complaint Submitted!</CardTitle>
            <CardDescription>
              Your complaint has been received and assigned ID #{Date.now().toString().slice(-6)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              You will receive updates on the status of your complaint via the system.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: "", buildingCode: "", category: "", complaint: "" });
                }}
                className="w-full"
              >
                Submit Another Complaint
              </Button>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Submit Complaint</h1>
          </div>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Complaint Form</CardTitle>
              <CardDescription>
                Please fill in all the required information to submit your complaint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildingCode">Building Code *</Label>
                  <Input
                    id="buildingCode"
                    type="text"
                    placeholder="e.g., HR 307"
                    value={formData.buildingCode}
                    onChange={(e) => handleInputChange('buildingCode', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Please enter your building code (e.g., HR 307, BL 202)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Complaint Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complaint">Complaint Details *</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Please describe your complaint in detail..."
                    value={formData.complaint}
                    onChange={(e) => handleInputChange('complaint', e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-complaints-600 hover:bg-complaints-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default User;
