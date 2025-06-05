
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from 'lucide-react';
import { FormData } from '../../utils/formValidation';

interface ConsignmentSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string) => void;
  onGenerateConsignment: () => void;
}

const ConsignmentSection = ({ formData, onFieldChange, onGenerateConsignment }: ConsignmentSectionProps) => {
  return (
    <>
      {/* Consignment Number */}
      <div className="space-y-2">
        <Label htmlFor="consignmentNumber">Consignment Number *</Label>
        <div className="flex space-x-2">
          <Input
            id="consignmentNumber"
            value={formData.consignmentNumber}
            onChange={(e) => onFieldChange('consignmentNumber', e.target.value)}
            placeholder="Auto-generated"
            required
            className="font-mono"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={onGenerateConsignment}
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
          onChange={(e) => onFieldChange('movementDate', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="movementType">Movement Type *</Label>
        <Select
          value={formData.movementType}
          onValueChange={(value) => onFieldChange('movementType', value)}
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
          onValueChange={(value) => onFieldChange('status', value)}
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
    </>
  );
};

export default ConsignmentSection;
