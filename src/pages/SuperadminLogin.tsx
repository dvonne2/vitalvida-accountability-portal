
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Truck } from 'lucide-react';

const SuperadminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: 'admin' | 'logistics_manager') => {
    setIsLoading(true);
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set authentication data in localStorage
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', role === 'admin' ? 'Admin User' : 'Logistics Manager');
    
    // Navigate to the main dashboard
    navigate('/');
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Vitalvida Superadmin Portal
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please select your role to access the Logistics Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLogin('admin')}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12"
          >
            <Users className="w-5 h-5 mr-2" />
            Sign in as Admin
          </Button>
          
          <Button
            onClick={() => handleLogin('logistics_manager')}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12"
          >
            <Truck className="w-5 h-5 mr-2" />
            Sign in as Logistics Manager
          </Button>
          
          {isLoading && (
            <div className="text-center text-sm text-gray-600 mt-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Authenticating...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperadminLogin;
