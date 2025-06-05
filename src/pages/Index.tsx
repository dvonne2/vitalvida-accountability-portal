
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Truck, Package, Users, Activity, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ConsignmentDashboard from '@/components/ConsignmentDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo credentials - in production this would hit your auth API
    const validCredentials = {
      'logistics': { password: 'manager123', role: 'logistics_manager' },
      'ceo': { password: 'ceo123', role: 'admin' },
      'coo': { password: 'coo123', role: 'admin' },
      'fc': { password: 'fc123', role: 'admin' }
    };

    const user = validCredentials[username as keyof typeof validCredentials];
    
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      toast({
        title: "Login Successful",
        description: `Welcome to Vitalvida Logistics Portal`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Vitalvida Logistics</CardTitle>
              <CardDescription className="text-gray-600">
                Zero-Supervision Accountability Portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Login to Portal
                </Button>
              </form>
              <div className="mt-6 text-xs text-gray-500 space-y-1">
                <p><strong>Demo Credentials:</strong></p>
                <p>Logistics: logistics / manager123</p>
                <p>Admin: ceo / ceo123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <ConsignmentDashboard userRole={userRole} username={username} />;
};

export default Index;
