
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, FileText } from "lucide-react";

interface AdminDashboardStatsProps {
  complaints: any[];
}

const AdminDashboardStats = ({ complaints }: AdminDashboardStatsProps) => {
  const statusData = complaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: 'Total Complaints', value: complaints.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Pending', value: statusData.pending || 0, icon: Users, color: 'text-yellow-600' },
    { label: 'In Progress', value: statusData['in-progress'] || 0, icon: BarChart3, color: 'text-blue-600' },
    { label: 'Resolved', value: statusData.resolved || 0, icon: FileText, color: 'text-green-600' }
  ];

  return (
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
  );
};

export default AdminDashboardStats;
