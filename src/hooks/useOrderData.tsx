
import { useState, useEffect } from 'react';
import { Order } from '@/types/order';

export const useOrderData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);

  useEffect(() => {
    // Mock real-time order data with enhanced structure
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
        daName: 'Abdul Yusuf',
        daPhone: '+2348012345678',
        warnings: [],
        deliveryCost: 2500,
        additionalCost: 200,
        additionalCostDescription: 'Security gate fee'
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
        daName: 'Kemi Adebayo',
        daPhone: '+2348023456789',
        warnings: [],
        deliveryCost: 2200
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
        daName: 'Ibrahim Musa',
        daPhone: '+2348034567890',
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
        daName: 'Emeka Okafor',
        daPhone: '+2348045678901',
        warnings: ['No Payment Detected'],
        deliveryCost: 3200,
        additionalCost: 500,
        additionalCostDescription: 'Multiple delivery attempts'
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

  const handleDeliveryCostUpdate = (orderId: string, costData: { deliveryCost: number; additionalCost?: number; additionalCostDescription?: string }) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              deliveryCost: costData.deliveryCost,
              additionalCost: costData.additionalCost,
              additionalCostDescription: costData.additionalCostDescription
            }
          : order
      )
    );
  };

  return {
    orders,
    pendingCount,
    deliveredCount,
    handleDeliveryCostUpdate
  };
};
