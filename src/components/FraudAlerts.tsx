
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Users, Clock, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FraudAlertsProps {
  limit?: number;
}

const FraudAlerts = ({ limit }: FraudAlertsProps) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const mockAlerts = [
      {
        id: 1,
        type: 'quantity_mismatch',
        severity: 'high',
        consignmentId: 'VV-2024-001',
        description: 'Inventory dispatched: 2-2-2, Logistics entered: 1-1-1, DA received: 1-1-1',
        da: 'DA_FCT-001',
        timestamp: new Date(Date.now() - 1800000),
        status: 'active',
        escalatedTo: ['Inventory Manager', 'Financial Controller', 'COO', 'CEO'],
        autoActions: ['Next consignment blocked', 'WhatsApp alerts sent', 'Email notifications sent']
      },
      {
        id: 2,
        type: 'delayed_pickup',
        severity: 'medium',
        consignmentId: 'VV-2024-002',
        description: 'Consignment at motor park for 4+ hours without pickup',
        da: 'DA_LAG-005',
        timestamp: new Date(Date.now() - 3600000),
        status: 'monitoring',
        escalatedTo: ['Logistics Manager'],
        autoActions: ['Reminder sent to DA', 'Guarantor notified']
      },
      {
        id: 3,
        type: 'unscanned_waybill',
        severity: 'low',
        consignmentId: 'VV-2024-003',
        description: 'Waybill not scanned within expected timeframe',
        da: 'DA_OGU-003',
        timestamp: new Date(Date.now() - 900000),
        status: 'resolved',
        escalatedTo: [],
        autoActions: ['Auto-reminder sent']
      }
    ];

    setAlerts(limit ? mockAlerts.slice(0, limit) : mockAlerts);
  }, [limit]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="destructive">Active</Badge>;
      case 'monitoring': return <Badge variant="secondary">Monitoring</Badge>;
      case 'resolved': return <Badge variant="outline">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleResolveAlert = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
    
    toast({
      title: "Alert Resolved",
      description: "Fraud alert has been marked as resolved.",
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'}`} />
                <CardTitle className="text-base font-semibold">
                  {alert.type.replace('_', ' ').toUpperCase()}
                </CardTitle>
                {getStatusBadge(alert.status)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimestamp(alert.timestamp)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Package className="w-3 h-3 mr-1" />
                    {alert.consignmentId}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {alert.da}
                  </div>
                </div>
              </div>

              {alert.escalatedTo.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1">ESCALATED TO:</h4>
                  <div className="flex flex-wrap gap-1">
                    {alert.escalatedTo.map((person: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {alert.autoActions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1">AUTO-ACTIONS TAKEN:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {alert.autoActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {alert.status === 'active' && (
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    Mark Resolved
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {alerts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p>No fraud alerts detected</p>
          <p className="text-sm">AI system monitoring all transactions</p>
        </div>
      )}
    </div>
  );
};

export default FraudAlerts;
