
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrderRow from './OrderRow';
import { Order } from '@/types/order';

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
