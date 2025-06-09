
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import OrderTrackingModal from './OrderTrackingModal';
import OrderMetrics from './OrderMetrics';
import OrdersTable from './OrdersTable';
import { useOrderData } from '@/hooks/useOrderData';
import { Order } from '@/types/order';

const LiveOrderFeed = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { orders, pendingCount, deliveredCount, handleDeliveryCostUpdate } = useOrderData();

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              🔴 "Pressure Dey" Live Order Pipeline
            </CardTitle>
            <OrderMetrics 
              pendingCount={pendingCount} 
              deliveredCount={deliveredCount} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <OrdersTable 
            orders={orders} 
            onOrderClick={setSelectedOrder}
          />
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDeliveryCostUpdate={handleDeliveryCostUpdate}
        />
      )}
    </TooltipProvider>
  );
};

export default LiveOrderFeed;
