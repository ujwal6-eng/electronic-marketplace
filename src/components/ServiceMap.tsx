import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { Technician } from '@/data/mockServices';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ServiceMapProps {
  technicians: Technician[];
  onTechnicianSelect?: (technician: Technician) => void;
}

export const ServiceMap = ({ technicians, onTechnicianSelect }: ServiceMapProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -73.9851,
    latitude: 40.7589,
    zoom: 12
  });
  const [mapboxToken, setMapboxToken] = useState<string>('');

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-border">
      {!mapboxToken ? (
        <Card className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <MapPin className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
            To view technician locations on the map, please enter your Mapbox access token below.
            Get your free token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <div className="flex gap-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Enter Mapbox token..."
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
          </div>
          <div className="mt-6 w-full max-w-md">
            <p className="text-xs text-muted-foreground mb-2">Available Technicians:</p>
            <div className="space-y-2">
              {technicians.map((tech) => (
                <div key={tech.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                  <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.location.address}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{tech.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
        >
          {technicians.map((technician) => (
            <Marker
              key={technician.id}
              longitude={technician.location.lng}
              latitude={technician.location.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedTechnician(technician);
              }}
            >
              <div className="cursor-pointer transform hover:scale-110 transition-transform">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-primary fill-primary/20" />
                  <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {technician.rating}
                  </div>
                </div>
              </div>
            </Marker>
          ))}

          {selectedTechnician && (
            <Popup
              longitude={selectedTechnician.location.lng}
              latitude={selectedTechnician.location.lat}
              anchor="top"
              onClose={() => setSelectedTechnician(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={selectedTechnician.avatar} 
                    alt={selectedTechnician.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{selectedTechnician.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs">{selectedTechnician.rating} ({selectedTechnician.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  ${selectedTechnician.hourlyRate}/hr
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedTechnician.specializations.slice(0, 2).map((spec) => (
                    <span key={spec} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {spec}
                    </span>
                  ))}
                </div>
                {onTechnicianSelect && (
                  <Button 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => onTechnicianSelect(selectedTechnician)}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Popup>
          )}
        </Map>
      )}
    </div>
  );
};
