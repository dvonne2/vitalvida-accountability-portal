
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from '../../utils/formValidation';

interface LocationSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string) => void;
}

const LocationSection = ({ formData, onFieldChange }: LocationSectionProps) => {
  return (
    <>
      {/* Location Information */}
      <div className="space-y-2">
        <Label htmlFor="fromLocation">From Location *</Label>
        <Input
          id="fromLocation"
          value={formData.fromLocation}
          onChange={(e) => onFieldChange('fromLocation', e.target.value)}
          placeholder="HQ or DA code"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="toLocation">To Location *</Label>
        <Input
          id="toLocation"
          value={formData.toLocation}
          onChange={(e) => onFieldChange('toLocation', e.target.value)}
          placeholder="HQ or DA code"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fromResponsible">From Responsible *</Label>
        <Input
          id="fromResponsible"
          value={formData.fromResponsible}
          onChange={(e) => onFieldChange('fromResponsible', e.target.value)}
          placeholder="Name of sender"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="toResponsible">To Responsible *</Label>
        <Input
          id="toResponsible"
          value={formData.toResponsible}
          onChange={(e) => onFieldChange('toResponsible', e.target.value)}
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
          onChange={(e) => onFieldChange('expectedDeliveryDate', e.target.value)}
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
            onChange={(e) => onFieldChange('deliveryConfirmationDate', e.target.value)}
            required
          />
        </div>
      )}
    </>
  );
};

export default LocationSection;
