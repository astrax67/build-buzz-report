
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplaintFormProps {
  user: { name: string; password: string };
  onBack: () => void;
  onSuccess: () => void;
}

const ComplaintForm = ({ user, onBack, onSuccess }: ComplaintFormProps) => {
  const [formData, setFormData] = useState({
    buildingCode: "",
    category: "",
    complaint: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buildingCode || !formData.category || !formData.complaint) {
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
        name: user.name,
        buildingCode: formData.buildingCode,
        category: formData.category,
        complaint: formData.complaint,
        status: 'pending',
        createdAt: new Date().toISOString(),
        response: null
      };
      complaints.push(newComplaint);
      localStorage.setItem('complaints', JSON.stringify(complaints));
      
      setIsSubmitting(false);
      onSuccess();
      
      toast({
        title: "Success!",
        description: "Your complaint has been submitted successfully. You will be notified of updates.",
      });
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-complaints-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-gray-50"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Submit Complaint</h1>
          </div>

          <Card className="animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Complaint Form</CardTitle>
              <CardDescription>
                Logged in as: <strong>{user.name}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="buildingCode" className="text-sm font-medium">Building Code *</Label>
                  <Input
                    id="buildingCode"
                    type="text"
                    placeholder="e.g., HR 307"
                    value={formData.buildingCode}
                    onChange={(e) => handleInputChange('buildingCode', e.target.value)}
                    className="focus:ring-2 focus:ring-complaints-500"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Please enter your building code (e.g., HR 307, BL 202)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category of Concern *</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="e.g., Maintenance, Plumbing, Electrical, Noise, Security, etc."
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="focus:ring-2 focus:ring-complaints-500"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Describe the category of your concern (maintenance, plumbing, electrical, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complaint" className="text-sm font-medium">Complaint Details *</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Please describe your complaint in detail..."
                    value={formData.complaint}
                    onChange={(e) => handleInputChange('complaint', e.target.value)}
                    className="focus:ring-2 focus:ring-complaints-500 min-h-[120px]"
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-complaints-600 hover:bg-complaints-700 transition-colors"
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

export default ComplaintForm;
