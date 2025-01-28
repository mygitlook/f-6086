import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const Configuration = () => {
  const [defaultSenderEmail, setDefaultSenderEmail] = useState("");
  const [defaultReceiverEmail, setDefaultReceiverEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(defaultSenderEmail) || !validateEmail(defaultReceiverEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter valid email addresses",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://glpi.ngageapp.com:81/marketplace/mfa/front/config.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          defaultSenderEmail,
          defaultReceiverEmail,
        }),
      });

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
        description: "Failed to update configuration. Please try again.",
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
            Configure default email settings for MFA notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultSenderEmail">Default Sender Email</Label>
                <Input
                  id="defaultSenderEmail"
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  value={defaultSenderEmail}
                  onChange={(e) => setDefaultSenderEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultReceiverEmail">Default Receiver Email</Label>
                <Input
                  id="defaultReceiverEmail"
                  type="email"
                  placeholder="admin@yourdomain.com"
                  value={defaultReceiverEmail}
                  onChange={(e) => setDefaultReceiverEmail(e.target.value)}
                  required
                />
              </div>
            </div>

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