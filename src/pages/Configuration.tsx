import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Configuration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Get the current script path
      const scriptPath = document.currentScript?.getAttribute('src') || '';
      const baseUrl = scriptPath.split('/').slice(0, -2).join('/');
      
      // Construct the full URL using the document's location
      const url = new URL(
        'plugins/mfa/front/config.php',
        window.location.origin + baseUrl
      ).toString();

      console.log('Attempting to fetch from URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent with the request
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Response not OK:', await response.text());
        throw new Error('Failed to update configuration');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "MFA configuration updated successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to update configuration');
      }
    } catch (error) {
      console.error('Configuration error details:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration. Please ensure you're logged into GLPI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>GLPI MFA Configuration</CardTitle>
              <CardDescription>
                Configure MFA settings for your GLPI installation
              </CardDescription>
            </div>
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;