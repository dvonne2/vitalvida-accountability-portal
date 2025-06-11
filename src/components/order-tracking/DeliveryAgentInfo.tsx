
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, MessageCircle } from 'lucide-react';
import { Order } from '@/types/order';

interface DeliveryAgentInfoProps {
  order: Order;
}

const DeliveryAgentInfo = ({ order }: DeliveryAgentInfoProps) => {
  const handleContactDA = () => {
    if (order.daPhone) {
      window.open(`https://wa.me/${order.daPhone.replace('+', '')}`, '_blank');
    }
  };

  const handleCallDA = () => {
    if (order.daPhone) {
      window.open(`tel:${order.daPhone}`, '_self');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Assigned Delivery Agent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">DA Code</label>
            <p className="font-semibold">{order.assignedDA}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">DA Name</label>
            <p className="font-semibold">{order.daName || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone Number</label>
            <p className="font-semibold">{order.daPhone || 'Not available'}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCallDA} disabled={!order.daPhone}>
              <Phone className="w-4 h-4 mr-1" />
              Call DA
            </Button>
            <Button variant="outline" size="sm" onClick={handleContactDA} disabled={!order.daPhone}>
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryAgentInfo;
