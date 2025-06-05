
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, AlertTriangle, CheckCircle, Clock, Phone } from 'lucide-react';
import OrderTrackingModal from './OrderTrackingModal';

interface Order {
  id: string;
  customer: string;
  product: string;
  daCalled: string;
  outForDelivery: string;
  paymentReceived: string;
  delivered: string;
  status: 'delivered' | 'in_progress' | 'pending' | 'breach';
  address: string;
  state: string;
  assignedDA: string;
  warnings: string[];
}

const LiveOrderFeed = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);

  useEffect(() => {
    // Mock real-time order data with new structure
    const mockOrders: Order[] = [
      {
        id: '10057',
        customer: 'Adam J.',
        product: 'Multivitamin Pack',
        daCalled: '09:50',
        outForDelivery: '10:11',
        paymentReceived: '10:21',
        delivered: '12:18',
        status: 'delivered',
        address: '15 Admiralty Way, Lekki Phase 1',
        state: 'Lagos',
        assignedDA: 'DA_LAG_001',
        warnings: []
      },
      {
        id: '10056',
        customer: 'Omololu A.',
        product: 'Omega 3 Softgels',
        daCalled: '08:28',
        outForDelivery: '08:48',
        paymentReceived: '09:07',
        delivered: '11:14',
        status: 'delivered',
        address: '42 Herbert Macaulay Street, Yaba',
        state: 'Lagos',
        assignedDA: 'DA_LAG_003',
        warnings: []
      },
      {
        id: '10052',
        customer: 'Kemi O.',
        product: 'Electrolyte Drink',
        daCalled: '',
        outForDelivery: '',
        paymentReceived: '',
        delivered: '',
        status: 'breach',
        address: '8 Gimbiya Street, Area 11',
        state: 'FCT',
        assignedDA: 'DA_FCT_002',
        warnings: ['No Call Made Yet']
      },
      {
        id: '10055',
        customer: 'Blessing N.',
        product: 'Vitamin C Tablets',
        daCalled: '10:30',
        outForDelivery: '10:45',
        paymentReceived: '',
        delivered: '',
        status: 'in_progress',
        address: '23 Awolowo Road, Ikoyi',
        state: 'Lagos',
        assignedDA: 'DA_LAG_005',
        warnings: ['No Payment Detected']
      }
    ];

    setOrders(mockOrders);
    setPendingCount(mockOrders.filter(o => o.status === 'breach' || o.status === 'pending').length);
    setDeliveredCount(mockOrders.filter(o => o.status === 'delivered').length);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Refreshing order feed...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getRowColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'in_progress':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      case 'breach':
      case 'pending':
        return 'bg-red-50 border-l-4 border-l-red-500';
      default:
        return '';
    }
  };

  const getWarningFlag = (warnings: string[]) => {
    if (warnings.length === 0) return null;
    
    const hasRedFlag = warnings.some(w => 
      w.includes('No Call Made Yet') || w.includes('Out > 6hrs Without Delivery')
    );
    
    return (
      <Badge variant={hasRedFlag ? 'destructive' : 'secondary'} className="text-xs">
        {warnings[0]}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              🔴 "Pressure Dey" Live Order Pipeline
            </CardTitle>
            <div className="flex space-x-2">
              <Badge variant="destructive" className="animate-pulse">
                🚨 {pendingCount} ORDER(S) WAITING
              </Badge>
              <Badge variant="default" className="bg-green-600">
                💰 ✔ {deliveredCount} DELIVERED
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>DA Called Customer</TableHead>
                <TableHead>Out for Delivery</TableHead>
                <TableHead>Payment Received</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Warnings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className={getRowColor(order.status)}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>
                    {order.daCalled ? (
                      <span className="text-green-600 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {order.daCalled}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.outForDelivery ? (
                      <span className="text-blue-600">{order.outForDelivery}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.paymentReceived ? (
                      <span className="text-green-600">{order.paymentReceived}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.status === 'delivered' ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {order.delivered}
                      </span>
                    ) : order.status === 'breach' ? (
                      <span className="text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        PENDING
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        In Progress
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getWarningFlag(order.warnings)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default LiveOrderFeed;
