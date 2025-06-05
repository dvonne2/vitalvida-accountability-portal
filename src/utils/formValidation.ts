
import { ValidationResult } from '../types/birdEye';

export interface FormData {
  consignmentNumber: string;
  movementDate: string;
  movementType: string;
  productName: string;
  productId: string;
  quantity: string;
  fromLocation: string;
  toLocation: string;
  fromResponsible: string;
  toResponsible: string;
  expectedDeliveryDate: string;
  deliveryConfirmationDate: string;
  status: string;
  waybillFee: string;
  parkFee: string;
  transportToParkFee: string;
  storekeeperLoadingFee: string;
  extraChargesDescription: string;
  extraChargesAmount: string;
}

// Business rules and limits (these would come from admin settings)
export const ADMIN_LIMITS = {
  parkFee: 5000,
  transportToParkFee: 3000,
  storekeeperLoadingFee: 1000
};

export const validateForm = (formData: FormData): ValidationResult => {
  const errors: string[] = [];
  let requiresOverride = false;
  let flagType: 'normal' | 'exceeds_limit' | 'overridden' | 'incomplete' = 'normal';

  // Required field validation
  const requiredFields = [
    'consignmentNumber', 'movementDate', 'movementType', 'productName', 'productId', 'quantity',
    'fromLocation', 'toLocation', 'fromResponsible', 'toResponsible',
    'expectedDeliveryDate', 'status', 'waybillFee', 'parkFee',
    'transportToParkFee', 'storekeeperLoadingFee'
  ];

  requiredFields.forEach(field => {
    if (!formData[field as keyof FormData]) {
      errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
    }
  });

  // Consignment number format validation
  if (formData.consignmentNumber && !/^CNS\d{11}$/.test(formData.consignmentNumber)) {
    errors.push('Invalid consignment number format');
  }

  // Business rule validations
  if (formData.quantity && Number(formData.quantity) <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  if (formData.expectedDeliveryDate && formData.movementDate) {
    if (new Date(formData.expectedDeliveryDate) < new Date(formData.movementDate)) {
      errors.push('Expected delivery date must be on or after movement date');
    }
  }

  if (formData.status === 'Delivered' && !formData.deliveryConfirmationDate) {
    errors.push('Delivery confirmation date is required when status is Delivered');
  }

  // Fee limit checks
  if (Number(formData.parkFee) > ADMIN_LIMITS.parkFee) {
    requiresOverride = true;
    flagType = 'exceeds_limit';
    errors.push(`Park fee exceeds limit of ₦${ADMIN_LIMITS.parkFee.toLocaleString()}`);
  }

  if (Number(formData.transportToParkFee) > ADMIN_LIMITS.transportToParkFee) {
    requiresOverride = true;
    flagType = 'exceeds_limit';
    errors.push(`Transport to park fee exceeds limit of ₦${ADMIN_LIMITS.transportToParkFee.toLocaleString()}`);
  }

  if (Number(formData.storekeeperLoadingFee) > ADMIN_LIMITS.storekeeperLoadingFee) {
    requiresOverride = true;
    flagType = 'exceeds_limit';
    errors.push(`Storekeeper loading fee exceeds limit of ₦${ADMIN_LIMITS.storekeeperLoadingFee.toLocaleString()}`);
  }

  // Extra charges validation
  if (formData.extraChargesDescription && !formData.extraChargesAmount) {
    errors.push('Extra charges amount is required when description is provided');
  }
  if (formData.extraChargesAmount && !formData.extraChargesDescription) {
    errors.push('Extra charges description is required when amount is provided');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requiresOverride,
    flagType
  };
};

export const generateConsignmentNumber = (): string => {
  const prefix = 'CNS';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};
