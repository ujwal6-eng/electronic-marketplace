import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, MapPin, Award, Calendar, DollarSign, 
  ChevronLeft, Shield, Clock, CheckCircle2 
} from 'lucide-react';

interface TechnicianData {
  id: string;
  user_id: string;
  hourly_rate: number | null;
  rating: number;
  total_reviews: number;
  service_area: string | null;
  bio: string | null;
  experience_years: number;
  certifications: string[] | null;
  available: boolean;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    location: string | null;
  };
}

interface Review {
  id: string;
  rating: number;
  content: string | null;
  created_at: string;
  user_id: string;
}

export default function TechnicianProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState<TechnicianData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTechnician();
    }
  }, [id]);

  const fetchTechnician = async () => {
    try {
      const { data: techData, error } = await supabase
        .from('technician_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !techData) {
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, location')
        .eq('id', techData.user_id)
        .maybeSingle();

      setTechnician({ ...techData, profile: profileData || undefined });

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('service_reviews')
        .select('*')
        .eq('technician_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching technician:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-24">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 w-full mb-6" />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Technician not found</h1>
          <Button onClick={() => navigate('/services')}>Back to Services</Button>
        </main>
        <BottomNav />
      </div>
    );
  }

  const displayName = technician.profile?.first_name && technician.profile?.last_name
    ? `${technician.profile.first_name} ${technician.profile.last_name}`
    : 'Technician';

  const availability = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/services')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={technician.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.user_id}`} 
                alt={displayName}
                className="w-32 h-32 rounded-full mx-auto md:mx-0"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{technician.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-muted-foreground">({technician.total_reviews || 0} reviews)</span>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Award className="h-3 w-3" />
                        {technician.experience_years || 0} years exp.
                      </Badge>
                    </div>
                    {technician.profile?.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{technician.profile.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    {technician.hourly_rate && (
                      <>
                        <div className="text-3xl font-bold text-primary">
                          ${technician.hourly_rate}
                        </div>
                        <div className="text-sm text-muted-foreground">per hour</div>
                      </>
                    )}
                  </div>
                </div>
                {technician.bio && (
                  <p className="text-muted-foreground mb-4">{technician.bio}</p>
                )}
                <Button size="lg" className="w-full md:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Certifications */}
            {technician.certifications && technician.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {technician.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Rating Breakdown */}
                  <div className="space-y-2 mb-6">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter(r => r.rating === stars).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-sm">{stars}</span>
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          </div>
                          <Progress value={percentage} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Individual Reviews */}
                  {reviews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No reviews yet</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-t border-border pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.content && (
                          <p className="text-muted-foreground">{review.content}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const isAvailable = availability.includes(day) && technician.available;
                    return (
                      <div 
                        key={day} 
                        className={`flex items-center justify-between p-2 rounded ${
                          isAvailable ? 'bg-emerald-500/10 text-emerald-700' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <span className="text-sm font-medium">{day}</span>
                        {isAvailable && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Service Area */}
            {technician.service_area && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Service Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{technician.service_area}</p>
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            {technician.hourly_rate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly Rate</span>
                      <span className="font-semibold">${technician.hourly_rate}/hr</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
