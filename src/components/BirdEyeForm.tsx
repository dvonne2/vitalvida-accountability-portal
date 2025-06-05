
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BirdEyeEntry, ValidationResult } from '../types/birdEye';
import { FormData, validateForm, generateConsignmentNumber } from '../utils/formValidation';
import SupervisorOverrideModal from './SupervisorOverrideModal';
import ConsignmentSection from './form-sections/ConsignmentSection';
import ProductSection from './form-sections/ProductSection';
import LocationSection from './form-sections/LocationSection';
import FeeSection from './form-sections/FeeSection';
import ExtraChargesSection from './form-sections/ExtraChargesSection';

interface BirdEyeFormProps {
  onSubmit: (entry: BirdEyeEntry) => void;
  onCancel: () => void;
}

const BirdEyeForm = ({ onSubmit, onCancel }: BirdEyeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
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
    handleGenerateConsignment();
  }, []);

  const handleGenerateConsignment = () => {
    const consignmentNumber = generateConsignmentNumber();
    setFormData(prev => ({ ...prev, consignmentNumber }));
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm(formData);
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
          <ConsignmentSection 
            formData={formData}
            onFieldChange={handleFieldChange}
            onGenerateConsignment={handleGenerateConsignment}
          />
          
          <ProductSection 
            formData={formData}
            onFieldChange={handleFieldChange}
          />
          
          <LocationSection 
            formData={formData}
            onFieldChange={handleFieldChange}
          />
          
          <FeeSection 
            formData={formData}
            onFieldChange={handleFieldChange}
          />
          
          <ExtraChargesSection 
            formData={formData}
            onFieldChange={handleFieldChange}
          />
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
