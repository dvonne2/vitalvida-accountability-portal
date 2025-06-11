
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface ProofUploadSectionProps {
  onUploadClick: (type: string) => void;
}

const ProofUploadSection = ({ onUploadClick }: ProofUploadSectionProps) => {
  const proofUploadTypes = [
    { type: 'call_screenshot', label: 'Call Screenshot', description: 'Verifies DA contacted customer' },
    { type: 'waybill_photo', label: 'Waybill Photo', description: 'Confirms package was dispatched' },
    { type: 'payment_screenshot', label: 'Payment Screenshot', description: 'Verifies customer paid' },
    { type: 'delivery_confirmation', label: 'Delivery Confirmation', description: 'OTP or signed proof image' }
  ];

  return (
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
              onClick={() => onUploadClick(proof.type)}
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
  );
};

export default ProofUploadSection;
