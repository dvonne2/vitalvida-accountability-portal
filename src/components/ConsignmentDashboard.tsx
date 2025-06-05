
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, Users, Activity, AlertTriangle, Plus, Eye, Shield, Clock } from 'lucide-react';
import ConsignmentForm from './ConsignmentForm';
import ActivityFeed from './ActivityFeed';
import FraudAlerts from './FraudAlerts';
import ReportsPanel from './ReportsPanel';
import LiveOrderFeed from './LiveOrderFeed';
import KPIScorecard from './KPIScorecard';
import EnhancedMetrics from './EnhancedMetrics';
import EnhancedActivityFeed from './EnhancedActivityFeed';
import BirdEyePanel from './BirdEyePanel';

interface ConsignmentDashboardProps {
  userRole: string;
  username: string;
}

const ConsignmentDashboard = ({ userRole, username }: ConsignmentDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewConsignment, setShowNewConsignment] = useState(false);

  // Mock data for dashboard stats
  const stats = {
    activeConsignments: 24,
    pendingPickups: 8,
    inTransit: 12,
    delivered: 156,
    fraudAlerts: 2,
    daCount: 45
  };

  const isLogisticsManager = userRole === 'logistics_manager';
  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Vitalvida Logistics Portal</h1>
                <p className="text-sm text-gray-500">
                  {isLogisticsManager ? 'Logistics Manager' : 'Admin'} Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                {username}
              </Badge>
              {stats.fraudAlerts > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {stats.fraudAlerts} Alerts
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Metrics Section */}
        <div className="mb-8">
          <EnhancedMetrics />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="consignments">Consignments</TabsTrigger>
            <TabsTrigger value="birdeye">Bird Eye Panel</TabsTrigger>
            <TabsTrigger value="activity">Live Activity</TabsTrigger>
            <TabsTrigger value="alerts">Fraud Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Live Order Feed */}
            <LiveOrderFeed />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KPI Scorecard */}
              <KPIScorecard />

              {/* Enhanced Activity Feed */}
              <EnhancedActivityFeed />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityFeed limit={5} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FraudAlerts limit={3} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consignments">
            {isLogisticsManager && (
              <div className="mb-6">
                <Button 
                  onClick={() => setShowNewConsignment(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Consignment
                </Button>
              </div>
            )}
            
            {showNewConsignment && isLogisticsManager && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Consignment</CardTitle>
                  <CardDescription>
                    All fields are required for audit compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConsignmentForm onClose={() => setShowNewConsignment(false)} />
                </CardContent>
              </Card>
            )}

            <ConsignmentTable userRole={userRole} />
          </TabsContent>

          <TabsContent value="birdeye">
            <BirdEyePanel userRole={userRole} />
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Real-Time DA Activity Feed
                  </CardTitle>
                  <CardDescription>
                    Live tracking of all DA actions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed />
                </CardContent>
              </Card>

              <EnhancedActivityFeed />
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Fraud Detection & Alerts
                </CardTitle>
                <CardDescription>
                  AI-powered fraud detection with automatic escalation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FraudAlerts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPanel userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Simple ConsignmentTable component for now
const ConsignmentTable = ({ userRole }: { userRole: string }) => {
  const mockConsignments = [
    {
      id: 'VV-2024-001',
      from: 'HQ Lagos',
      to: 'DA_FCT-001',
      motorPark: 'Berger Motor Park',
      status: 'In Transit',
      qty: '2-2-2',
      driver: '+234901234567',
      timestamp: '2024-01-15 09:30'
    },
    {
      id: 'VV-2024-002', 
      from: 'DA_LAG-005',
      to: 'DA_OGU-003',
      motorPark: 'Mile 2 Park',
      status: 'Delivered',
      qty: '1-1-1',
      driver: '+234907654321',
      timestamp: '2024-01-15 08:15'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Consignments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockConsignments.map((consignment) => (
            <div key={consignment.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{consignment.id}</h3>
                  <p className="text-sm text-gray-600">{consignment.from} → {consignment.to}</p>
                </div>
                <Badge variant={consignment.status === 'Delivered' ? 'default' : 'secondary'}>
                  {consignment.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Qty:</span> {consignment.qty}
                </div>
                <div>
                  <span className="text-gray-500">Park:</span> {consignment.motorPark}
                </div>
                <div>
                  <span className="text-gray-500">Driver:</span> {consignment.driver}
                </div>
                <div>
                  <span className="text-gray-500">Time:</span> {consignment.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsignmentDashboard;
