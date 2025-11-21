import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Star, Package, Heart, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="border-2 gradient-primary p-1">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="gradient-rainbow text-white text-2xl font-bold">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-heading font-bold gradient-rainbow text-gradient">John Doe</h2>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-orange">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">4.8</span>
                    </div>
                    <span className="text-sm text-muted-foreground">• Member since 2024</span>
                  </div>
                </div>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all border-2 hover:border-electric-blue">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 rounded-full gradient-primary mx-auto mb-2 flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-electric-blue">12</div>
                <div className="text-xs text-muted-foreground">Orders</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-2 hover:border-pink">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 rounded-full gradient-secondary mx-auto mb-2 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-pink">8</div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-2 hover:border-emerald">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 rounded-full gradient-accent mx-auto mb-2 flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-emerald">24</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-2 hover:border-purple">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 rounded-full bg-purple mx-auto mb-2 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple">3</div>
                <div className="text-xs text-muted-foreground">Alerts</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 hover:border-electric-blue">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 hover:border-purple">
                <div className="h-8 w-8 rounded-lg bg-purple flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                My Orders
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 hover:border-pink">
                <div className="h-8 w-8 rounded-lg gradient-secondary flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                Saved Items
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 hover:border-emerald">
                <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:border-destructive">
                <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-white" />
                </div>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}
