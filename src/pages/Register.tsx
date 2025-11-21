import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

type UserRole = 'buyer' | 'seller' | 'technician';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as UserRole,
    phone: '',
    storeName: '',
    businessAddress: '',
    certifications: '',
    specializations: '',
    termsAccepted: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast({ title: "Error", description: "Please accept terms and conditions", variant: "destructive" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Success", description: "Account created! Please verify your email." });
      navigate('/verify-email');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">E</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Step {step} of 3 - {step === 1 ? 'Basic Info' : step === 2 ? 'Role Selection' : 'Additional Details'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label>I want to</Label>
                <RadioGroup value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="buyer" id="buyer" />
                    <Label htmlFor="buyer" className="cursor-pointer flex-1">
                      <div className="font-medium">Buy Products</div>
                      <div className="text-sm text-muted-foreground">Browse and purchase electronics</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="seller" id="seller" />
                    <Label htmlFor="seller" className="cursor-pointer flex-1">
                      <div className="font-medium">Sell Products</div>
                      <div className="text-sm text-muted-foreground">List and sell your electronics</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="technician" id="technician" />
                    <Label htmlFor="technician" className="cursor-pointer flex-1">
                      <div className="font-medium">Provide Services</div>
                      <div className="text-sm text-muted-foreground">Offer repair and technical services</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>

                {formData.role === 'seller' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        placeholder="My Electronics Store"
                        value={formData.storeName}
                        onChange={(e) => handleChange('storeName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Input
                        id="businessAddress"
                        placeholder="123 Main St, City, State"
                        value={formData.businessAddress}
                        onChange={(e) => handleChange('businessAddress', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {formData.role === 'technician' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications</Label>
                      <Input
                        id="certifications"
                        placeholder="e.g., CompTIA A+, Apple Certified"
                        value={formData.certifications}
                        onChange={(e) => handleChange('certifications', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specializations">Specializations</Label>
                      <Input
                        id="specializations"
                        placeholder="e.g., Phones, Laptops, Appliances"
                        value={formData.specializations}
                        onChange={(e) => handleChange('specializations', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleChange('termsAccepted', checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </>
            )}

            {step < 3 ? (
              <Button type="button" className="w-full" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            )}

            {step > 1 && (
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep(prev => prev - 1)}>
                Back
              </Button>
            )}
          </CardContent>
        </form>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
