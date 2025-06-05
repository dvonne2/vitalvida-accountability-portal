
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Phone, Truck, Package, CheckCircle, AlertTriangle } from 'lucide-react';

interface ActivityFeedProps {
  limit?: number;
}

const ActivityFeed = ({ limit }: ActivityFeedProps) => {
  const [activities, setActivities] = useState<any[]>([]);

  // Mock real-time activity data
  useEffect(() => {
    const mockActivities = [
      {
        id: 1,
        type: 'assignment_acknowledged',
        da: 'DA_FCT-001',
        orderId: '#1010567',
        customer: 'Nneka',
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
        icon: CheckCircle,
        color: 'text-green-600'
      },
      {
        id: 2,
        type: 'customer_called',
        da: 'DA_FCT-001',
        customer: 'Nneka',
        timestamp: new Date(Date.now() - 240000).toLocaleTimeString(),
        icon: Phone,
        color: 'text-blue-600'
      },
      {
        id: 3,
        type: 'out_for_delivery',
        da: 'DA_FCT-001',
        orderId: '#1010567',
        timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
        icon: Truck,
        color: 'text-purple-600'
      },
      {
        id: 4,
        type: 'payment_proof_uploaded',
        da: 'DA_FCT-001',
        orderId: '#1010567',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        icon: Package,
        color: 'text-orange-600'
      },
      {
        id: 5,
        type: 'otp_delivery',
        da: 'DA_FCT-001',
        orderId: '#1010567',
        timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
        icon: CheckCircle,
        color: 'text-green-600'
      },
      {
        id: 6,
        type: 'fraud_alert',
        da: 'DA_LAG-005',
        issue: 'Quantity Mismatch',
        timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
        icon: AlertTriangle,
        color: 'text-red-600'
      }
    ];

    setActivities(limit ? mockActivities.slice(0, limit) : mockActivities);
  }, [limit]);

  const getActivityMessage = (activity: any) => {
    switch (activity.type) {
      case 'assignment_acknowledged':
        return `${activity.da} agreed to deliver Order ${activity.orderId} to ${activity.customer}`;
      case 'customer_called':
        return `${activity.da} called ${activity.customer}`;
      case 'out_for_delivery':
        return `Order ${activity.orderId} marked In Transit`;
      case 'payment_proof_uploaded':
        return `Order ${activity.orderId} proof uploaded`;
      case 'otp_delivery':
        return `Order ${activity.orderId} delivered via OTP`;
      case 'fraud_alert':
        return `⚠️ ${activity.issue} detected for ${activity.da}`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const IconComponent = activity.icon;
        return (
          <Card key={activity.id} className="border-l-4 border-l-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <IconComponent className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {getActivityMessage(activity)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    {activity.type === 'fraud_alert' && (
                      <Badge variant="destructive" className="text-xs">URGENT</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {activities.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No recent activity
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
