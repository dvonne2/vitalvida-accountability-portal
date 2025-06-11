
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from 'lucide-react';
import { useOrderTimeline } from '@/hooks/useOrderTimeline';
import { Order } from '@/types/order';

interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const { timelineEvents } = useOrderTimeline(order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Timeline of Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {event.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {event.name}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {event.actor}
                    </p>
                  </div>
                  <div className="text-right">
                    {event.timestamp ? (
                      <span className="text-sm font-medium">{event.timestamp}</span>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                    <div className="mt-1">
                      <Badge 
                        variant={event.proofStatus === 'uploaded' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {event.proofStatus === 'uploaded' ? '✅ Proof Uploaded' : 
                         event.proofStatus === 'pending' ? '⏳ Pending' : '❌ Missing Proof'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTimeline;
