import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, Phone, MapPin, Calendar, Star, 
  Settings, ShoppingBag, Wrench, MessageSquare, Edit 
} from 'lucide-react';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

interface UserStatistics {
  total_orders: number;
  total_reviews: number;
  total_forum_posts: number;
  total_services_booked: number;
  rating: number;
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const [profileRes, statsRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('user_statistics').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', user.id)
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (rolesRes.data) setRoles(rolesRes.data.map(r => r.role));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user.email?.split('@')[0] || 'User';
  
  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {roles.map(role => (
                          <Badge key={role} variant="secondary" className="capitalize">{role}</Badge>
                        ))}
                        {stats && stats.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold">{stats.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link to="/profile/edit">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold mb-1">{stats?.total_orders || 0}</div>
              <p className="text-sm text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold mb-1">{stats?.total_reviews || 0}</div>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold mb-1">{stats?.total_forum_posts || 0}</div>
              <p className="text-sm text-muted-foreground">Forum Posts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold mb-1">{stats?.total_services_booked || 0}</div>
              <p className="text-sm text-muted-foreground">Services Booked</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {roles.includes('seller') && (
            <Link to="/seller/dashboard">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                    Seller Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Manage your store and products</p>
                </CardContent>
              </Card>
            </Link>
          )}
          
          <Link to="/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View and track your orders</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/services">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Service Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage your repair services</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/forum">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Forum Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Your posts and discussions</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/profile/edit">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Achievement Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Achievement Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats && stats.total_orders > 0 && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl mb-2">🛒</div>
                  <p className="font-semibold text-sm">First Purchase</p>
                </div>
              )}
              {stats && stats.total_reviews > 0 && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="font-semibold text-sm">Reviewer</p>
                </div>
              )}
              {stats && stats.total_forum_posts > 0 && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="font-semibold text-sm">Active Member</p>
                </div>
              )}
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl mb-2">🏆</div>
                <p className="font-semibold text-sm">Member</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
