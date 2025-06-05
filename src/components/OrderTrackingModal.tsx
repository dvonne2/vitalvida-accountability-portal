
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Phone, Truck, CreditCard, CheckCircle, AlertTriangle, Clock, User, FileText } from 'lucide-react';
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

const OrderTrackingModal = ({ order, isOpen, onClose }: OrderTrackingModalProps) => {
  const [proofUploadType, setProofUploadType] = useState<string | null>(null);

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
      // Mock 6+ hour check - in real app would compare timestamps
      flags.push({ text: 'Out > 6hrs Without Delivery', color: 'destructive' as const });
    }
    
    return flags;
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

            {/* 3. WARNING FLAGS */}
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

            {/* 4. UPLOAD PROOF SECTION */}
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

            {/* 5. ASSIGNED DA INFO */}
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
