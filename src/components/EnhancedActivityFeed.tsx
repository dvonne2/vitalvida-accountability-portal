
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Phone, Truck, Package, CheckCircle, AlertTriangle, Search } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  da?: string;
  orderId?: string;
  status: 'normal' | 'flagged' | 'delivered' | 'alert';
  icon: React.ComponentType<any>;
  color: string;
}

const EnhancedActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'unflagged'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: 1,
        type: 'pickup_logged',
        message: '📦 DA_Kano picked up #FHG202506-003 from Jibowu Park at 10:44AM',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        da: 'DA_Kano',
        orderId: '#FHG202506-003',
        status: 'normal',
        icon: Package,
        color: 'text-blue-600'
      },
      {
        id: 2,
        type: 'otp_submitted',
        message: '✅ OTP submitted for Order #10056 by DA_FCT-001 — 11:19AM',
        timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
        da: 'DA_FCT-001',
        orderId: '#10056',
        status: 'delivered',
        icon: CheckCircle,
        color: 'text-green-600'
      },
      {
        id: 3,
        type: 'mismatch_flagged',
        message: '⚠️ Mismatch flagged on #FHG202506-002: Qty difference',
        timestamp: new Date(Date.now() - 240000).toLocaleTimeString(),
        orderId: '#FHG202506-002',
        status: 'flagged',
        icon: AlertTriangle,
        color: 'text-red-600'
      },
      {
        id: 4,
        type: 'customer_called',
        message: '📞 DA_LAG-007 called customer for Order #10058',
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
        da: 'DA_LAG-007',
        orderId: '#10058',
        status: 'normal',
        icon: Phone,
        color: 'text-purple-600'
      },
      {
        id: 5,
        type: 'in_transit',
        message: '🚚 Order #10059 marked In Transit by DA_ABJ-012',
        timestamp: new Date(Date.now() - 360000).toLocaleTimeString(),
        da: 'DA_ABJ-012',
        orderId: '#10059',
        status: 'normal',
        icon: Truck,
        color: 'text-orange-600'
      }
    ];

    setActivities(mockActivities);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Refreshing activity feed...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || 
      (filter === 'flagged' && activity.status === 'flagged') ||
      (filter === 'unflagged' && activity.status !== 'flagged');
    
    const matchesSearch = searchTerm === '' ||
      activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.da?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'flagged':
        return <Badge variant="destructive" className="text-xs">FLAGGED</Badge>;
      case 'delivered':
        return <Badge variant="default" className="text-xs bg-green-600">DELIVERED</Badge>;
      case 'alert':
        return <Badge variant="destructive" className="text-xs animate-pulse">ALERT</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🔁 Live Activity Feed</span>
          <Badge variant="outline" className="animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
        
        <div className="flex space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by DA name or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="flagged">Flagged Only</SelectItem>
              <SelectItem value="unflagged">Normal Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredActivities.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No activities match your current filter
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedActivityFeed;
