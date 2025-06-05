
import { Badge } from "@/components/ui/badge";

interface OrderMetricsProps {
  pendingCount: number;
  deliveredCount: number;
}

const OrderMetrics = ({ pendingCount, deliveredCount }: OrderMetricsProps) => {
  return (
    <div className="flex space-x-2">
      <Badge variant="destructive" className="animate-pulse">
        🚨 {pendingCount} ORDER(S) WAITING
      </Badge>
      <Badge variant="default" className="bg-green-600">
        💰 ✔ {deliveredCount} DELIVERED
      </Badge>
    </div>
  );
};

export default OrderMetrics;
