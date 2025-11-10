import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, AlertTriangle, TrendingUp, Clock, Fuel } from 'lucide-react';
import { Activity } from 'lucide-react';

export const TripCard = ({ trip }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  // Calculate duration for active trips
  const getDuration = () => {
    if (trip.metrics.total_duration_hours) {
      return trip.metrics.total_duration_hours.toFixed(1);
    }
    
    // For active trips, calculate from events
    if (trip.events.length > 0 && trip.startTime) {
      const firstEvent = new Date(trip.startTime);
      const lastEvent = new Date(trip.events[trip.events.length - 1].timestamp);
      const durationMs = lastEvent - firstEvent;
      const durationHours = durationMs / (1000 * 60 * 60);
      return durationHours.toFixed(1);
    }
    
    return '0.0';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {trip.vehicle_id}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {trip.trip_id}
            </p>
          </div>
          <Badge variant={getStatusVariant(trip.status)}>
            {trip.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location */}
        {trip.lastLocation && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Current Location</div>
              <div className="text-sm text-muted-foreground">
                {trip.lastLocation.lat.toFixed(4)}, {trip.lastLocation.lng.toFixed(4)}
              </div>
            </div>
          </div>
        )}

        {/* Metrics */}
        {(trip.metrics.total_distance_km || trip.metrics.distance_km) && (
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Distance</span>
              </div>
              <div className="text-sm font-semibold">
                {(trip.metrics.total_distance_km || trip.metrics.distance_km)?.toFixed(1)} km
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Duration</span>
              </div>
              <div className="text-sm font-semibold">
                {getDuration()} hrs
              </div>
            </div>
            
            {trip.metrics.fuel_consumed_percent !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Fuel className="h-3 w-3" />
                  <span className="text-xs">Fuel</span>
                </div>
                <div className="text-sm font-semibold">
                  {trip.metrics.fuel_consumed_percent.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-sm">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Events:</span>
            <span className="font-semibold">{trip.events.length}</span>
          </div>
          
          {trip.alerts.length > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="font-semibold text-orange-600">
                {trip.alerts.length} Alert{trip.alerts.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};