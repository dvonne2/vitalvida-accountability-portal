
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import ConsignmentDashboard from '@/components/ConsignmentDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    // In a real implementation, this would check JWT tokens, session storage, etc.
    const checkAuthentication = () => {
      // Mock authentication check - replace with actual auth logic
      const authToken = localStorage.getItem('authToken');
      const storedUserRole = localStorage.getItem('userRole');
      const storedUsername = localStorage.getItem('username');
      
      if (authToken && storedUserRole && storedUsername) {
        // User is authenticated, proceed to dashboard
        setIsLoggedIn(true);
        setUserRole(storedUserRole);
        setUsername(storedUsername);
        setIsLoading(false);
      } else {
        // User is not authenticated, redirect to Superadmin login
        // Replace with actual Superadmin portal URL
        window.location.href = '/superadmin/login';
      }
    };

    checkAuthentication();
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user reaches here, they are authenticated and should see the dashboard
  return <ConsignmentDashboard userRole={userRole} username={username} />;
};

export default Index;
