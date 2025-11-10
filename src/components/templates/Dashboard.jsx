import React from 'react';

import { FleetOverview } from '../organisms/FleetOverview';
import { TripCard } from '../organisms/TripCard';
import { VehicleMap } from '../organisms/VehicleMap';
import { EventsTimeline } from '../organisms/EventsTimeline';
import { Loader2 } from 'lucide-react';
import { PlaybackControls } from '../organisms/PlaybackControls';
import { useFleetSimulation } from '../../hooks/useFleetSimulation';

export default function Dashboard() {
  // Updated paths to match your folder structure
  const tripFiles = [
    '/data/assessment-2025-11-10-07-36-41/trip_1_cross_country.json',
    '/data/assessment-2025-11-10-07-36-41/trip_2_urban_dense.json',
    '/data/assessment-2025-11-10-07-36-41/trip_3_mountain_cancelled.json',
    '/data/assessment-2025-11-10-07-36-41/trip_4_southern_technical.json',
    '/data/assessment-2025-11-10-07-36-41/trip_5_regional_logistics.json'
  ];

  const {
    isPlaying,
    speed,
    currentTime,
    progress,
    play,
    pause,
    reset,
    changeSpeed,
    getTripStates,
    getFleetMetrics,
    getDurationInfo,
    isLoaded,
    currentEvents,
    loadError
  } = useFleetSimulation(tripFiles);

  const fleetMetrics = getFleetMetrics();
  const tripStates = getTripStates();

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold">Error Loading Data</h2>
          <p className="text-muted-foreground">{loadError}</p>
          <div className="text-sm text-left bg-muted p-4 rounded-lg">
            <p className="font-semibold mb-2">Expected file locations:</p>
            <ul className="list-disc list-inside space-y-1">
              {tripFiles.map(file => (
                <li key={file}><code>{file}</code></li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Make sure your JSON files are in the <code>public/</code> folder
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading fleet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Fleet Tracking Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring of {fleetMetrics.totalTrips} simultaneous trips
          </p>
        </div>

        {/* Playback Controls */}
        <PlaybackControls
          isPlaying={isPlaying}
          speed={speed}
          progress={progress}
          currentTime={currentTime}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onSpeedChange={changeSpeed}
        />

        {/* Fleet Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Fleet Overview</h2>
          <FleetOverview metrics={fleetMetrics} />
        </div>

        {/* Individual Trips */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tripStates.map((trip) => (
              <TripCard key={trip.trip_id} trip={trip} />
            ))}
          </div>
        </div>

        {/* Map and Events in Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - Takes 2 columns */}
          <div className="lg:col-span-2">
            <VehicleMap trips={tripStates} />
          </div>
          
          {/* Events Timeline - Takes 1 column */}
          <div className="lg:col-span-1">
            <EventsTimeline events={currentEvents} maxEvents={50} />
          </div>
        </div>
      </div>
    </div>
  );
}