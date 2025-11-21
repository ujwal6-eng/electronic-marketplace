import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Wrench, MessageSquare, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome to Electro
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your one-stop platform for electronics marketplace, repair services, and community support
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>
                  Browse and purchase electronics from trusted sellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/marketplace">Explore Products →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                  <Wrench className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Services</CardTitle>
                <CardDescription>
                  Book repair services from certified technicians
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/services">Find Technicians →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Get help and share knowledge with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/forum">Join Forum →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-semibold">Why Choose Electro?</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">500+</div>
                  <div className="text-sm text-muted-foreground">Technicians</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">50K+</div>
                  <div className="text-sm text-muted-foreground">Community</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
