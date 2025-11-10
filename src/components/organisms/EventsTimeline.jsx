import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  Clock,
  TrendingUp,
  Fuel,
  Zap,
  Navigation
} from 'lucide-react';

export const EventsTimeline = ({ events, maxEvents = 50 }) => {
  // Get most recent events
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, maxEvents);

  const getEventIcon = (eventType) => {
    if (eventType.includes('alert') || eventType.includes('violation')) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
    if (eventType.includes('completed')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (eventType.includes('cancelled')) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (eventType.includes('start')) {
      return <PlayCircle className="h-4 w-4 text-blue-500" />;
    }
    if (eventType.includes('speed')) {
      return <TrendingUp className="h-4 w-4 text-purple-500" />;
    }
    if (eventType.includes('fuel')) {
      return <Fuel className="h-4 w-4 text-amber-500" />;
    }
    if (eventType.includes('location')) {
      return <Navigation className="h-4 w-4 text-blue-400" />;
    }
    return <Zap className="h-4 w-4 text-gray-500" />;
  };

  const getEventColor = (eventType) => {
    if (eventType.includes('alert') || eventType.includes('violation')) {
      return 'destructive';
    }
    if (eventType.includes('completed')) {
      return 'secondary';
    }
    if (eventType.includes('cancelled')) {
      return 'destructive';
    }
    return 'outline';
  };

  const formatEventType = (eventType) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Events</CardTitle>
          <Badge variant="outline">
            {recentEvents.length} events
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <div
                key={event.event_id || `${event.trip_id}-${index}`}
                className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getEventIcon(event.event_type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {formatEventType(event.event_type)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {event.vehicle_id} • {event.trip_id}
                      </div>
                    </div>
                    <Badge variant={getEventColor(event.event_type)} className="text-xs">
                      {formatEventType(event.event_type)}
                    </Badge>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(event.timestamp)}
                    </div>
                    <div>{formatDate(event.timestamp)}</div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {event.location.lat.toFixed(2)}, {event.location.lng.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {recentEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No events yet. Start the simulation to see live events.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};