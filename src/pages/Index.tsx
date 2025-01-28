import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Index = () => {
  const [otp, setOtp] = useState("");
  const glpiUrl = "http://glpi.ngageapp.com:81/marketplace/mfa/front/mfa.form.php";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Verification Attempt",
      description: `OTP ${otp} would be verified with GLPI MFA system. Please implement the actual verification logic according to your GLPI setup.`,
    });
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
              <Button type="submit" className="w-full">
                Verify Code
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