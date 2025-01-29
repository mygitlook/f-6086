import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const Configuration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Use the relative path to ensure we're using GLPI's routing
      const response = await fetch('../marketplace/mfa/front/config.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent with the request
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "MFA configuration updated successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to update configuration');
      }
    } catch (error) {
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
          <CardTitle>GLPI MFA Configuration</CardTitle>
          <CardDescription>
            Configure MFA settings for your GLPI installation
          </CardDescription>
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