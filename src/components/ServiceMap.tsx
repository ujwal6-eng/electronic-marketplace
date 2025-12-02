import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Star, Navigation } from 'lucide-react';
import { Technician } from '@/data/mockServices';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ServiceMapProps {
  technicians: Technician[];
  onTechnicianSelect?: (technician: Technician) => void;
}

// Demo Mapbox public token for development
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNWF4OWE4YzBiMXIycXF6NWF2dTEyZHkifQ.placeholder_demo_token';

export const ServiceMap = ({ technicians, onTechnicianSelect }: ServiceMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapError) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.006, 40.7128], // NYC default
        zoom: 11,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }));

      // Add technician markers
      technicians.forEach((tech) => {
        const el = document.createElement('div');
        el.className = 'technician-marker';
        el.innerHTML = `
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        `;

        el.addEventListener('click', () => {
          setSelectedTechnician(tech);
        });

        new mapboxgl.Marker(el)
          .setLngLat([tech.location.lng, tech.location.lat])
          .addTo(map.current!);
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError(true);
    }

    return () => {
      map.current?.remove();
    };
  }, [technicians, mapError]);

  const handleSelectTechnician = (tech: Technician) => {
    setSelectedTechnician(tech);
    if (map.current) {
      map.current.flyTo({
        center: [tech.location.lng, tech.location.lat],
        zoom: 14,
      });
    }
  };

  // Fallback UI when map fails to load
  if (mapError) {
    return (
      <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
        <Card className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <MapPin className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Find Nearby Technicians</h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
            Browse available technicians in your area.
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
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="w-full h-[400px]" />
      
      {/* Technician List Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent p-4">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Nearby Technicians:</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {technicians.map((tech) => (
            <div 
              key={tech.id} 
              onClick={() => handleSelectTechnician(tech)}
              className={`flex-shrink-0 flex items-center gap-3 p-3 bg-card rounded-lg border cursor-pointer transition-all ${
                selectedTechnician?.id === tech.id 
                  ? 'border-primary shadow-md' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-sm">{tech.name}</p>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs">{tech.rating}</span>
                  <span className="text-xs text-muted-foreground">${tech.hourlyRate}/hr</span>
                </div>
              </div>
              {onTechnicianSelect && (
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onTechnicianSelect(tech);
                  }}
                >
                  Book
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Technician Popup */}
      {selectedTechnician && (
        <div className="absolute top-4 left-4 bg-card p-4 rounded-lg shadow-lg border border-border max-w-xs">
          <div className="flex items-start gap-3">
            <img 
              src={selectedTechnician.avatar} 
              alt={selectedTechnician.name} 
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{selectedTechnician.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedTechnician.specializations.join(', ')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{selectedTechnician.rating}</span>
                <span className="text-sm text-muted-foreground">({selectedTechnician.reviews} reviews)</span>
              </div>
              <p className="text-sm font-semibold text-primary mt-1">${selectedTechnician.hourlyRate}/hr</p>
            </div>
            <button 
              onClick={() => setSelectedTechnician(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Navigation className="h-4 w-4 mr-1" />
              Directions
            </Button>
            {onTechnicianSelect && (
              <Button size="sm" className="flex-1" onClick={() => onTechnicianSelect(selectedTechnician)}>
                Book Now
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
