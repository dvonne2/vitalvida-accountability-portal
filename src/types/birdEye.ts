
export interface BirdEyeEntry {
  id: string;
  movementDate: string;
  movementType: 'Warehouse to DA' | 'DA to DA' | 'DA to HQ';
  productName: string;
  productId: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  fromResponsible: string;
  toResponsible: string;
  expectedDeliveryDate: string;
  deliveryConfirmationDate?: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Returned' | 'Failed';
  waybillFee: number;
  parkFee: number;
  transportToParkFee: number;
  storekeeperLoadingFee: number;
  extraChargesDescription?: string;
  extraChargesAmount?: number;
  flag: {
    type: 'normal' | 'exceeds_limit' | 'overridden' | 'incomplete';
    display: string;
    color: 'green' | 'red' | 'orange' | 'yellow';
  };
  supervisorOverride?: {
    reason: string;
    timestamp: string;
    supervisorName: string;
  };
  createdAt: string;
  createdBy: string;
}

export interface FilterOptions {
  movementType?: string;
  productName?: string;
  status?: string;
  flagType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  requiresOverride: boolean;
  flagType: 'normal' | 'exceeds_limit' | 'overridden' | 'incomplete';
}
