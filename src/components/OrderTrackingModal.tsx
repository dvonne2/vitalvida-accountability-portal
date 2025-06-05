import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Phone, Truck, CreditCard, CheckCircle, AlertTriangle, Clock, User, FileText, DollarSign, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ProofUploadModal from './ProofUploadModal';

interface Order {
  id: string;
  customer: string;
  product: string;
  daCalled: string;
  outForDelivery: string;
  paymentReceived: string;
  delivered: string;
  status: 'delivered' | 'in_progress' | 'pending' | 'breach';
  address: string;
  state: string;
  assignedDA: string;
  warnings: string[];
}

interface OrderTrackingModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

interface TimelineEvent {
  name: string;
  timestamp: string;
  actor: string;
  icon: React.ReactNode;
  proofLink?: string;
  completed: boolean;
}

interface DeliveryCostData {
  deliveryCost: string;
  additionalCostAmount: string;
  additionalCostDescription: string;
  comments: string;
}

const OrderTrackingModal = ({ order, isOpen, onClose }: OrderTrackingModalProps) => {
  const [proofUploadType, setProofUploadType] = useState<string | null>(null);
  const [deliveryCostData, setDeliveryCostData] = useState<DeliveryCostData>({
    deliveryCost: '',
    additionalCostAmount: '',
    additionalCostDescription: '',
    comments: ''
  });
  const [isSavingCosts, setIsSavingCosts] = useState(false);
  const { toast } = useToast();

  const timelineEvents: TimelineEvent[] = [
    {
      name: 'DA Called Customer',
      timestamp: order.daCalled,
      actor: 'DA',
      icon: <Phone className="w-4 h-4" />,
      completed: !!order.daCalled
    },
    {
      name: 'Out for Delivery',
      timestamp: order.outForDelivery,
      actor: 'DA',
      icon: <Truck className="w-4 h-4" />,
      completed: !!order.outForDelivery
    },
    {
      name: 'Payment Received',
      timestamp: order.paymentReceived,
      actor: 'Accountant',
      icon: <CreditCard className="w-4 h-4" />,
      completed: !!order.paymentReceived
    },
    {
      name: 'Delivered',
      timestamp: order.delivered,
      actor: 'DA',
      icon: <CheckCircle className="w-4 h-4" />,
      completed: !!order.delivered
    }
  ];

  const proofUploadTypes = [
    { type: 'call_screenshot', label: 'Call Screenshot', description: 'Shows DA called customer' },
    { type: 'waybill_photo', label: 'Waybill Photo', description: 'Confirms goods were shipped' },
    { type: 'payment_screenshot', label: 'Payment Screenshot', description: 'Confirms customer payment' },
    { type: 'delivery_confirmation', label: 'Delivery Confirmation', description: 'OTP entry or image proof' }
  ];

  const getWarningFlags = () => {
    const flags = [];
    
    if (!order.daCalled) {
      flags.push({ text: 'No Call Made Yet', color: 'destructive' as const });
    }
    
    if (order.outForDelivery && !order.paymentReceived) {
      flags.push({ text: 'No Payment Detected', color: 'secondary' as const });
    }
    
    if (order.outForDelivery && !order.delivered) {
      flags.push({ text: 'Out > 6hrs Without Delivery', color: 'destructive' as const });
    }
    
    return flags;
  };

  const validateCostData = () => {
    // Delivery cost is required
    if (!deliveryCostData.deliveryCost || parseFloat(deliveryCostData.deliveryCost) <= 0) {
      toast({
        title: "Validation Error",
        description: "Delivery cost is required and must be greater than 0.",
        variant: "destructive",
      });
      return false;
    }

    // If additional cost amount is provided, description must be provided and vice versa
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

    // Check if description is too vague
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

  const handleSaveCosts = async () => {
    if (!validateCostData()) return;

    setIsSavingCosts(true);

    try {
      // Mock save - in real app this would hit your API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const costData = {
        orderId: order.id,
        deliveryCost: parseFloat(deliveryCostData.deliveryCost),
        additionalCost: deliveryCostData.additionalCostAmount ? parseFloat(deliveryCostData.additionalCostAmount) : 0,
        additionalCostDescription: deliveryCostData.additionalCostDescription || null,
        comments: deliveryCostData.comments || null,
        enteredBy: 'logistics_manager',
        timestamp: new Date().toISOString()
      };

      console.log('Saving delivery cost data:', costData);

      // Check if delivery cost exceeds threshold (₦2,500)
      const deliveryCostThreshold = 2500;
      const exceedsThreshold = costData.deliveryCost > deliveryCostThreshold;

      toast({
        title: exceedsThreshold ? "Cost Saved - Flagged for Review" : "Delivery Costs Saved",
        description: exceedsThreshold 
          ? `Delivery cost of ₦${costData.deliveryCost} exceeds threshold and has been flagged.`
          : `Delivery costs for order ${order.id} have been recorded.`,
        variant: exceedsThreshold ? "destructive" : "default",
      });

      // Reset form
      setDeliveryCostData({
        deliveryCost: '',
        additionalCostAmount: '',
        additionalCostDescription: '',
        comments: ''
      });

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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Order Tracking: {order.id}</span>
              <Badge variant="outline">{order.status}</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 1. ORDER SNAPSHOT */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Order Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Order ID</label>
                    <p className="font-semibold">{order.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Name</label>
                    <p className="font-semibold">{order.customer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product</label>
                    <p>{order.product}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">State</label>
                    <p>{order.state}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                    <p>{order.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. TIMELINE OF EVENTS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Timeline of Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {event.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                              {event.name}
                            </h4>
                            <p className="text-sm text-gray-500 flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {event.actor}
                            </p>
                          </div>
                          <div className="text-right">
                            {event.timestamp ? (
                              <span className="text-sm font-medium">{event.timestamp}</span>
                            ) : (
                              <span className="text-sm text-gray-400">Pending</span>
                            )}
                            {event.proofLink && (
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                View Proof
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 3. DELIVERY COST TRACKING - NEW SECTION */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Delivery Cost Tracking
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
                  />
                </div>

                <Button 
                  onClick={handleSaveCosts}
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
              </CardContent>
            </Card>

            {/* 4. WARNING FLAGS */}
            {getWarningFlags().length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Warning / Delay Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getWarningFlags().map((flag, index) => (
                      <Badge key={index} variant={flag.color} className="mr-2">
                        {flag.text}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 5. UPLOAD PROOF SECTION */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {proofUploadTypes.map((proof) => (
                    <Button
                      key={proof.type}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start space-y-2"
                      onClick={() => setProofUploadType(proof.type)}
                    >
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span className="font-medium">{proof.label}</span>
                      </div>
                      <span className="text-xs text-gray-500 text-left">
                        {proof.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 6. ASSIGNED DA INFO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Assigned DA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.assignedDA}</p>
                    <p className="text-sm text-gray-500">Delivery Agent</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Contact DA
                  </Button>
                </div>
              </CardContent>
            </Card>
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
