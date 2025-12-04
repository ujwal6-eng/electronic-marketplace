import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceMap } from '@/components/ServiceMap';
import { 
  Smartphone, Laptop, Home, Clock, MapPin, Star, 
  AlertCircle, Calendar, Wrench, LogIn
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const iconMap: Record<string, any> = {
  Smartphone,
  Laptop,
  Refrigerator: Home,
  phones: Smartphone,
  laptops: Laptop,
  appliances: Home,
};

export default function Services() {
  const { user } = useAuth();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: technicians, isLoading: techniciansLoading } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technician_profiles')
        .select(`
          *,
          profiles(first_name, last_name, avatar_url, location)
        `)
        .eq('verified', 'verified')
        .eq('available', true)
        .limit(10);
      
      if (error) throw error;
      return data?.map(t => ({
        id: t.id,
        name: `${t.profiles?.first_name || ''} ${t.profiles?.last_name || ''}`.trim() || 'Technician',
        avatar: t.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.id}`,
        rating: Number(t.rating) || 0,
        reviews: t.total_reviews || 0,
        specializations: t.certifications || [],
        serviceArea: t.service_area || 'Local Area',
        hourlyRate: Number(t.hourly_rate) || 50,
        location: {
          lat: 40.7589,
          lng: -73.9851,
          address: t.profiles?.location || 'New York, NY'
        }
      })) || [];
    }
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          service_categories(name),
          technician_profiles(
            id,
            rating,
            total_reviews,
            profiles(first_name, last_name, avatar_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data?.map(b => ({
        id: b.id,
        category: b.service_categories?.name || 'Service',
        device: b.device_type,
        date: new Date(b.scheduled_date).toLocaleDateString(),
        time: new Date(b.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: b.status,
        location: b.service_location,
        issue: b.issue_description,
        technician: {
          id: b.technician_profiles?.id,
          name: `${b.technician_profiles?.profiles?.first_name || ''} ${b.technician_profiles?.profiles?.last_name || ''}`.trim() || 'Technician',
          avatar: b.technician_profiles?.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.technician_id}`,
          rating: Number(b.technician_profiles?.rating) || 0,
          reviews: b.technician_profiles?.total_reviews || 0
        }
      })) || [];
    },
    enabled: !!user
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Emergency Repair Button */}
        <Card className="mb-6 gradient-tertiary text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Emergency Repair
                </h2>
                <p className="text-white/90">Get immediate assistance 24/7</p>
              </div>
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Service Categories</h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => {
                const Icon = iconMap[category.icon || category.slug] || Wrench;
                return (
                  <Link 
                    key={category.id} 
                    to={`/services/book/${category.slug}`}
                    className="group"
                  >
                    <Card className="hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 rounded-lg gradient-primary">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" variant="outline">
                          Book Service
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No service categories available yet.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Technician Map */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Nearby Technicians
          </h2>
          {techniciansLoading ? (
            <Skeleton className="h-64 rounded-lg" />
          ) : technicians && technicians.length > 0 ? (
            <ServiceMap technicians={technicians} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No technicians available in your area yet.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Recent Bookings
          </h2>
          {!user ? (
            <Card>
              <CardContent className="p-8 text-center">
                <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Sign in to view your bookings</h3>
                <p className="text-muted-foreground mb-4">
                  Track your service requests and manage appointments.
                </p>
                <Link to="/login">
                  <Button>Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          ) : bookingsLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg gradient-secondary">
                          <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.device}</h3>
                          <p className="text-sm text-muted-foreground">{booking.issue}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.date} at {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <img 
                          src={booking.technician.avatar} 
                          alt={booking.technician.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">{booking.technician.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-muted-foreground">
                              {booking.technician.rating} ({booking.technician.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      {booking.technician.id && (
                        <Link to={`/technician/${booking.technician.id}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground">Book your first service to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}