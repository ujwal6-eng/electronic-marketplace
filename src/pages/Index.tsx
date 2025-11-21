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
            <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-rainbow text-gradient">
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
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-electric-blue">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-2 shadow-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-electric-blue">Marketplace</CardTitle>
                <CardDescription>
                  Browse and purchase electronics from trusted sellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 text-electric-blue">
                  <Link to="/marketplace">Explore Products →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg gradient-accent flex items-center justify-center mb-2 shadow-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-emerald">Services</CardTitle>
                <CardDescription>
                  Book repair services from certified technicians
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 text-emerald">
                  <Link to="/services">Find Technicians →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg gradient-secondary flex items-center justify-center mb-2 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-purple">Community</CardTitle>
                <CardDescription>
                  Get help and share knowledge with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 text-purple">
                  <Link to="/forum">Join Forum →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <Card className="gradient-rainbow border-0 text-white shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-white">Why Choose Electro?</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-white/80">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/80">Technicians</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-white/80">Community</div>
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
