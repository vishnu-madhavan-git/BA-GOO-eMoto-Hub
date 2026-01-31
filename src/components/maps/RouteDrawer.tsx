import { useState, useCallback } from 'react';
import { MapView, LatLng } from './MapView';
import { Trash2, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RouteDrawerProps {
  onRouteChange?: (waypoints: LatLng[], distance: number) => void;
  initialWaypoints?: LatLng[];
  className?: string;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate total route distance
function calculateTotalDistance(waypoints: LatLng[]): number {
  if (waypoints.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += calculateDistance(waypoints[i - 1], waypoints[i]);
  }
  return Math.round(total * 10) / 10; // Round to 1 decimal
}

export function RouteDrawer({ 
  onRouteChange, 
  initialWaypoints = [],
  className = ''
}: RouteDrawerProps) {
  const [waypoints, setWaypoints] = useState<LatLng[]>(initialWaypoints);

  const handleMapClick = useCallback((latlng: LatLng) => {
    setWaypoints(prev => {
      const newWaypoints = [...prev, latlng];
      const distance = calculateTotalDistance(newWaypoints);
      onRouteChange?.(newWaypoints, distance);
      return newWaypoints;
    });
  }, [onRouteChange]);

  const removeLastWaypoint = useCallback(() => {
    setWaypoints(prev => {
      const newWaypoints = prev.slice(0, -1);
      const distance = calculateTotalDistance(newWaypoints);
      onRouteChange?.(newWaypoints, distance);
      return newWaypoints;
    });
  }, [onRouteChange]);

  const clearRoute = useCallback(() => {
    setWaypoints([]);
    onRouteChange?.([], 0);
  }, [onRouteChange]);

  const distance = calculateTotalDistance(waypoints);
  const estimatedTime = Math.round(distance / 15 * 60); // Assuming 15 km/h average speed

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Map */}
      <div className="relative aspect-video md:aspect-[16/10] rounded-xl overflow-hidden border border-border">
        <MapView
          waypoints={waypoints}
          onMapClick={handleMapClick}
          showRoute={true}
          interactive={true}
        />
        
        {/* Instructions overlay */}
        {waypoints.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm pointer-events-none">
            <div className="text-center p-4">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-primary opacity-80" />
              <p className="text-foreground font-medium">Click on the map to add waypoints</p>
              <p className="text-muted-foreground text-sm mt-1">Start with your origin point</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={removeLastWaypoint}
            disabled={waypoints.length === 0}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearRoute}
            disabled={waypoints.length === 0}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Points:</span>
            <span className="font-semibold text-foreground">{waypoints.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Distance:</span>
            <span className="font-semibold text-primary">{distance} km</span>
          </div>
          {distance > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">~Time:</span>
              <span className="font-semibold text-foreground">{estimatedTime} min</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { calculateTotalDistance, calculateDistance };
