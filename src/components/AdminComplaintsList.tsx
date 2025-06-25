
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
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

interface AdminComplaintsListProps {
  complaints: Complaint[];
  onStatusUpdate: (complaintId: number, newStatus: 'pending' | 'in-progress' | 'resolved') => void;
  onViewMessages: () => void;
}

const AdminComplaintsList = ({ complaints, onStatusUpdate, onViewMessages }: AdminComplaintsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
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
                    onClick={() => onStatusUpdate(complaint.id, 'pending')}
                    className="hover:bg-yellow-50 hover:border-yellow-300"
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate(complaint.id, 'in-progress')}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate(complaint.id, 'resolved')}
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
                  onClick={onViewMessages}
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
  );
};

export default AdminComplaintsList;
