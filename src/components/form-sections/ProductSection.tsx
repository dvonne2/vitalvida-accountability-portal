
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from '../../utils/formValidation';

interface ProductSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string) => void;
}

const ProductSection = ({ formData, onFieldChange }: ProductSectionProps) => {
  return (
    <>
      {/* Product Information */}
      <div className="space-y-2">
        <Label htmlFor="productName">Product Name *</Label>
        <Input
          id="productName"
          value={formData.productName}
          onChange={(e) => onFieldChange('productName', e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productId">Product ID (Zoho) *</Label>
        <Input
          id="productId"
          value={formData.productId}
          onChange={(e) => onFieldChange('productId', e.target.value)}
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
          onChange={(e) => onFieldChange('quantity', e.target.value)}
          placeholder="Enter quantity"
          required
        />
      </div>
    </>
  );
};

export default ProductSection;
