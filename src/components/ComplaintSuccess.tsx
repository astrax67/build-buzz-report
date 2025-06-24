
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ComplaintSuccessProps {
  onSubmitAnother: () => void;
  onBackToDashboard: () => void;
}

const ComplaintSuccess = ({ onSubmitAnother, onBackToDashboard }: ComplaintSuccessProps) => {
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
              onClick={onSubmitAnother}
              className="w-full bg-complaints-600 hover:bg-complaints-700"
            >
              Submit Another Complaint
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onBackToDashboard}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintSuccess;
