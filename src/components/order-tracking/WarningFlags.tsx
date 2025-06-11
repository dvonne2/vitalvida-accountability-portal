
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from 'lucide-react';
import { useWarningFlags } from '@/hooks/useWarningFlags';
import { Order } from '@/types/order';

interface WarningFlagsProps {
  order: Order;
}

const WarningFlags = ({ order }: WarningFlagsProps) => {
  const { getWarningFlags } = useWarningFlags(order);
  const flags = getWarningFlags();

  if (flags.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Warning / Delay Flags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {flags.map((flag, index) => (
            <Badge key={index} variant={flag.color} className="mr-2">
              {flag.text}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarningFlags;
