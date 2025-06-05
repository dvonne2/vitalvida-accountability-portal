
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Save, X, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BirdEyeEntry, ValidationResult } from '../types/birdEye';
import SupervisorOverrideModal from './SupervisorOverrideModal';

interface BirdEyeFormProps {
  onSubmit: (entry: BirdEyeEntry) => void;
  onCancel: () => void;
}

const BirdEyeForm = ({ onSubmit, onCancel }: BirdEyeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    consignmentNumber: '',
    movementDate: '',
    movementType: '',
    productName: '',
    productId: '',
    quantity: '',
    fromLocation: '',
    toLocation: '',
    fromResponsible: '',
    toResponsible: '',
    expectedDeliveryDate: '',
    deliveryConfirmationDate: '',
    status: '',
    waybillFee: '',
    parkFee: '',
    transportToParkFee: '',
    storekeeperLoadingFee: '',
    extraChargesDescription: '',
    extraChargesAmount: ''
  });

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  // Generate consignment number on component mount
  useEffect(() => {
    generateConsignmentNumber();
  }, []);

  const generateConsignmentNumber = () => {
    const prefix = 'CNS';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const consignmentNumber = `${prefix}${timestamp}${random}`;
    setFormData(prev => ({ ...prev, consignmentNumber }));
  };

  // Business rules and limits (these would come from admin settings)
  const ADMIN_LIMITS = {
    parkFee: 5000,
    transportToParkFee: 3000,
    storekeeperLoadingFee: 1000
  };

  const validateForm = (): ValidationResult => {
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
      if (!formData[field as keyof typeof formData]) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm();
    setValidationResult(validation);

    if (!validation.isValid && validation.requiresOverride) {
      setShowOverrideModal(true);
      return;
    }

    if (!validation.isValid) {
      toast({
        title: "Validation Failed",
        description: "Please fix the errors before submitting",
        variant: "destructive"
      });
      return;
    }

    submitEntry(validation.flagType);
  };

  const submitEntry = (flagType: 'normal' | 'exceeds_limit' | 'overridden' | 'incomplete', override?: any) => {
    const flagConfig = {
      normal: { display: 'Normal', color: 'green' as const },
      exceeds_limit: { display: 'Exceeds Limit', color: 'red' as const },
      overridden: { display: 'Overridden', color: 'orange' as const },
      incomplete: { display: 'Incomplete', color: 'yellow' as const }
    };

    const entry: BirdEyeEntry = {
      id: `BE-${Date.now()}`,
      consignmentNumber: formData.consignmentNumber,
      movementDate: formData.movementDate,
      movementType: formData.movementType as any,
      productName: formData.productName,
      productId: formData.productId,
      quantity: Number(formData.quantity),
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      fromResponsible: formData.fromResponsible,
      toResponsible: formData.toResponsible,
      expectedDeliveryDate: formData.expectedDeliveryDate,
      deliveryConfirmationDate: formData.deliveryConfirmationDate || undefined,
      status: formData.status as any,
      waybillFee: Number(formData.waybillFee),
      parkFee: Number(formData.parkFee),
      transportToParkFee: Number(formData.transportToParkFee),
      storekeeperLoadingFee: Number(formData.storekeeperLoadingFee),
      extraChargesDescription: formData.extraChargesDescription || undefined,
      extraChargesAmount: formData.extraChargesAmount ? Number(formData.extraChargesAmount) : undefined,
      flag: {
        type: override ? 'overridden' : flagType,
        ...flagConfig[override ? 'overridden' : flagType]
      },
      supervisorOverride: override,
      createdAt: new Date().toISOString(),
      createdBy: 'logistics_manager'
    };

    onSubmit(entry);
    toast({
      title: "Entry Submitted",
      description: `Movement record ${entry.id} has been created`,
    });
  };

  const handleOverrideApproved = (override: any) => {
    submitEntry('overridden', override);
    setShowOverrideModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {validationResult && !validationResult.isValid && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Validation Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-red-600">
                {validationResult.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              {validationResult.requiresOverride && (
                <div className="mt-4 p-3 bg-orange-100 rounded border border-orange-200">
                  <p className="text-orange-700 font-medium">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Supervisor Override Required
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Consignment Number */}
          <div className="space-y-2">
            <Label htmlFor="consignmentNumber">Consignment Number *</Label>
            <div className="flex space-x-2">
              <Input
                id="consignmentNumber"
                value={formData.consignmentNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, consignmentNumber: e.target.value }))}
                placeholder="Auto-generated"
                required
                className="font-mono"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={generateConsignmentNumber}
                title="Generate new consignment number"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Movement Information */}
          <div className="space-y-2">
            <Label htmlFor="movementDate">Movement Date *</Label>
            <Input
              id="movementDate"
              type="date"
              value={formData.movementDate}
              onChange={(e) => setFormData(prev => ({ ...prev, movementDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movementType">Movement Type *</Label>
            <Select
              value={formData.movementType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, movementType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select movement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Warehouse to DA">Warehouse to DA</SelectItem>
                <SelectItem value="DA to DA">DA to DA</SelectItem>
                <SelectItem value="DA to HQ">DA to HQ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Information */}
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productId">Product ID (Zoho) *</Label>
            <Input
              id="productId"
              value={formData.productId}
              onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
              placeholder="Enter Zoho product ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Location Information */}
          <div className="space-y-2">
            <Label htmlFor="fromLocation">From Location *</Label>
            <Input
              id="fromLocation"
              value={formData.fromLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
              placeholder="HQ or DA code"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toLocation">To Location *</Label>
            <Input
              id="toLocation"
              value={formData.toLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, toLocation: e.target.value }))}
              placeholder="HQ or DA code"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromResponsible">From Responsible *</Label>
            <Input
              id="fromResponsible"
              value={formData.fromResponsible}
              onChange={(e) => setFormData(prev => ({ ...prev, fromResponsible: e.target.value }))}
              placeholder="Name of sender"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toResponsible">To Responsible *</Label>
            <Input
              id="toResponsible"
              value={formData.toResponsible}
              onChange={(e) => setFormData(prev => ({ ...prev, toResponsible: e.target.value }))}
              placeholder="Name of receiver"
              required
            />
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label htmlFor="expectedDeliveryDate">Expected Delivery Date *</Label>
            <Input
              id="expectedDeliveryDate"
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
              required
            />
          </div>

          {formData.status === 'Delivered' && (
            <div className="space-y-2">
              <Label htmlFor="deliveryConfirmationDate">Delivery Confirmation Date *</Label>
              <Input
                id="deliveryConfirmationDate"
                type="date"
                value={formData.deliveryConfirmationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryConfirmationDate: e.target.value }))}
                required
              />
            </div>
          )}

          {/* Fees */}
          <div className="space-y-2">
            <Label htmlFor="waybillFee">Waybill Fee (₦) *</Label>
            <Input
              id="waybillFee"
              type="number"
              min="0"
              value={formData.waybillFee}
              onChange={(e) => setFormData(prev => ({ ...prev, waybillFee: e.target.value }))}
              placeholder="Enter waybill fee"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkFee">Park Fee (₦) *</Label>
            <Input
              id="parkFee"
              type="number"
              min="0"
              value={formData.parkFee}
              onChange={(e) => setFormData(prev => ({ ...prev, parkFee: e.target.value }))}
              placeholder="Enter park fee"
              required
              className={Number(formData.parkFee) > ADMIN_LIMITS.parkFee ? 'border-red-300' : ''}
            />
            {Number(formData.parkFee) > ADMIN_LIMITS.parkFee && (
              <p className="text-xs text-red-600">Exceeds limit of ₦{ADMIN_LIMITS.parkFee.toLocaleString()}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportToParkFee">Transport to Park (₦) *</Label>
            <Input
              id="transportToParkFee"
              type="number"
              min="0"
              value={formData.transportToParkFee}
              onChange={(e) => setFormData(prev => ({ ...prev, transportToParkFee: e.target.value }))}
              placeholder="Enter transport fee"
              required
              className={Number(formData.transportToParkFee) > ADMIN_LIMITS.transportToParkFee ? 'border-red-300' : ''}
            />
            {Number(formData.transportToParkFee) > ADMIN_LIMITS.transportToParkFee && (
              <p className="text-xs text-red-600">Exceeds limit of ₦{ADMIN_LIMITS.transportToParkFee.toLocaleString()}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storekeeperLoadingFee">Storekeeper Loading Fee (₦) *</Label>
            <Input
              id="storekeeperLoadingFee"
              type="number"
              min="0"
              value={formData.storekeeperLoadingFee}
              onChange={(e) => setFormData(prev => ({ ...prev, storekeeperLoadingFee: e.target.value }))}
              placeholder="Enter loading fee"
              required
              className={Number(formData.storekeeperLoadingFee) > ADMIN_LIMITS.storekeeperLoadingFee ? 'border-red-300' : ''}
            />
            {Number(formData.storekeeperLoadingFee) > ADMIN_LIMITS.storekeeperLoadingFee && (
              <p className="text-xs text-red-600">Exceeds limit of ₦{ADMIN_LIMITS.storekeeperLoadingFee.toLocaleString()}</p>
            )}
          </div>

          {/* Extra Charges */}
          <div className="space-y-2">
            <Label htmlFor="extraChargesDescription">Extra Charges Description</Label>
            <Input
              id="extraChargesDescription"
              value={formData.extraChargesDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, extraChargesDescription: e.target.value }))}
              placeholder="Describe extra charges"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraChargesAmount">Extra Charges Amount (₦)</Label>
            <Input
              id="extraChargesAmount"
              type="number"
              min="0"
              value={formData.extraChargesAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, extraChargesAmount: e.target.value }))}
              placeholder="Enter extra charges amount"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Submit Movement
          </Button>
        </div>
      </form>

      <SupervisorOverrideModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        onApprove={handleOverrideApproved}
        validationErrors={validationResult?.errors || []}
      />
    </>
  );
};

export default BirdEyeForm;
