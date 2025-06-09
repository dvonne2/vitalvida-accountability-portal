
export interface Order {
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
