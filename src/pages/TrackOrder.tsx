import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, Search, MapPin, CheckCircle, Truck, Box } from 'lucide-react';
import { useState } from 'react';

export default function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setShowResults(true);
    }
  };

  const trackingSteps = [
    {
      status: 'completed',
      title: 'Order Placed',
      description: 'Your order has been received',
      date: 'Dec 20, 2024 10:30 AM',
      icon: CheckCircle
    },
    {
      status: 'completed',
      title: 'Processing',
      description: 'Your order is being prepared',
      date: 'Dec 20, 2024 2:45 PM',
      icon: Box
    },
    {
      status: 'active',
      title: 'Shipped',
      description: 'Your package is on the way',
      date: 'Dec 21, 2024 9:15 AM',
      icon: Truck
    },
    {
      status: 'pending',
      title: 'Out for Delivery',
      description: 'Package is out for delivery',
      date: 'Expected Dec 23, 2024',
      icon: MapPin
    },
    {
      status: 'pending',
      title: 'Delivered',
      description: 'Package delivered successfully',
      date: 'Expected Dec 23, 2024',
      icon: Package
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full mb-4">
            <Package className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 gradient-rainbow text-gradient">
            Track Your Order
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your order or tracking number to see the latest status
          </p>
        </div>

        {/* Tracking Form */}
        <Card className="max-w-2xl mx-auto p-8 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Order Number or Tracking ID
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g., ORD-123456 or TRK-789012"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-12 h-14 text-lg"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                You can find this in your order confirmation email
              </p>
            </div>
            
            <Button type="submit" className="w-full h-12 text-lg">
              Track Order
            </Button>
          </form>
        </Card>

        {/* Tracking Results */}
        {showResults && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Summary */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Order Details</h2>
                  <p className="text-muted-foreground">Order #{trackingNumber || 'ORD-123456'}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium">
                    In Transit
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-sm text-muted-foreground">
                    John Doe<br />
                    123 Main Street<br />
                    Apartment 4B<br />
                    New York, NY 10001
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Carrier Information</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Carrier:</span> FedEx<br />
                    <span className="font-medium">Tracking #:</span> {trackingNumber || '1234567890'}<br />
                    <span className="font-medium">Estimated Delivery:</span> Dec 23, 2024
                  </p>
                </div>
              </div>
            </Card>

            {/* Tracking Timeline */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Tracking History</h2>
              
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === trackingSteps.length - 1;
                  
                  return (
                    <div key={index} className="relative flex gap-4 pb-8">
                      {/* Timeline Line */}
                      {!isLast && (
                        <div className={`absolute left-6 top-12 w-0.5 h-full ${
                          step.status === 'completed' ? 'bg-emerald-500' : 'bg-border'
                        }`} />
                      )}
                      
                      {/* Icon */}
                      <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-emerald-500 text-white' 
                          : step.status === 'active'
                          ? 'bg-violet-500 text-white animate-pulse'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <h3 className={`font-semibold mb-1 ${
                          step.status === 'active' ? 'text-violet-500' : ''
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {step.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Help Section */}
            <Card className="p-6 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border-violet-200">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about your order or delivery, our support team is here to help.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">Contact Support</Button>
                <Button variant="outline" size="sm">Report an Issue</Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
