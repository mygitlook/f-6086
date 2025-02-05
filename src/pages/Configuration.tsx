
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Configuration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [missingLibrary, setMissingLibrary] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setMissingLibrary(false);
    
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
        setMissingLibrary(true);
        toast({
          title: "Missing Required Library",
          description: "The OTPHP library is not installed. Please contact your system administrator.",
          variant: "destructive",
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      window.location.href = window.location.origin + '/plugins/twofactor/front/setup.php';
      
    } catch (error) {
      console.error('Configuration error details:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration. Please ensure you're logged into GLPI and try again.",
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
          {missingLibrary && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Missing Required Library</AlertTitle>
              <AlertDescription>
                The Two-Factor plugin requires the OTPHP library to be installed on the server. 
                Please contact your system administrator and request them to install the required library.
                <br />
                <code className="text-sm mt-2 block">
                  Missing file: /var/www/html/glpi/plugins/twofactor/lib/otphp/Trait/Base32.php
                </code>
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || missingLibrary}
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
