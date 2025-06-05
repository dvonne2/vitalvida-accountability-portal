
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, Users, AlertTriangle } from 'lucide-react';

interface MetricData {
  activeConsignments: number;
  inTransit: number;
  activeDAs: number;
  fraudAlerts: number;
}

const EnhancedMetrics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');

  const metricsData = {
    today: {
      activeConsignments: 24,
      inTransit: 12,
      activeDAs: 15,
      fraudAlerts: 2
    },
    week: {
      activeConsignments: 168,
      inTransit: 89,
      activeDAs: 45,
      fraudAlerts: 8
    },
    month: {
      activeConsignments: 725,
      inTransit: 394,
      activeDAs: 67,
      fraudAlerts: 23
    }
  };

  const getMetricCard = (
    title: string,
    value: number,
    icon: React.ReactNode,
    color: string,
    isAlert: boolean = false
  ) => (
    <Card className={`${isAlert && value > 0 ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {isAlert && value > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              ALERT
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const currentData = metricsData[selectedTimeframe];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📅 Dashboard Summary - Stacked Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getMetricCard(
                  "📦 Active Consignments",
                  metricsData.today.activeConsignments,
                  <Package className="h-6 w-6 text-blue-600" />,
                  "bg-blue-100"
                )}
                {getMetricCard(
                  "🚚 In Transit",
                  metricsData.today.inTransit,
                  <Truck className="h-6 w-6 text-green-600" />,
                  "bg-green-100"
                )}
                {getMetricCard(
                  "🧍 Active DAs",
                  metricsData.today.activeDAs,
                  <Users className="h-6 w-6 text-purple-600" />,
                  "bg-purple-100"
                )}
                {getMetricCard(
                  "⚠️ Fraud Alerts",
                  metricsData.today.fraudAlerts,
                  <AlertTriangle className="h-6 w-6 text-red-600" />,
                  "bg-red-100",
                  true
                )}
              </div>
            </TabsContent>

            <TabsContent value="week" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getMetricCard(
                  "📦 Active Consignments",
                  metricsData.week.activeConsignments,
                  <Package className="h-6 w-6 text-blue-600" />,
                  "bg-blue-100"
                )}
                {getMetricCard(
                  "🚚 In Transit",
                  metricsData.week.inTransit,
                  <Truck className="h-6 w-6 text-green-600" />,
                  "bg-green-100"
                )}
                {getMetricCard(
                  "🧍 Active DAs",
                  metricsData.week.activeDAs,
                  <Users className="h-6 w-6 text-purple-600" />,
                  "bg-purple-100"
                )}
                {getMetricCard(
                  "⚠️ Fraud Alerts",
                  metricsData.week.fraudAlerts,
                  <AlertTriangle className="h-6 w-6 text-red-600" />,
                  "bg-red-100",
                  true
                )}
              </div>
            </TabsContent>

            <TabsContent value="month" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getMetricCard(
                  "📦 Active Consignments",
                  metricsData.month.activeConsignments,
                  <Package className="h-6 w-6 text-blue-600" />,
                  "bg-blue-100"
                )}
                {getMetricCard(
                  "🚚 In Transit",
                  metricsData.month.inTransit,
                  <Truck className="h-6 w-6 text-green-600" />,
                  "bg-green-100"
                )}
                {getMetricCard(
                  "🧍 Active DAs",
                  metricsData.month.activeDAs,
                  <Users className="h-6 w-6 text-purple-600" />,
                  "bg-purple-100"
                )}
                {getMetricCard(
                  "⚠️ Fraud Alerts",
                  metricsData.month.fraudAlerts,
                  <AlertTriangle className="h-6 w-6 text-red-600" />,
                  "bg-red-100",
                  true
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMetrics;
