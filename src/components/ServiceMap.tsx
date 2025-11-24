import { MapPin, Star } from 'lucide-react';
import { Technician } from '@/data/mockServices';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ServiceMapProps {
  technicians: Technician[];
  onTechnicianSelect?: (technician: Technician) => void;
}

export const ServiceMap = ({ technicians, onTechnicianSelect }: ServiceMapProps) => {
  return (
    <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
      <Card className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <MapPin className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Find Nearby Technicians</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
          Browse available technicians in your area. Interactive map view coming soon!
        </p>
        <div className="w-full max-w-2xl">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Available Technicians:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {technicians.map((tech) => (
              <div 
                key={tech.id} 
                className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all"
              >
                <img src={tech.avatar} alt={tech.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{tech.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{tech.location.address}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{tech.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">${tech.hourlyRate}/hr</span>
                  </div>
                </div>
                {onTechnicianSelect && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onTechnicianSelect(tech)}
                    className="shrink-0"
                  >
                    Book
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
