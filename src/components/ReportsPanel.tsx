
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BarChart3, TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';

interface ReportsPanelProps {
  userRole: string;
}

const ReportsPanel = ({ userRole }: ReportsPanelProps) => {
  const isAdmin = userRole === 'admin';

  const reports = [
    {
      title: 'Daily Operations Summary',
      description: 'Consignments, deliveries, and DA performance',
      icon: BarChart3,
      available: true,
      adminOnly: false
    },
    {
      title: 'Financial Reconciliation',
      description: 'A/R aging, unpaid fees, guarantor alerts',
      icon: TrendingUp,
      available: true,
      adminOnly: true
    },
    {
      title: 'DA Performance Metrics',
      description: 'Strike counts, delivery rates, SLA compliance',
      icon: Users,
      available: true,
      adminOnly: true
    },
    {
      title: 'Fraud Detection Log',
      description: 'All fraud alerts, escalations, and resolutions',
      icon: AlertTriangle,
      available: true,
      adminOnly: true
    },
    {
      title: 'Inventory Audit Trail',
      description: 'Full quantity tracking from dispatch to delivery',
      icon: Package,
      available: true,
      adminOnly: false
    }
  ];

  const availableReports = reports.filter(report => 
    !report.adminOnly || isAdmin
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableReports.map((report, index) => {
          const IconComponent = report.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    {report.adminOnly && (
                      <Badge variant="outline" className="text-xs mt-1">Admin Only</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={!report.available}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats for Admins */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-gray-600">Delivery Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₦2.4M</div>
                <div className="text-sm text-gray-600">Outstanding A/R</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-gray-600">DAs on Strike 2+</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-gray-600">Active Fraud Cases</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Trail Access */}
      <Card>
        <CardHeader>
          <CardTitle>System Audit Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            All actions are logged with IP addresses and timestamps. 
            {isAdmin ? ' Full audit trail available.' : ' Contact admin for audit access.'}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Last system sync with Zoho:</span>
              <Badge variant="outline">2 minutes ago</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Total logged events today:</span>
              <Badge variant="outline">1,247</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>AI fraud checks processed:</span>
              <Badge variant="outline">856</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPanel;
