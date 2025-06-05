
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from '../../utils/formValidation';

interface ExtraChargesSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string) => void;
}

const ExtraChargesSection = ({ formData, onFieldChange }: ExtraChargesSectionProps) => {
  return (
    <>
      {/* Extra Charges */}
      <div className="space-y-2">
        <Label htmlFor="extraChargesDescription">Extra Charges Description</Label>
        <Input
          id="extraChargesDescription"
          value={formData.extraChargesDescription}
          onChange={(e) => onFieldChange('extraChargesDescription', e.target.value)}
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
          onChange={(e) => onFieldChange('extraChargesAmount', e.target.value)}
          placeholder="Enter extra charges amount"
        />
      </div>
    </>
  );
};

export default ExtraChargesSection;
