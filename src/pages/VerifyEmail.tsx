import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({ title: "Error", description: "Please enter the complete code", variant: "destructive" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Success", description: "Email verified successfully!" });
      navigate('/login');
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setResendTimer(60);
    setCanResend(false);
    toast({ title: "Code sent", description: "A new verification code has been sent to your email" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a 6-digit code to your email address. Please enter it below to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            className="w-full" 
            onClick={handleVerify} 
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
            <Button
              variant="link"
              onClick={handleResend}
              disabled={!canResend}
              className="p-0 h-auto font-medium"
            >
              {canResend ? 'Resend code' : `Resend in ${resendTimer}s`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
