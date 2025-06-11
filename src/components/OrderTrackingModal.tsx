
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ProofUploadModal from './ProofUploadModal';
import OrderSnapshot from './order-tracking/OrderSnapshot';
import DeliveryAgentInfo from './order-tracking/DeliveryAgentInfo';
import OrderTimeline from './order-tracking/OrderTimeline';
import DeliveryCostTracking from './order-tracking/DeliveryCostTracking';
import WarningFlags from './order-tracking/WarningFlags';
import ProofUploadSection from './order-tracking/ProofUploadSection';
import { Order } from '@/types/order';

interface OrderTrackingModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onDeliveryCostUpdate?: (orderId: string, costData: { deliveryCost: number; additionalCost?: number; additionalCostDescription?: string }) => void;
}

const OrderTrackingModal = ({ order, isOpen, onClose, onDeliveryCostUpdate }: OrderTrackingModalProps) => {
  const [proofUploadType, setProofUploadType] = useState<string | null>(null);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Order Tracking: {order.id}</span>
              <Badge variant="outline">{order.status}</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <OrderSnapshot order={order} />
            <DeliveryAgentInfo order={order} />
            <OrderTimeline order={order} />
            <DeliveryCostTracking 
              order={order} 
              onDeliveryCostUpdate={onDeliveryCostUpdate}
            />
            <WarningFlags order={order} />
            <ProofUploadSection onUploadClick={setProofUploadType} />
          </div>
        </DialogContent>
      </Dialog>

      {proofUploadType && (
        <ProofUploadModal
          uploadType={proofUploadType}
          orderId={order.id}
          isOpen={!!proofUploadType}
          onClose={() => setProofUploadType(null)}
        />
      )}
    </>
  );
};

export default OrderTrackingModal;
