
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrderRow from './OrderRow';

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
  daName?: string;
  daPhone?: string;
  warnings: string[];
  deliveryCost?: number;
  additionalCost?: number;
  additionalCostDescription?: string;
}

interface OrdersTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

const OrdersTable = ({ orders, onOrderClick }: OrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>DA Called Customer</TableHead>
          <TableHead>Out for Delivery</TableHead>
          <TableHead>Delivery Cost (₦)</TableHead>
          <TableHead>Additional Cost (₦)</TableHead>
          <TableHead>Payment Received</TableHead>
          <TableHead>Delivered</TableHead>
          <TableHead>Warnings</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <OrderRow 
            key={order.id} 
            order={order} 
            onOrderClick={onOrderClick}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
