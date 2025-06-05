
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, AlertTriangle, CheckCircle, Clock, Phone } from 'lucide-react';

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

interface OrderRowProps {
  order: Order;
  onOrderClick: (order: Order) => void;
}

const OrderRow = ({ order, onOrderClick }: OrderRowProps) => {
  const getRowColor = (status: string, deliveryCost?: number) => {
    // High delivery cost takes priority
    if (deliveryCost && deliveryCost > 2500) {
      return 'bg-yellow-50 border-l-4 border-l-yellow-500';
    }
    
    switch (status) {
      case 'delivered':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'in_progress':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
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

  const formatCurrency = (amount?: number) => {
    if (!amount) return '—';
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <TableRow className={getRowColor(order.status, order.deliveryCost)}>
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
        <div className="flex items-center">
          <span className={order.deliveryCost && order.deliveryCost > 2500 ? 'text-yellow-700 font-semibold' : ''}>
            {formatCurrency(order.deliveryCost)}
          </span>
          {order.deliveryCost && order.deliveryCost > 2500 && (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="w-4 h-4 ml-1 text-yellow-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delivery Cost Exceeds Limit – Review Suggested</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
      <TableCell>
        {order.additionalCost ? (
          <Tooltip>
            <TooltipTrigger>
              <span className="text-blue-600 cursor-help">
                {formatCurrency(order.additionalCost)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{order.additionalCostDescription || 'Additional cost'}</p>
            </TooltipContent>
          </Tooltip>
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
          onClick={() => onOrderClick(order)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
