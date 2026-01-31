import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const waypointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewProps {
  center?: LatLng;
  zoom?: number;
  waypoints?: LatLng[];
  onMapClick?: (latlng: LatLng) => void;
  showRoute?: boolean;
  interactive?: boolean;
  className?: string;
}

// Component to handle map events
function MapEventHandler({ onMapClick }: { onMapClick?: (latlng: LatLng) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

// Component to fit bounds to waypoints
function FitBounds({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (waypoints.length > 1) {
      const bounds = L.latLngBounds(waypoints.map(w => [w.lat, w.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, waypoints]);

  return null;
}

export function MapView({
  center = { lat: 25.2048, lng: 55.2708 }, // Dubai default
  zoom = 12,
  waypoints = [],
  onMapClick,
  showRoute = true,
  interactive = true,
  className = ''
}: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className={`w-full h-full rounded-xl ${className}`}
      style={{ minHeight: '300px' }}
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={interactive}
    >
      {/* Dark themed map tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapEventHandler onMapClick={onMapClick} />
      
      {waypoints.length > 1 && <FitBounds waypoints={waypoints} />}

      {/* Render waypoint markers */}
      {waypoints.map((point, index) => (
        <Marker
          key={`waypoint-${index}`}
          position={[point.lat, point.lng]}
          icon={
            index === 0 
              ? startIcon 
              : index === waypoints.length - 1 
                ? endIcon 
                : waypointIcon
          }
        />
      ))}

      {/* Render route polyline */}
      {showRoute && waypoints.length > 1 && (
        <Polyline
          positions={waypoints.map(w => [w.lat, w.lng] as [number, number])}
          pathOptions={{
            color: '#facc15', // Primary yellow
            weight: 4,
            opacity: 0.8,
          }}
        />
      )}
    </MapContainer>
  );
}

export { startIcon, endIcon, waypointIcon };
