
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, AlertTriangle, CheckCircle, Shield, Clock } from 'lucide-react';
import { BirdEyeEntry } from '../types/birdEye';
import { format } from 'date-fns';

interface FlagCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  flagType: 'normal' | 'exceeds_limit' | 'overridden' | 'incomplete';
  entries: BirdEyeEntry[];
}

const FlagCardModal = ({ isOpen, onClose, flagType, entries }: FlagCardModalProps) => {
  const flagConfig = {
    normal: { 
      title: 'Normal Entries',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    exceeds_limit: { 
      title: 'Exceeds Limit Entries',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    overridden: { 
      title: 'Overridden Entries',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    incomplete: { 
      title: 'Incomplete Entries',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  };

  const config = flagConfig[flagType];
  const Icon = config.icon;

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className={`flex items-center ${config.color}`}>
            <Icon className="w-5 h-5 mr-2" />
            {config.title} ({entries.length})
          </DialogTitle>
        </DialogHeader>

        <Card className={`${config.borderColor} ${config.bgColor}`}>
          <CardHeader>
            <CardTitle className="text-lg">Entry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {entries.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No entries found for this flag type</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Consignment #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Movement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fees</TableHead>
                      <TableHead>Created</TableHead>
                      {flagType === 'overridden' && <TableHead>Override</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono text-sm">{entry.id}</TableCell>
                        <TableCell className="font-medium">{entry.consignmentNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.productName}</div>
                            <div className="text-xs text-gray-500">Qty: {entry.quantity}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="secondary" className="text-xs mb-1">
                              {entry.movementType}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {entry.fromLocation} → {entry.toLocation}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={entry.status === 'Delivered' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div>Park: {formatCurrency(entry.parkFee)}</div>
                            <div>Transport: {formatCurrency(entry.transportToParkFee)}</div>
                            <div>Loading: {formatCurrency(entry.storekeeperLoadingFee)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{formatDate(entry.createdAt)}</div>
                            <div className="text-gray-500">by {entry.createdBy}</div>
                          </div>
                        </TableCell>
                        {flagType === 'overridden' && (
                          <TableCell>
                            {entry.supervisorOverride && (
                              <div className="text-xs">
                                <div className="font-medium">{entry.supervisorOverride.supervisorName}</div>
                                <div className="text-gray-500">{entry.supervisorOverride.reason}</div>
                              </div>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FlagCardModal;
