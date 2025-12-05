import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Calendar as CalendarIcon, Star, Clock, MapPin, Wrench } from 'lucide-react';

interface Booking {
  id: string;
  device_type: string;
  issue_description: string;
  status: string;
  scheduled_date: string;
  service_location: string;
}

export default function TechnicianDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ totalEarnings: 0, completedJobs: 0, avgRating: 0, upcomingJobs: 0 });
  const [loading, setLoading] = useState(true);
  const [isTechnician, setIsTechnician] = useState(false);

  useEffect(() => {
    if (user) {
      checkTechnicianRole();
    }
  }, [user]);

  const checkTechnicianRole = async () => {
    if (!user) return;

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasTechRole = roles?.some(r => r.role === 'technician') || false;
    setIsTechnician(hasTechRole);

    if (hasTechRole) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Get technician profile
      const { data: techProfile } = await supabase
        .from('technician_profiles')
        .select('id, rating, total_reviews, total_jobs')
        .eq('user_id', user.id)
        .maybeSingle();

      if (techProfile) {
        // Get bookings
        const { data: bookingsData } = await supabase
          .from('service_bookings')
          .select('*')
          .eq('technician_id', techProfile.id)
          .order('scheduled_date', { ascending: false });

        setBookings(bookingsData || []);

        // Calculate stats
        const completedBookings = bookingsData?.filter(b => b.status === 'completed') || [];
        const upcomingBookings = bookingsData?.filter(b => ['pending', 'confirmed'].includes(b.status)) || [];
        
        setStats({
          totalEarnings: completedBookings.reduce((sum, b) => sum + (b.final_cost || 0), 0),
          completedJobs: techProfile.total_jobs || completedBookings.length,
          avgRating: techProfile.rating || 0,
          upcomingJobs: upcomingBookings.length
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-24">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isTechnician) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need a technician account to access this page.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
          <p className="text-muted-foreground">Manage your bookings and earnings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Jobs</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingJobs}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No bookings yet. They will appear here when customers book your services.
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Wrench className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.device_type}</h3>
                          <p className="text-sm text-muted-foreground">{booking.issue_description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{booking.service_location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {booking.status === 'confirmed' && (
                        <Button size="sm">Start Job</Button>
                      )}
                      {booking.status === 'in-progress' && (
                        <Button size="sm">Mark Complete</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Availability Calendar</CardTitle>
                <CardDescription>Manage your schedule and availability</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
                <CardDescription>Detailed view of your earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Total Lifetime</p>
                      <p className="text-sm text-muted-foreground">{stats.completedJobs} completed jobs</p>
                    </div>
                    <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
