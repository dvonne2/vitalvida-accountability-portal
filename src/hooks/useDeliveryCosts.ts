
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface DeliveryCostData {
  deliveryCost: string;
  additionalCostAmount: string;
  additionalCostDescription: string;
  comments: string;
}

export const useDeliveryCosts = (
  initialDeliveryCost?: number,
  initialAdditionalCost?: number,
  initialAdditionalCostDescription?: string,
  onDeliveryCostUpdate?: (orderId: string, costData: { deliveryCost: number; additionalCost?: number; additionalCostDescription?: string }) => void
) => {
  const [deliveryCostData, setDeliveryCostData] = useState<DeliveryCostData>({
    deliveryCost: initialDeliveryCost?.toString() || '',
    additionalCostAmount: initialAdditionalCost?.toString() || '',
    additionalCostDescription: initialAdditionalCostDescription || '',
    comments: ''
  });
  const [isSavingCosts, setIsSavingCosts] = useState(false);
  const [costsLocked, setCostsLocked] = useState(!!initialDeliveryCost);
  const { toast } = useToast();

  const validateCostData = () => {
    if (!deliveryCostData.deliveryCost || parseFloat(deliveryCostData.deliveryCost) <= 0) {
      toast({
        title: "Validation Error",
        description: "Delivery cost is required and must be greater than 0.",
        variant: "destructive",
      });
      return false;
    }

    const hasAmount = deliveryCostData.additionalCostAmount && parseFloat(deliveryCostData.additionalCostAmount) > 0;
    const hasDescription = deliveryCostData.additionalCostDescription.trim() !== '';

    if (hasAmount && !hasDescription) {
      toast({
        title: "Validation Error",
        description: "Additional cost description is required when amount is entered.",
        variant: "destructive",
      });
      return false;
    }

    if (hasDescription && !hasAmount) {
      toast({
        title: "Validation Error",
        description: "Additional cost amount is required when description is provided.",
        variant: "destructive",
      });
      return false;
    }

    if (hasDescription) {
      const vague = ['misc', 'others', 'other', 'miscellaneous', 'extra'];
      const isVague = vague.some(word => 
        deliveryCostData.additionalCostDescription.toLowerCase().includes(word) && 
        deliveryCostData.additionalCostDescription.trim().length < 10
      );
      
      if (isVague) {
        toast({
          title: "Validation Error",
          description: "Please provide a clear and specific description for additional costs.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSaveCosts = async (orderId: string) => {
    if (!validateCostData()) return;

    setIsSavingCosts(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const costData = {
        orderId,
        deliveryCost: parseFloat(deliveryCostData.deliveryCost),
        additionalCost: deliveryCostData.additionalCostAmount ? parseFloat(deliveryCostData.additionalCostAmount) : 0,
        additionalCostDescription: deliveryCostData.additionalCostDescription || null,
        comments: deliveryCostData.comments || null,
        enteredBy: 'logistics_manager',
        timestamp: new Date().toISOString()
      };

      console.log('Saving delivery cost data:', costData);

      if (onDeliveryCostUpdate) {
        onDeliveryCostUpdate(orderId, {
          deliveryCost: costData.deliveryCost,
          additionalCost: costData.additionalCost || undefined,
          additionalCostDescription: costData.additionalCostDescription || undefined
        });
      }

      const deliveryCostThreshold = 2500;
      const exceedsThreshold = costData.deliveryCost > deliveryCostThreshold;

      toast({
        title: exceedsThreshold ? "Cost Saved - Flagged for Review" : "Delivery Costs Saved",
        description: exceedsThreshold 
          ? `Delivery cost of ₦${costData.deliveryCost} exceeds threshold and has been flagged.`
          : `Delivery costs for order ${orderId} have been recorded.`,
        variant: exceedsThreshold ? "destructive" : "default",
      });

      setCostsLocked(true);

    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving the delivery costs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingCosts(false);
    }
  };

  return {
    deliveryCostData,
    setDeliveryCostData,
    isSavingCosts,
    costsLocked,
    handleSaveCosts
  };
};
