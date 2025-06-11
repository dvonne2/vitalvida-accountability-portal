
import { Order } from '@/types/order';

export const useWarningFlags = (order: Order) => {
  const getWarningFlags = () => {
    const flags = [];
    
    if (!order.daCalled) {
      flags.push({ text: 'No Call Made Yet', color: 'destructive' as const });
    }
    
    if (order.outForDelivery && !order.paymentReceived) {
      flags.push({ text: 'No Payment Detected', color: 'secondary' as const });
    }
    
    if (order.outForDelivery && !order.delivered) {
      flags.push({ text: 'Out > 6hrs Without Delivery', color: 'destructive' as const });
    }
    
    return flags;
  };

  return { getWarningFlags };
};
