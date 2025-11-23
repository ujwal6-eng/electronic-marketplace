import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceMap } from '@/components/ServiceMap';
import { mockTechnicians, mockBookings, serviceCategories } from '@/data/mockServices';
import { 
  Smartphone, Laptop, Home, Clock, MapPin, Star, 
  AlertCircle, Calendar, Wrench 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Smartphone,
  Laptop,
  Refrigerator: Home,
};

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceCategories.map((category) => {
              const Icon = iconMap[category.icon] || Wrench;
              return (
                <Link 
                  key={category.id} 
                  to={`/services/book/${category.id}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 rounded-lg gradient-primary">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="secondary" className="mt-1">
                          ${category.avgPrice} avg
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.services.slice(0, 3).map((service) => (
                          <div key={service} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                            {service}
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Book Service
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Technician Map */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Nearby Technicians
          </h2>
          <ServiceMap technicians={mockTechnicians} />
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Recent Bookings
          </h2>
          <div className="space-y-4">
            {mockBookings.map((booking) => (
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
                      {booking.status}
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
                    <Link to={`/technician/${booking.technician.id}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
