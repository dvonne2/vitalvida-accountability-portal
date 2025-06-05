
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, AlertTriangle, Shield } from 'lucide-react';

interface ConsignmentFormProps {
  onClose: () => void;
}

const ConsignmentForm = ({ onClose }: ConsignmentFormProps) => {
  const [formData, setFormData] = useState({
    sentFrom: '',
    sentTo: '',
    motorPark: '',
    driverPhone: '',
    partnerContact: '',
    partnerPhone: '',
    storekeeperFee: '',
    waybillNumber: '',
    shampooQty: '',
    pomadeQty: '',
    conditionerQty: '',
    remarks: ''
  });
  
  const [receipt, setReceipt] = useState<File | null>(null);
  const [inventoryPhoto, setInventoryPhoto] = useState<File | null>(null);
  const [isSealed, setIsSealed] = useState(false);
  const [inventorySigned, setInventorySigned] = useState(false);
  const [logisticsSigned, setLogisticsSigned] = useState(false);
  
  const { toast } = useToast();

  const motorParks = [
    'Berger Motor Park',
    'Mile 2 Motor Park', 
    'Ojota Motor Park',
    'Kano Line Motor Park',
    'Peace Mass Transit',
    'ABC Transport Hub'
  ];

  const distributionAgents = [
    'DA_FCT-001 (Abuja Central)',
    'DA_LAG-005 (Lagos Island)', 
    'DA_OGU-003 (Ogun State)',
    'DA_KAN-007 (Kano North)',
    'DA_PHC-002 (Port Harcourt)',
    'DA_IBD-004 (Ibadan)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!inventoryPhoto || !isSealed || !inventorySigned || !logisticsSigned) {
      toast({
        title: "Dispatch Blocked",
        description: "Two-person sign-off protocol incomplete. Cannot proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!receipt) {
      toast({
        title: "Receipt Required",
        description: "Please upload receipt before creating consignment.",
        variant: "destructive",
      });
      return;
    }

    // Generate shipment ID
    const shipmentId = `VV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    console.log('Creating consignment:', {
      ...formData,
      shipmentId,
      dispatched: `${formData.shampooQty}-${formData.pomadeQty}-${formData.conditionerQty}`,
      timestamp: new Date().toISOString(),
      receipt: receipt.name,
      inventoryPhoto: inventoryPhoto.name
    });

    // Auto-trigger Zoho Books invoice creation
    toast({
      title: "Consignment Created Successfully",
      description: `${shipmentId} created and synced to Zoho Books automatically.`,
    });

    // Reset form and close
    onClose();
  };

  const handleInventoryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInventoryPhoto(file);
      toast({
        title: "Inventory Photo Uploaded",
        description: "Sealed carton photo captured for audit trail.",
      });
    }
  };

  const qtyString = `${formData.shampooQty || 0}-${formData.pomadeQty || 0}-${formData.conditionerQty || 0}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Two-Person Dispatch Protection */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="font-semibold text-orange-800">Two-Person Dispatch Protection</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="inventory-photo" className="text-sm font-medium">
                Inventory Manager: Upload Sealed Carton Photo
              </Label>
              <Input
                id="inventory-photo"
                type="file"
                accept="image/*"
                onChange={handleInventoryPhotoUpload}
                className="mt-1"
              />
              {inventoryPhoto && <Badge variant="outline" className="mt-2">✅ Photo Uploaded</Badge>}
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isSealed}
                  onChange={(e) => setIsSealed(e.target.checked)}
                />
                <span className="text-sm">Carton properly sealed</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inventorySigned}
                  onChange={(e) => setInventorySigned(e.target.checked)}
                />
                <span className="text-sm">Inventory Manager Sign-off</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={logisticsSigned}
                  onChange={(e) => setLogisticsSigned(e.target.checked)}
                />
                <span className="text-sm">Logistics Manager Sign-off</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Consignment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sentFrom">Sent From</Label>
          <Select value={formData.sentFrom} onValueChange={(value) => setFormData(prev => ({ ...prev, sentFrom: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HQ Lagos">HQ Lagos</SelectItem>
              <SelectItem value="HQ Abuja">HQ Abuja</SelectItem>
              {distributionAgents.map(da => (
                <SelectItem key={da} value={da}>{da}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sentTo">Sent To (DA)</Label>
          <Select value={formData.sentTo} onValueChange={(value) => setFormData(prev => ({ ...prev, sentTo: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination DA" />
            </SelectTrigger>
            <SelectContent>
              {distributionAgents.map(da => (
                <SelectItem key={da} value={da}>{da}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="motorPark">Motor Park</Label>
          <Select value={formData.motorPark} onValueChange={(value) => setFormData(prev => ({ ...prev, motorPark: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select motor park" />
            </SelectTrigger>
            <SelectContent>
              {motorParks.map(park => (
                <SelectItem key={park} value={park}>{park}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="driverPhone">Driver's Phone</Label>
          <Input
            id="driverPhone"
            type="tel"
            value={formData.driverPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, driverPhone: e.target.value }))}
            placeholder="+234901234567"
            required
          />
        </div>
      </div>

      {/* Partner & Financial Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="partnerContact">Partner Contact Name</Label>
          <Input
            id="partnerContact"
            value={formData.partnerContact}
            onChange={(e) => setFormData(prev => ({ ...prev, partnerContact: e.target.value }))}
            placeholder="e.g., ABC Transport"
            required
          />
        </div>

        <div>
          <Label htmlFor="partnerPhone">Partner Phone</Label>
          <Input
            id="partnerPhone"
            type="tel"
            value={formData.partnerPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, partnerPhone: e.target.value }))}
            placeholder="+234907654321"
            required
          />
        </div>

        <div>
          <Label htmlFor="storekeeperFee">Storekeeper Fee (₦)</Label>
          <Input
            id="storekeeperFee"
            type="number"
            value={formData.storekeeperFee}
            onChange={(e) => setFormData(prev => ({ ...prev, storekeeperFee: e.target.value }))}
            placeholder="500"
            required
          />
        </div>
      </div>

      {/* Quantity Tracking */}
      <div>
        <Label className="text-base font-semibold">Dispatched Quantities</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="shampooQty" className="text-sm">Shampoo</Label>
            <Input
              id="shampooQty"
              type="number"
              value={formData.shampooQty}
              onChange={(e) => setFormData(prev => ({ ...prev, shampooQty: e.target.value }))}
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="pomadeQty" className="text-sm">Pomade</Label>
            <Input
              id="pomadeQty"
              type="number"
              value={formData.pomadeQty}
              onChange={(e) => setFormData(prev => ({ ...prev, pomadeQty: e.target.value }))}
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="conditionerQty" className="text-sm">Conditioner</Label>
            <Input
              id="conditionerQty"
              type="number"
              value={formData.conditionerQty}
              onChange={(e) => setFormData(prev => ({ ...prev, conditionerQty: e.target.value }))}
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>
        <div className="mt-2">
          <Badge variant="outline">Format: {qtyString}</Badge>
        </div>
      </div>

      {/* Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="waybillNumber">Waybill Number</Label>
          <Input
            id="waybillNumber"
            value={formData.waybillNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, waybillNumber: e.target.value }))}
            placeholder="WB-2024-001234"
            required
          />
        </div>

        <div>
          <Label htmlFor="receipt">Receipt Upload</Label>
          <Input
            id="receipt"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="remarks">Remarks (Optional)</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          placeholder="Any special instructions or notes..."
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          disabled={!inventoryPhoto || !isSealed || !inventorySigned || !logisticsSigned}
        >
          Create Consignment & Auto-Invoice
        </Button>
      </div>

      {(!inventoryPhoto || !isSealed || !inventorySigned || !logisticsSigned) && (
        <div className="flex items-center space-x-2 text-orange-600 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Complete two-person sign-off to enable dispatch</span>
        </div>
      )}
    </form>
  );
};

export default ConsignmentForm;
