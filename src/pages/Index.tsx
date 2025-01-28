import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { verifyGlpiMfa } from "@/utils/glpiMfa";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const glpiUrl = "http://glpi.ngageapp.com:81/marketplace/mfa/front/mfa.form.php";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyGlpiMfa(otp);
      toast({
        title: result.success ? "Verification Successful" : "Verification Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if (result.success) {
        setOtp("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>GLPI Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the verification code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, idx) => (
                      <InputOTPSlot key={idx} {...slot} index={idx} />
                    ))}
                  </InputOTPGroup>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-4 text-sm text-center text-gray-500">
            <p>Having trouble? Contact your system administrator or visit:</p>
            <a 
              href={glpiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GLPI MFA Setup Page
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;