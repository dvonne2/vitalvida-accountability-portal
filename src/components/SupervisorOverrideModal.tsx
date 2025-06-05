
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Lock, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SupervisorOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (override: {
    reason: string;
    timestamp: string;
    supervisorName: string;
  }) => void;
  validationErrors: string[];
}

const SupervisorOverrideModal = ({ isOpen, onClose, onApprove, validationErrors }: SupervisorOverrideModalProps) => {
  const { toast } = useToast();
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorPassword, setSupervisorPassword] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Demo supervisor credentials - in production this would be secure
  const SUPERVISOR_CREDENTIALS = {
    'supervisor': 'override123',
    'admin': 'admin123'
  };

  const handleAuthentication = () => {
    const validPassword = SUPERVISOR_CREDENTIALS[supervisorName as keyof typeof SUPERVISOR_CREDENTIALS];
    
    if (validPassword && validPassword === supervisorPassword) {
      setIsAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: "Supervisor access granted",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid supervisor credentials",
        variant: "destructive",
      });
    }
  };

  const handleApprove = () => {
    if (!overrideReason.trim()) {
      toast({
        title: "Override Reason Required",
        description: "Please provide a reason for the override",
        variant: "destructive",
      });
      return;
    }

    onApprove({
      reason: overrideReason,
      timestamp: new Date().toISOString(),
      supervisorName: supervisorName
    });

    // Reset form
    setSupervisorName('');
    setSupervisorPassword('');
    setOverrideReason('');
    setIsAuthenticated(false);
  };

  const handleClose = () => {
    setSupervisorName('');
    setSupervisorPassword('');
    setOverrideReason('');
    setIsAuthenticated(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-700">
            <Shield className="w-5 h-5 mr-2" />
            Supervisor Override Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Policy Violations */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Policy Violations Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-red-600">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-orange-100 rounded border border-orange-200">
                <p className="text-orange-700 text-sm">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Entry blocked due to policy violations. Supervisor authorization required to proceed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Section */}
          {!isAuthenticated ? (
            <Card>
              <CardHeader>
                <CardTitle>Supervisor Authentication</CardTitle>
                <p className="text-sm text-gray-600">
                  Please authenticate with supervisor credentials to proceed with override
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supervisorName">Supervisor Username</Label>
                    <Input
                      id="supervisorName"
                      value={supervisorName}
                      onChange={(e) => setSupervisorName(e.target.value)}
                      placeholder="Enter supervisor username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisorPassword">Password</Label>
                    <Input
                      id="supervisorPassword"
                      type="password"
                      value={supervisorPassword}
                      onChange={(e) => setSupervisorPassword(e.target.value)}
                      placeholder="Enter supervisor password"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAuthentication}
                  className="w-full"
                  disabled={!supervisorName || !supervisorPassword}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Authenticate Supervisor
                </Button>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Demo Credentials:</strong></p>
                  <p>Supervisor: supervisor / override123</p>
                  <p>Admin: admin / admin123</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Override Reason Section */
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Supervisor Authenticated: {supervisorName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="overrideReason">Override Reason *</Label>
                  <Textarea
                    id="overrideReason"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Please provide a detailed reason for overriding policy violations..."
                    rows={4}
                  />
                </div>
                
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">Override Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
                    <p><strong>Supervisor:</strong> {supervisorName}</p>
                    <p><strong>Violations:</strong> {validationErrors.length} policy violation(s)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            {isAuthenticated && (
              <Button 
                onClick={handleApprove}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={!overrideReason.trim()}
              >
                <Shield className="w-4 h-4 mr-2" />
                Approve Override
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorOverrideModal;
