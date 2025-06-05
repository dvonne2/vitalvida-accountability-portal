
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BirdEyeEntry } from '../types/birdEye';
import { format } from 'date-fns';

interface BirdEyeTableProps {
  entries: BirdEyeEntry[];
}

const BirdEyeTable = ({ entries }: BirdEyeTableProps) => {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No movement records found</p>
          <p className="text-sm text-gray-400 mt-1">Add your first movement entry to get started</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Records ({entries.length})</CardTitle>
        <p className="text-sm text-gray-600">
          Horizontal layout showing newest entries first (left to right)
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40 sticky left-0 bg-white border-r font-semibold">Field</TableHead>
                  {entries.map((entry) => (
                    <TableHead key={entry.id} className="w-48 text-center border-r">
                      <div className="space-y-1">
                        <div className="font-medium">{entry.id}</div>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${entry.flag.color === 'green' ? 'text-green-700 border-green-300 bg-green-50' : ''}
                            ${entry.flag.color === 'red' ? 'text-red-700 border-red-300 bg-red-50' : ''}
                            ${entry.flag.color === 'orange' ? 'text-orange-700 border-orange-300 bg-orange-50' : ''}
                            ${entry.flag.color === 'yellow' ? 'text-yellow-700 border-yellow-300 bg-yellow-50' : ''}
                          `}
                        >
                          {entry.flag.display}
                        </Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Consignment Number</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r font-mono text-sm">
                      {entry.consignmentNumber}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Movement Date</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r">
                      {formatDate(entry.movementDate)}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Movement Type</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r">
                      <Badge variant="secondary" className="text-xs">
                        {entry.movementType}
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Product Name</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm">
                      {entry.productName}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Product ID</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm font-mono">
                      {entry.productId}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Quantity</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r font-medium">
                      {entry.quantity}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">From → To</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm">
                      <div>{entry.fromLocation}</div>
                      <div className="text-xs text-gray-500">→</div>
                      <div>{entry.toLocation}</div>
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Responsible</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm">
                      <div className="truncate">{entry.fromResponsible}</div>
                      <div className="text-xs text-gray-500">→</div>
                      <div className="truncate">{entry.toResponsible}</div>
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Status</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r">
                      <Badge 
                        variant={entry.status === 'Delivered' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Expected Delivery</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm">
                      {formatDate(entry.expectedDeliveryDate)}
                    </TableCell>
                  ))}
                </TableRow>

                {entries.some(e => e.deliveryConfirmationDate) && (
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Delivery Confirmed</TableCell>
                    {entries.map((entry) => (
                      <TableCell key={entry.id} className="text-center border-r text-sm">
                        {entry.deliveryConfirmationDate ? formatDate(entry.deliveryConfirmationDate) : '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                )}

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Waybill Fee</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm font-medium">
                      {formatCurrency(entry.waybillFee)}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Park Fee</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm font-medium">
                      <span className={entry.parkFee > 5000 ? 'text-red-600' : ''}>
                        {formatCurrency(entry.parkFee)}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Transport Fee</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm font-medium">
                      <span className={entry.transportToParkFee > 3000 ? 'text-red-600' : ''}>
                        {formatCurrency(entry.transportToParkFee)}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Loading Fee</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-sm font-medium">
                      <span className={entry.storekeeperLoadingFee > 1000 ? 'text-red-600' : ''}>
                        {formatCurrency(entry.storekeeperLoadingFee)}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>

                {entries.some(e => e.extraChargesAmount) && (
                  <>
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Extra Charges</TableCell>
                      {entries.map((entry) => (
                        <TableCell key={entry.id} className="text-center border-r text-sm">
                          {entry.extraChargesDescription || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Extra Amount</TableCell>
                      {entries.map((entry) => (
                        <TableCell key={entry.id} className="text-center border-r text-sm font-medium">
                          {entry.extraChargesAmount ? formatCurrency(entry.extraChargesAmount) : '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
                )}

                <TableRow>
                  <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Created</TableCell>
                  {entries.map((entry) => (
                    <TableCell key={entry.id} className="text-center border-r text-xs text-gray-500">
                      <div>{formatDate(entry.createdAt)}</div>
                      <div>by {entry.createdBy}</div>
                    </TableCell>
                  ))}
                </TableRow>

                {entries.some(e => e.supervisorOverride) && (
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-gray-50 border-r">Override</TableCell>
                    {entries.map((entry) => (
                      <TableCell key={entry.id} className="text-center border-r text-xs">
                        {entry.supervisorOverride ? (
                          <div className="text-orange-600">
                            <div>{entry.supervisorOverride.supervisorName}</div>
                            <div>{entry.supervisorOverride.reason}</div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BirdEyeTable;
