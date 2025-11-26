import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Package, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReturnsRefunds() {
  const returnProcess = [
    {
      step: '1',
      title: 'Request Return',
      description: 'Log in to your account and go to Orders. Select the item you want to return and click "Request Return".',
      icon: Package
    },
    {
      step: '2',
      title: 'Print Label',
      description: 'Print the prepaid return shipping label sent to your email. Pack the item securely in its original packaging.',
      icon: RotateCcw
    },
    {
      step: '3',
      title: 'Ship Item',
      description: 'Drop off your package at any authorized shipping location or schedule a pickup.',
      icon: Clock
    },
    {
      step: '4',
      title: 'Get Refund',
      description: 'Once we receive and inspect your return, your refund will be processed within 5-7 business days.',
      icon: DollarSign
    }
  ];

  const eligibleItems = [
    'Items must be in original condition with all packaging and accessories',
    'Returns must be initiated within 30 days of delivery',
    'Products must not show signs of wear or damage',
    'Original receipt or order confirmation required',
    'Items must not have been used or installed'
  ];

  const nonReturnable = [
    'Opened software or digital products',
    'Personal care items and hygiene products',
    'Custom or personalized items',
    'Items marked as "Final Sale"',
    'Gift cards and promotional items'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full mb-4">
            <RotateCcw className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 gradient-rainbow text-gradient">
            Returns & Refunds
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Start a Return</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Return an item from a recent order
            </p>
            <Link to="/orders">
              <Button className="w-full">Go to Orders</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Check Return Status</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track your return or refund request
            </p>
            <Link to="/orders">
              <Button variant="outline" className="w-full">View Returns</Button>
            </Link>
          </Card>
        </div>

        {/* Return Policy */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">30-Day Return Policy</h2>
            <p className="text-muted-foreground mb-6">
              We offer a hassle-free 30-day return policy for most items. If you're not completely satisfied with your purchase, 
              you can return it for a full refund or exchange within 30 days of delivery.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <h3 className="font-semibold text-lg">Eligible for Return</h3>
                </div>
                <ul className="space-y-2">
                  {eligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-emerald-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-6 h-6 text-rose-500" />
                  <h3 className="font-semibold text-lg">Non-Returnable Items</h3>
                </div>
                <ul className="space-y-2">
                  {nonReturnable.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-rose-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Return Process */}
          <Card className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-8">How to Return an Item</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {returnProcess.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-violet-500" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-violet-500 mb-1">
                          STEP {step.step}
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Refund Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Refund Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-sm text-muted-foreground">
                  Refunds are processed within 5-7 business days after we receive and inspect your returned item. 
                  You'll receive an email confirmation once your refund has been issued.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Refund Method</h3>
                <p className="text-sm text-muted-foreground">
                  Refunds will be credited to your original payment method. Depending on your bank or credit card company, 
                  it may take an additional 3-5 business days for the refund to appear in your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shipping Costs</h3>
                <p className="text-sm text-muted-foreground">
                  We provide prepaid return shipping labels for all eligible returns. If your return is due to our error 
                  (wrong item, defective product), we'll refund your original shipping costs as well.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Exchanges</h3>
                <p className="text-sm text-muted-foreground">
                  If you'd prefer to exchange an item for a different size, color, or model, please initiate a return and 
                  place a new order. This ensures the fastest processing time.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-8 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border-violet-200">
            <h3 className="text-xl font-semibold mb-3">Need Help with Your Return?</h3>
            <p className="text-muted-foreground mb-6">
              Our customer service team is here to assist you with any questions about returns or refunds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/help-center">
                <Button variant="outline">Visit Help Center</Button>
              </Link>
              <Button variant="outline">Contact Support</Button>
            </div>
          </Card>
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
