
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

const KPIScorecard = () => {
  const kpis: KPI[] = [
    {
      name: 'Dispatch Accuracy Rate',
      value: 98.5,
      target: 100,
      unit: '%',
      trend: 'down',
      description: '% where Inventory Qty = Logistics Qty'
    },
    {
      name: 'Delivery Chain Match Rate',
      value: 97.2,
      target: 95,
      unit: '%',
      trend: 'up',
      description: '% where Logistics Qty = DA Received = DA Delivered'
    },
    {
      name: 'Proof Compliance Score',
      value: 94.8,
      target: 100,
      unit: '%',
      trend: 'stable',
      description: '% of consignments with photo, receipt, unboxing proof'
    },
    {
      name: 'SLA Relay Completion Rate',
      value: 96.3,
      target: 95,
      unit: '%',
      trend: 'up',
      description: '% of deliveries picked up from park within 1hr of call'
    },
    {
      name: 'Fraud Escalation Response Time',
      value: 28,
      target: 30,
      unit: 'mins',
      trend: 'down',
      description: 'Avg. time to resolve flagged mismatch'
    }
  ];

  const getKPIStatus = (value: number, target: number, unit: string) => {
    const isPercentage = unit === '%';
    const threshold = isPercentage ? 5 : 10;
    
    if (unit === 'mins') {
      return value <= target ? 'excellent' : value <= target + threshold ? 'good' : 'poor';
    }
    
    if (value >= target) return 'excellent';
    if (value >= target - threshold) return 'good';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 KPI Performance Scorecard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {kpis.map((kpi, index) => {
            const status = getKPIStatus(kpi.value, kpi.target, kpi.unit);
            const progressPercent = kpi.unit === 'mins' 
              ? Math.max(0, Math.min(100, ((kpi.target - kpi.value + kpi.target) / kpi.target) * 100))
              : (kpi.value / kpi.target) * 100;

            return (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{kpi.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(kpi.trend)}
                    <Badge className={getStatusColor(status)}>
                      {kpi.value}{kpi.unit}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Current: {kpi.value}{kpi.unit}</span>
                    <span>Target: {kpi.target}{kpi.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'excellent' ? 'bg-green-500' : 
                        status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, progressPercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIScorecard;
