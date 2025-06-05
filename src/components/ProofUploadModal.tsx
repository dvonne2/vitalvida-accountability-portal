
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProofUploadModalProps {
  uploadType: string;
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProofUploadModal = ({ uploadType, orderId, isOpen, onClose }: ProofUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [whisperNote, setWhisperNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const getUploadTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'call_screenshot': 'Call Screenshot',
      'waybill_photo': 'Waybill Photo',
      'payment_screenshot': 'Payment Screenshot',
      'delivery_confirmation': 'Delivery Confirmation'
    };
    return labels[type] || type;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select an image (JPEG, PNG, GIF) or PDF file.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Mock upload - in real app this would upload to server
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Uploading proof:', {
        orderId,
        uploadType,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        whisperNote,
        timestamp: new Date().toISOString(),
        uploadedBy: 'logistics_manager'
      });

      toast({
        title: "Proof uploaded successfully",
        description: `${getUploadTypeLabel(uploadType)} has been uploaded for order ${orderId}.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setWhisperNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {getUploadTypeLabel(uploadType)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Order ID: {orderId}
            </Label>
          </div>

          <div>
            <Label htmlFor="file-upload" className="text-sm font-medium">
              Select File
            </Label>
            <div className="mt-1">
              <Input
                id="file-upload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: JPEG, PNG, GIF, PDF (max 10MB)
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <File className="w-4 h-4 text-gray-500" />
              <span className="text-sm flex-1">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div>
            <Label htmlFor="whisper-note" className="text-sm font-medium">
              Whisper Note (Optional)
            </Label>
            <Textarea
              id="whisper-note"
              value={whisperNote}
              onChange={(e) => setWhisperNote(e.target.value)}
              placeholder="Add any additional notes about this proof..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Proof
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProofUploadModal;
