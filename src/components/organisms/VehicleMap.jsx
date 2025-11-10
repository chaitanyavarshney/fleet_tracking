import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom vehicle icons by status
const createVehicleIcon = (status, color) => {
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        🚚
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Component to auto-fit bounds when trips update
function MapBoundsUpdater({ trips }) {
  const map = useMap();
  
  useEffect(() => {
    if (trips.length === 0) return;
    
    const validLocations = trips
      .filter(trip => trip.lastLocation)
      .map(trip => [trip.lastLocation.lat, trip.lastLocation.lng]);
    
    if (validLocations.length > 0) {
      const bounds = L.latLngBounds(validLocations);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [trips, map]);
  
  return null;
}

export const VehicleMap = ({ trips }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#3b82f6'; // blue
      case 'completed': return '#10b981'; // green
      case 'cancelled': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getRouteColor = (status) => {
    switch (status) {
      case 'active': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Extract route paths from events
  const getRoutePath = (trip) => {
    return trip.events
      .filter(event => event.location && event.location.lat && event.location.lng)
      .map(event => [event.location.lat, event.location.lng]);
  };

  // Calculate center of US as default
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 4;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Live Fleet Map</span>
          <Badge variant="outline">{trips.length} Vehicles</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Auto-fit bounds */}
            <MapBoundsUpdater trips={trips} />
            
            {/* Draw routes for each trip */}
            {trips.map((trip) => {
              const path = getRoutePath(trip);
              if (path.length < 2) return null;
              
              return (
                <Polyline
                  key={`route-${trip.trip_id}`}
                  positions={path}
                  color={getRouteColor(trip.status)}
                  weight={3}
                  opacity={0.6}
                />
              );
            })}
            
            {/* Vehicle markers */}
            {trips.map((trip) => {
              if (!trip.lastLocation) return null;
              
              const { lat, lng } = trip.lastLocation;
              const icon = createVehicleIcon(trip.status, getStatusColor(trip.status));
              
              return (
                <Marker
                  key={trip.trip_id}
                  position={[lat, lng]}
                  icon={icon}
                >
                  <Popup>
                    <div className="space-y-2 min-w-[200px]">
                      <div>
                        <div className="font-semibold text-base">{trip.vehicle_id}</div>
                        <div className="text-xs text-gray-500">{trip.trip_id}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={trip.status === 'active' ? 'default' : 
                                  trip.status === 'completed' ? 'secondary' : 
                                  'destructive'}
                        >
                          {trip.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div>📍 {lat.toFixed(4)}, {lng.toFixed(4)}</div>
                        <div>📊 Events: {trip.events.length}</div>
                        {trip.alerts.length > 0 && (
                          <div className="text-orange-600">
                            ⚠️ Alerts: {trip.alerts.length}
                          </div>
                        )}
                      </div>
                      
                      {trip.metrics.total_distance_km && (
                        <div className="text-sm pt-2 border-t space-y-1">
                          <div>🛣️ {trip.metrics.total_distance_km.toFixed(1)} km</div>
                          <div>⏱️ {trip.metrics.total_duration_hours.toFixed(1)} hrs</div>
                          <div>⛽ {trip.metrics.fuel_consumed_percent.toFixed(1)}% fuel</div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};