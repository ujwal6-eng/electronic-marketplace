import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { SupportTicketSystem } from '@/components/SupportTicketSystem';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, DollarSign, AlertCircle, 
  Search, MoreVertical, Shield, Ban, CheckCircle,
  BarChart3, Headphones, Loader2, ShieldAlert
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface UserWithRoles {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  roles: string[];
}

interface FlaggedItem {
  id: string;
  reason: string;
  status: string | null;
  created_at: string;
  reporter_id: string;
}

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading, user } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [flaggedContent, setFlaggedContent] = useState<FlaggedItem[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOrders: 0,
    totalRevenue: 0,
    flaggedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [authLoading, isAdmin, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users with profiles and roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, created_at');

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: allRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        id: profile.id,
        email: '', // We don't have email in profiles
        first_name: profile.first_name,
        last_name: profile.last_name,
        created_at: profile.created_at,
        roles: (allRoles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role)
      }));

      setUsers(usersWithRoles);

      // Fetch flagged content
      const { data: flagged, error: flaggedError } = await supabase
        .from('flagged_content')
        .select('*')
        .eq('status', 'pending');

      if (flaggedError) throw flaggedError;
      setFlaggedContent(flagged || []);

      // Fetch order stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total, status');

      if (ordersError) throw ordersError;

      const totalRevenue = (orders || [])
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + Number(o.total), 0);

      const activeOrders = (orders || [])
        .filter(o => ['pending', 'processing', 'shipped'].includes(o.status))
        .length;

      setStats({
        totalUsers: usersWithRoles.length,
        activeOrders,
        totalRevenue,
        flaggedCount: (flagged || []).length
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      // First check if role exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', newRole as any)
        .single();

      if (existingRole) {
        toast({ title: "Info", description: "User already has this role" });
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole as any });

      if (error) throw error;

      toast({ title: "Success", description: "Role added successfully" });
      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive"
      });
    }
  };

  const handleResolveFlaggedContent = async (id: string, action: 'approved' | 'removed') => {
    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ 
          status: action, 
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: "Success", description: `Content ${action}` });
      fetchData();
    } catch (error) {
      console.error('Error resolving flagged content:', error);
      toast({
        title: "Error",
        description: "Failed to resolve content",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (status: string | null) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      removed: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[status || 'pending'] || colors.pending;
  };

  const filteredUsers = users.filter(user => {
    const name = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform management and analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">From delivered orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.flaggedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs review</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No users found
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold">
                              {user.first_name || user.last_name 
                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                : 'Unnamed User'}
                            </p>
                            {user.roles.map(role => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'buyer')}>
                              <Shield className="h-4 w-4 mr-2" />
                              Add Buyer Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'seller')}>
                              <Shield className="h-4 w-4 mr-2" />
                              Add Seller Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'technician')}>
                              <Shield className="h-4 w-4 mr-2" />
                              Add Technician Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'admin')}>
                              <Shield className="h-4 w-4 mr-2" />
                              Add Admin Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation Queue</CardTitle>
                <CardDescription>Review and moderate flagged content</CardDescription>
              </CardHeader>
              <CardContent>
                {flaggedContent.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                    <p className="text-muted-foreground">No flagged content to review</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {flaggedContent.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge className={getPriorityColor(item.status)}>
                              {item.status || 'pending'}
                            </Badge>
                          </div>
                          <p className="font-semibold">{item.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            Reported {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResolveFlaggedContent(item.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleResolveFlaggedContent(item.id, 'removed')}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <SupportTicketSystem />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
