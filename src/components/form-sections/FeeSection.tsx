
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData, ADMIN_LIMITS } from '../../utils/formValidation';

interface FeeSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string) => void;
}

const FeeSection = ({ formData, onFieldChange }: FeeSectionProps) => {
  return (
    <>
      {/* Fees */}
      <div className="space-y-2">
        <Label htmlFor="waybillFee">Waybill Fee (₦) *</Label>
        <Input
          id="waybillFee"
          type="number"
          min="0"
          value={formData.waybillFee}
          onChange={(e) => onFieldChange('waybillFee', e.target.value)}
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
          onChange={(e) => onFieldChange('parkFee', e.target.value)}
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
          onChange={(e) => onFieldChange('transportToParkFee', e.target.value)}
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
          onChange={(e) => onFieldChange('storekeeperLoadingFee', e.target.value)}
          placeholder="Enter loading fee"
          required
          className={Number(formData.storekeeperLoadingFee) > ADMIN_LIMITS.storekeeperLoadingFee ? 'border-red-300' : ''}
        />
        {Number(formData.storekeeperLoadingFee) > ADMIN_LIMITS.storekeeperLoadingFee && (
          <p className="text-xs text-red-600">Exceeds limit of ₦{ADMIN_LIMITS.storekeeperLoadingFee.toLocaleString()}</p>
        )}
      </div>
    </>
  );
};

export default FeeSection;
