
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderSnapshotProps {
  order: Order;
}

const OrderSnapshot = ({ order }: OrderSnapshotProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Order Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Order ID</label>
            <p className="font-semibold">{order.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Customer Name</label>
            <p className="font-semibold">{order.customer}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Product</label>
            <p>{order.product}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">State</label>
            <p>{order.state}</p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-500">Delivery Address</label>
            <p>{order.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSnapshot;
