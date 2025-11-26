import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Truck, Package, Zap, Globe, MapPin, Clock } from 'lucide-react';

export default function ShippingInfo() {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      time: '3-5 Business Days',
      cost: '$5.99',
      description: 'Best for non-urgent orders. Free on orders over $50.',
      icon: Package
    },
    {
      name: 'Express Shipping',
      time: '1-2 Business Days',
      cost: '$14.99',
      description: 'Fast delivery for when you need it quickly.',
      icon: Truck
    },
    {
      name: 'Overnight Shipping',
      time: 'Next Business Day',
      cost: '$24.99',
      description: 'Order by 2 PM for next-day delivery.',
      icon: Zap
    },
    {
      name: 'International Shipping',
      time: '7-14 Business Days',
      cost: 'Varies by location',
      description: 'We ship to over 100 countries worldwide.',
      icon: Globe
    }
  ];

  const processingInfo = [
    'Orders are processed within 24 hours on business days',
    'You will receive a confirmation email once your order ships',
    'Tracking information will be provided via email',
    'Orders placed on weekends ship the following Monday',
    'Holiday shipping may experience delays'
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Belgium',
    'Japan', 'Singapore', 'Hong Kong', 'New Zealand', 'Ireland'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full mb-4">
            <Truck className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 gradient-rainbow text-gradient">
            Shipping Information
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable shipping to get your electronics delivered safely
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Shipping Methods */}
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">Shipping Options</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {shippingMethods.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-violet-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{method.name}</h3>
                          <span className="text-emerald-500 font-semibold">{method.cost}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Clock className="w-4 h-4" />
                          {method.time}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Free Shipping Banner */}
          <Card className="p-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Free Standard Shipping</h3>
                <p className="text-muted-foreground">
                  Get free standard shipping on all orders over $50. No code needed, discount applied automatically at checkout.
                </p>
              </div>
            </div>
          </Card>

          {/* Order Processing */}
          <Card className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Order Processing</h2>
            <ul className="space-y-3">
              {processingInfo.map((info, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mt-0.5">
                    <span className="text-violet-500 text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">{info}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* International Shipping */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <Globe className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2">International Shipping</h2>
                <p className="text-muted-foreground">
                  We ship to over 100 countries worldwide. International orders typically arrive within 7-14 business days.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Popular Shipping Destinations</h3>
              <div className="flex flex-wrap gap-2">
                {countries.map((country, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Customs & Duties</h4>
                <p className="text-muted-foreground">
                  International customers are responsible for any customs duties, taxes, or fees imposed by their country. 
                  These charges are not included in your order total.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Customs Forms</h4>
                <p className="text-muted-foreground">
                  All international shipments include completed customs forms with accurate product descriptions and values.
                </p>
              </div>
            </div>
          </Card>

          {/* Tracking & Delivery */}
          <Card className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Tracking & Delivery</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Package Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Once your order ships, you'll receive an email with tracking information. You can also track your 
                    order anytime by visiting your Orders page or using our Track Order tool.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Delivery Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Most packages require a signature upon delivery. If no one is available to sign, the carrier will 
                    leave a notice with instructions for pickup or redelivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Shipping Carriers</h3>
                  <p className="text-sm text-muted-foreground">
                    We partner with trusted carriers including FedEx, UPS, USPS, and DHL to ensure reliable delivery. 
                    The carrier will be selected based on your location and shipping method.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* FAQs */}
          <Card className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Shipping FAQs</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I change my shipping address after ordering?</h3>
                <p className="text-sm text-muted-foreground">
                  You can update your shipping address within 1 hour of placing your order. After that, please contact 
                  our support team immediately - we'll do our best to help, but changes may not be possible once the 
                  order enters processing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What if my package is lost or damaged?</h3>
                <p className="text-sm text-muted-foreground">
                  All shipments are insured. If your package is lost or arrives damaged, contact us immediately with 
                  photos (if damaged) and we'll work with the carrier to resolve the issue. We'll send a replacement 
                  or issue a refund as appropriate.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Do you ship to P.O. boxes?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we ship to P.O. boxes within the United States using USPS. However, expedited shipping options 
                  are not available for P.O. box addresses.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
