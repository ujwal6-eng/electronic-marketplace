import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Home, Building, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Technician {
  id: string;
  user_id: string;
  hourly_rate: number | null;
  rating: number;
  total_reviews: number;
  service_area: string | null;
  bio: string | null;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

export default function ServiceBooking() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [serviceLocation, setServiceLocation] = useState<string>('home');
  const [categoryInfo, setCategoryInfo] = useState<ServiceCategory | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    deviceType: '',
    deviceModel: '',
    issue: '',
    address: '',
  });

  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const [categoryRes, techniciansRes] = await Promise.all([
        supabase.from('service_categories').select('*').eq('slug', category).maybeSingle(),
        supabase.from('technician_profiles').select(`
          id, user_id, hourly_rate, rating, total_reviews, service_area, bio
        `).eq('verified', 'verified').eq('available', true)
      ]);

      if (categoryRes.data) setCategoryInfo(categoryRes.data);
      
      if (techniciansRes.data) {
        // Fetch profiles for technicians
        const userIds = techniciansRes.data.map(t => t.user_id);
        const profilesRes = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', userIds);
        
        const profilesMap = new Map(profilesRes.data?.map(p => [p.id, p]) || []);
        
        const techsWithProfiles = techniciansRes.data.map(tech => ({
          ...tech,
          profile: profilesMap.get(tech.user_id)
        }));
        
        setTechnicians(techsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!formData.deviceType || !formData.issue)) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    if (step === 2 && (!date || !selectedTime)) {
      toast({ title: 'Please select date and time', variant: 'destructive' });
      return;
    }
    if (step === 3 && !selectedTechnician) {
      toast({ title: 'Please select a technician', variant: 'destructive' });
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleSubmit = () => {
    toast({ 
      title: 'Booking Confirmed!', 
      description: 'Your service request has been submitted successfully.' 
    });
    navigate('/services');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-24 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/services')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Device Details</span>
            <span>Schedule</span>
            <span>Technician</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Step 1: Device Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Device & Issue Details</CardTitle>
              <CardDescription>Tell us about your {categoryInfo?.name?.toLowerCase() || 'device'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deviceType">Device Type *</Label>
                <Input
                  id="deviceType"
                  placeholder="e.g., iPhone 14 Pro"
                  value={formData.deviceType}
                  onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deviceModel">Model/Serial Number</Label>
                <Input
                  id="deviceModel"
                  placeholder="Optional"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="issue">Describe the Issue *</Label>
                <Textarea
                  id="issue"
                  placeholder="What seems to be the problem?"
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  rows={4}
                />
              </div>
              <Button onClick={handleNext} className="w-full">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>Choose when you'd like the service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
              {date && (
                <div>
                  <Label className="mb-2 block">Available Times</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Button onClick={handleNext} className="w-full" disabled={!date || !selectedTime}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Technician */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Technician</CardTitle>
              <CardDescription>Select from available technicians</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {technicians.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No technicians available at the moment</p>
              ) : (
                technicians.map((tech) => (
                  <Card 
                    key={tech.id}
                    className={`cursor-pointer transition-all ${
                      selectedTechnician === tech.id ? 'border-primary shadow-md' : 'hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedTechnician(tech.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img 
                          src={tech.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.user_id}`} 
                          alt="Technician" 
                          className="w-16 h-16 rounded-full" 
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">
                                {tech.profile?.first_name && tech.profile?.last_name 
                                  ? `${tech.profile.first_name} ${tech.profile.last_name}`
                                  : 'Technician'}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span>{tech.rating?.toFixed(1) || '0.0'} ({tech.total_reviews || 0} reviews)</span>
                              </div>
                            </div>
                            {tech.hourly_rate && (
                              <Badge variant="secondary">${tech.hourly_rate}/hr</Badge>
                            )}
                          </div>
                          {tech.service_area && (
                            <p className="text-sm text-muted-foreground">{tech.service_area}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <Button onClick={handleNext} className="w-full" disabled={!selectedTechnician}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Booking</CardTitle>
              <CardDescription>Review and confirm the details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block">Service Location</Label>
                <RadioGroup value={serviceLocation} onValueChange={setServiceLocation}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <Home className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Home Service</p>
                        <p className="text-xs text-muted-foreground">Technician comes to you</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="shop" id="shop" />
                    <Label htmlFor="shop" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <Building className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Shop Service</p>
                        <p className="text-xs text-muted-foreground">Drop off at repair shop</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="mail" id="mail" />
                    <Label htmlFor="mail" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <Package className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Mail-In Service</p>
                        <p className="text-xs text-muted-foreground">Ship your device</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {serviceLocation === 'home' && (
                <div>
                  <Label htmlFor="address">Service Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold mb-3">Booking Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Device:</span>
                  <span className="font-medium">{formData.deviceType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">{date?.toLocaleDateString()} at {selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Technician:</span>
                  <span className="font-medium">
                    {technicians.find(t => t.id === selectedTechnician)?.profile?.first_name || 'Selected Technician'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium capitalize">{serviceLocation} Service</span>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full" size="lg">
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
