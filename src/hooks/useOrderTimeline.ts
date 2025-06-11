
import { Phone, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { Order } from '@/types/order';

export interface TimelineEvent {
  name: string;
  timestamp: string;
  actor: string;
  icon: React.ReactNode;
  proofStatus: 'uploaded' | 'missing' | 'pending';
  completed: boolean;
}

export const useOrderTimeline = (order: Order) => {
  const timelineEvents: TimelineEvent[] = [
    {
      name: 'DA Called Customer',
      timestamp: order.daCalled,
      actor: 'DA',
      icon: <Phone className="w-4 h-4" />,
      proofStatus: order.daCalled ? 'uploaded' : 'missing',
      completed: !!order.daCalled
    },
    {
      name: 'Out for Delivery',
      timestamp: order.outForDelivery,
      actor: 'DA',
      icon: <Truck className="w-4 h-4" />,
      proofStatus: order.outForDelivery ? 'uploaded' : 'missing',
      completed: !!order.outForDelivery
    },
    {
      name: 'Payment Received',
      timestamp: order.paymentReceived,
      actor: 'Accountant',
      icon: <CreditCard className="w-4 h-4" />,
      proofStatus: order.paymentReceived ? 'uploaded' : 'missing',
      completed: !!order.paymentReceived
    },
    {
      name: 'Delivered',
      timestamp: order.delivered,
      actor: 'DA',
      icon: <CheckCircle className="w-4 h-4" />,
      proofStatus: order.delivered ? 'uploaded' : 'missing',
      completed: !!order.delivered
    }
  ];

  return { timelineEvents };
};
