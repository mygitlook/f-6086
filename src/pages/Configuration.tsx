
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
      const pluginPath = '/plugins/twofactor/front/config.php';
      const url = window.location.origin + pluginPath;

      console.log('Attempting to fetch from URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (responseText.includes('Base32.php')) {
        toast({
          title: "Plugin Error",
          description: "The Two-Factor plugin is not properly installed. Please contact your system administrator to install the required OTPHP library.",
          variant: "destructive",
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      // Only redirect if we got a successful response
      window.location.href = window.location.origin + '/plugins/twofactor/front/setup.php';
      
    } catch (error) {
      console.error('Configuration error details:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration. Please ensure you're logged into GLPI and the plugin is properly installed.",
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
              <CardTitle>GLPI Two-Factor Authentication</CardTitle>
              <CardDescription>
                Set up two-factor authentication for your GLPI account
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
              {isLoading ? 'Setting up...' : 'Set up Two-Factor Authentication'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;
