
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  product: string;
  assigned: string;
  callTime: string;
  daAssigned: string;
  payment: string;
  delivered: string;
  status: 'delivered' | 'in_progress' | 'pending' | 'breach';
}

const LiveOrderFeed = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);

  useEffect(() => {
    // Mock real-time order data
    const mockOrders: Order[] = [
      {
        id: '10057',
        customer: 'Adam J.',
        product: 'Multivitamin Pack',
        assigned: '09:36',
        callTime: '09:50',
        daAssigned: '10:11',
        payment: '10:21',
        delivered: '12:18',
        status: 'delivered'
      },
      {
        id: '10056',
        customer: 'Omololu A.',
        product: 'Omega 3 Softgels',
        assigned: '08:00',
        callTime: '08:28',
        daAssigned: '08:48',
        payment: '09:07',
        delivered: '11:14',
        status: 'delivered'
      },
      {
        id: '10052',
        customer: 'Kemi O.',
        product: 'Electrolyte Drink',
        assigned: '06:01',
        callTime: '—',
        daAssigned: '—',
        payment: '—',
        delivered: '❌ PENDING',
        status: 'breach'
      },
      {
        id: '10055',
        customer: 'Blessing N.',
        product: 'Vitamin C Tablets',
        assigned: '10:15',
        callTime: '10:30',
        daAssigned: '10:45',
        payment: '—',
        delivered: '—',
        status: 'in_progress'
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

  return (
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
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Call Time</TableHead>
              <TableHead>DA Assigned</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className={getRowColor(order.status)}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.assigned}</TableCell>
                <TableCell>{order.callTime}</TableCell>
                <TableCell>{order.daAssigned}</TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell>
                  {order.status === 'delivered' ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {order.delivered}
                    </span>
                  ) : order.status === 'breach' ? (
                    <span className="text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {order.delivered}
                    </span>
                  ) : (
                    <span className="text-yellow-600">In Progress</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LiveOrderFeed;
