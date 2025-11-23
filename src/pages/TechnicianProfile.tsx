import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockTechnicians } from '@/data/mockServices';
import { 
  Star, MapPin, Award, Calendar, DollarSign, 
  ChevronLeft, Shield, Clock, CheckCircle2 
} from 'lucide-react';

export default function TechnicianProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const technician = mockTechnicians.find(t => t.id === id);

  if (!technician) {
    return <div>Technician not found</div>;
  }

  const mockReviews = [
    { id: '1', author: 'John D.', rating: 5, comment: 'Excellent service! Very professional and fixed my phone quickly.', date: '2024-01-10' },
    { id: '2', author: 'Sarah M.', rating: 5, comment: 'Highly recommend! Great communication and quality work.', date: '2024-01-08' },
    { id: '3', author: 'Mike R.', rating: 4, comment: 'Good service, arrived on time and fixed the issue.', date: '2024-01-05' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/services')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={technician.avatar} 
                alt={technician.name}
                className="w-32 h-32 rounded-full mx-auto md:mx-0"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{technician.name}</h1>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{technician.rating}</span>
                        <span className="text-muted-foreground">({technician.reviews} reviews)</span>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Award className="h-3 w-3" />
                        {technician.yearsOfExperience} years exp.
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{technician.location.address}</span>
                    </div>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                      ${technician.hourlyRate}
                    </div>
                    <div className="text-sm text-muted-foreground">per hour</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{technician.bio}</p>
                <Button size="lg" className="w-full md:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {technician.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="px-3 py-1">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technician.certifications.map((cert) => (
                    <div key={cert} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Rating Breakdown */}
                  <div className="space-y-2 mb-6">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm">{stars}</span>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        </div>
                        <Progress value={stars === 5 ? 80 : stars === 4 ? 15 : 5} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {stars === 5 ? '80%' : stars === 4 ? '15%' : '5%'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Individual Reviews */}
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-t border-border pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const isAvailable = technician.availability.includes(day);
                    return (
                      <div 
                        key={day} 
                        className={`flex items-center justify-between p-2 rounded ${
                          isAvailable ? 'bg-emerald-500/10 text-emerald-700' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <span className="text-sm font-medium">{day}</span>
                        {isAvailable && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Service Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Service Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{technician.serviceArea}</p>
                <div className="mt-4 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-semibold">${technician.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Call</span>
                    <span className="font-semibold">$50</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Avg. Repair Cost</span>
                    <span className="font-semibold">${technician.hourlyRate * 2}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
