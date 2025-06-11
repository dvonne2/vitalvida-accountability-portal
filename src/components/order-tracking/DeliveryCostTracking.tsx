
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DollarSign, Save } from 'lucide-react';
import { useDeliveryCosts } from '@/hooks/useDeliveryCosts';
import { Order } from '@/types/order';

interface DeliveryCostTrackingProps {
  order: Order;
  onDeliveryCostUpdate?: (orderId: string, costData: { deliveryCost: number; additionalCost?: number; additionalCostDescription?: string }) => void;
}

const DeliveryCostTracking = ({ order, onDeliveryCostUpdate }: DeliveryCostTrackingProps) => {
  const {
    deliveryCostData,
    setDeliveryCostData,
    isSavingCosts,
    costsLocked,
    handleSaveCosts
  } = useDeliveryCosts(
    order.deliveryCost,
    order.additionalCost,
    order.additionalCostDescription,
    onDeliveryCostUpdate
  );

  return (
    <Card className={`border-blue-200 ${costsLocked ? 'bg-gray-50' : 'bg-blue-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-blue-700">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Delivery Cost Tracking
          </div>
          {costsLocked && (
            <Badge variant="outline" className="text-green-700 border-green-300">
              ✅ Locked
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delivery-cost" className="text-sm font-medium">
              Delivery Cost (₦) *
            </Label>
            <Input
              id="delivery-cost"
              type="number"
              value={deliveryCostData.deliveryCost}
              onChange={(e) => setDeliveryCostData(prev => ({ ...prev, deliveryCost: e.target.value }))}
              placeholder="2500"
              className="mt-1"
              min="0"
              step="0.01"
              disabled={costsLocked}
            />
            <p className="text-xs text-gray-500 mt-1">
              Expected: ₦2,500. Amounts above will be flagged.
            </p>
          </div>

          <div>
            <Label htmlFor="additional-amount" className="text-sm font-medium">
              Additional Cost Amount (₦)
            </Label>
            <Input
              id="additional-amount"
              type="number"
              value={deliveryCostData.additionalCostAmount}
              onChange={(e) => setDeliveryCostData(prev => ({ ...prev, additionalCostAmount: e.target.value }))}
              placeholder="200"
              className="mt-1"
              min="0"
              step="0.01"
              disabled={costsLocked}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="additional-description" className="text-sm font-medium">
            Additional Cost Description
          </Label>
          <Input
            id="additional-description"
            type="text"
            value={deliveryCostData.additionalCostDescription}
            onChange={(e) => setDeliveryCostData(prev => ({ ...prev, additionalCostDescription: e.target.value }))}
            placeholder="e.g., Security gate fee, Toll charge, Fuel top-up"
            className="mt-1"
            disabled={costsLocked}
          />
          <p className="text-xs text-gray-500 mt-1">
            Required if additional amount is entered. Be specific - avoid vague terms.
          </p>
        </div>

        <div>
          <Label htmlFor="comments" className="text-sm font-medium">
            Comments / Remarks (Optional)
          </Label>
          <Textarea
            id="comments"
            value={deliveryCostData.comments}
            onChange={(e) => setDeliveryCostData(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="e.g., Customer rescheduled, DA went twice, unusual circumstances..."
            className="mt-1"
            rows={3}
            disabled={costsLocked}
          />
        </div>

        {!costsLocked && (
          <Button 
            onClick={() => handleSaveCosts(order.id)}
            disabled={isSavingCosts}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSavingCosts ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Saving Costs...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Delivery Costs
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryCostTracking;
