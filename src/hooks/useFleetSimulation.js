import { useState, useEffect, useCallback, useRef } from 'react';

export const useFleetSimulation = (tripFiles = [], preloadedData = null) => {
  const [allEvents, setAllEvents] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [currentTime, setCurrentTime] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loadError, setLoadError] = useState(null);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const simulationStartRef = useRef(null);
  const pausedAtRef = useRef(null);
  
  // Add refs to track if data has been loaded
  const hasLoadedRef = useRef(false);
  const lastTripFilesRef = useRef(null);
  const lastPreloadedDataRef = useRef(null);

  // Load all trip data
  useEffect(() => {
    // Prevent duplicate loads
    const tripFilesStr = JSON.stringify(tripFiles);
    const shouldLoad = 
      (tripFiles.length > 0 || preloadedData) &&
      !hasLoadedRef.current &&
      (tripFilesStr !== lastTripFilesRef.current || 
       preloadedData !== lastPreloadedDataRef.current);
    
    if (!shouldLoad) return;

    const loadData = async () => {
      try {
        setLoadError(null);
        console.log('🔄 Loading trip data...');
        
        // Mark as loaded immediately to prevent duplicate calls
        hasLoadedRef.current = true;
        lastTripFilesRef.current = tripFilesStr;
        lastPreloadedDataRef.current = preloadedData;
        
        // If preloaded data is provided, use it directly
        if (preloadedData) {
          const combined = preloadedData.flat().sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
          setAllEvents(combined);
          
          if (combined.length > 0) {
            startTimeRef.current = new Date(combined[0].timestamp);
            endTimeRef.current = new Date(combined[combined.length - 1].timestamp);
            setCurrentTime(new Date(combined[0].timestamp));
          }
          console.log('✅ Loaded from preloaded data:', combined.length, 'events');
          return;
        }
        
        // Otherwise fetch from URLs
        const promises = tripFiles.map(async (file) => {
          console.log('Fetching:', file);
          const response = await fetch(file);
          
          if (!response.ok) {
            throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          return data;
        });
        
        const results = await Promise.all(promises);
        
        // Flatten and sort all events by timestamp
        const combined = results.flat().sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        console.log('✅ Loaded events:', combined.length);
        setAllEvents(combined);
        
        if (combined.length > 0) {
          startTimeRef.current = new Date(combined[0].timestamp);
          endTimeRef.current = new Date(combined[combined.length - 1].timestamp);
          setCurrentTime(new Date(combined[0].timestamp));
          
          const duration = (endTimeRef.current - startTimeRef.current) / 1000 / 3600;
          console.log(`⏱️ Total duration: ${duration.toFixed(2)} hours`);
        }
      } catch (error) {
        console.error('❌ Error loading trip data:', error);
        setLoadError(error.message);
        hasLoadedRef.current = false; // Allow retry on error
      }
    };

    loadData();
  }, [tripFiles, preloadedData]); // Keep dependencies but use refs to control execution

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Simulation loop - advances time based on speed multiplier
  useEffect(() => {
    if (!isPlaying || allEvents.length === 0) {
      // Clear interval when not playing
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initialize simulation start time
    if (!simulationStartRef.current) {
      if (pausedAtRef.current) {
        // Resuming from pause
        const pausedOffset = pausedAtRef.current - startTimeRef.current;
        simulationStartRef.current = Date.now() - (pausedOffset / speed);
      } else {
        // Starting fresh
        simulationStartRef.current = Date.now();
      }
    }

    // Update every 50ms for smooth animation
    intervalRef.current = setInterval(() => {
      const realElapsed = Date.now() - simulationStartRef.current;
      const simulatedElapsed = realElapsed * speed;
      const simulatedTime = new Date(startTimeRef.current.getTime() + simulatedElapsed);
      
      setCurrentTime(simulatedTime);
      
      // Get all events up to current simulated time
      const eventsUpToNow = allEvents.filter(event => 
        new Date(event.timestamp) <= simulatedTime
      );
      
      setCurrentEvents(eventsUpToNow);
      
      // Calculate progress
      const totalDuration = endTimeRef.current - startTimeRef.current;
      const currentDuration = simulatedTime - startTimeRef.current;
      const progressPercent = Math.min(100, Math.max(0, (currentDuration / totalDuration) * 100));
      setProgress(progressPercent);
      
      // Stop if we've reached or passed the end
      if (simulatedTime >= endTimeRef.current) {
        setIsPlaying(false);
        setProgress(100);
        setCurrentEvents(allEvents);
      }
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, allEvents, speed]);

  const play = useCallback(() => {
    if (progress >= 100) {
      // Reset if we're at the end
      reset();
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(true);
    }
  }, [progress]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    pausedAtRef.current = currentTime;
    simulationStartRef.current = null;
  }, [currentTime]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentEvents([]);
    setProgress(0);
    simulationStartRef.current = null;
    pausedAtRef.current = null;
    if (startTimeRef.current) {
      setCurrentTime(new Date(startTimeRef.current));
    }
  }, []);

  const changeSpeed = useCallback((newSpeed) => {
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      pausedAtRef.current = currentTime;
      setIsPlaying(false);
      simulationStartRef.current = null;
    }
    setSpeed(newSpeed);
    if (wasPlaying) {
      setTimeout(() => setIsPlaying(true), 50);
    }
  }, [isPlaying, currentTime]);

  const getTripStates = useCallback(() => {
    const tripMap = new Map();
    
    currentEvents.forEach(event => {
      const tripId = event.trip_id;
      if (!tripMap.has(tripId)) {
        tripMap.set(tripId, {
          trip_id: tripId,
          vehicle_id: event.vehicle_id,
          device_id: event.device_id,
          events: [],
          lastLocation: null,
          status: 'active',
          alerts: [],
          metrics: {},
          startTime: event.timestamp
        });
      }
      
      const trip = tripMap.get(tripId);
      trip.events.push(event);
      
      if (event.location) {
        trip.lastLocation = event.location;
      }
      
      if (event.distance_travelled_km) {
        trip.metrics.distance_km = event.distance_travelled_km;
      }
      
      if (event.event_type === 'trip_completed') {
        trip.status = 'completed';
        trip.metrics.total_distance_km = event.total_distance_km;
        trip.metrics.total_duration_hours = event.duration_minutes / 60;
        trip.metrics.fuel_consumed_percent = event.fuel_consumed_percent;
      } else if (event.event_type === 'trip_cancelled') {
        trip.status = 'cancelled';
        trip.metrics.distance_completed_km = event.distance_completed_km;
        trip.cancellation_reason = event.cancellation_reason;
      } else if (
        event.event_type.includes('alert') || 
        event.event_type.includes('violation') ||
        event.event_type.includes('_low') ||
        event.event_type.includes('error')
      ) {
        trip.alerts.push(event);
      }
      
      if (event.movement?.speed_kmh !== undefined) {
        trip.currentSpeed = event.movement.speed_kmh;
      }
    });
    
    return Array.from(tripMap.values());
  }, [currentEvents]);

  const getFleetMetrics = useCallback(() => {
    const trips = getTripStates();
    
    const totalDistance = trips.reduce((sum, t) => 
      sum + (t.metrics.distance_km || t.metrics.total_distance_km || 0), 0
    );
    
    return {
      totalTrips: trips.length,
      activeTrips: trips.filter(t => t.status === 'active').length,
      completedTrips: trips.filter(t => t.status === 'completed').length,
      cancelledTrips: trips.filter(t => t.status === 'cancelled').length,
      totalAlerts: trips.reduce((sum, t) => sum + t.alerts.length, 0),
      totalEvents: currentEvents.length,
      totalDistance: totalDistance.toFixed(1),
      trips: trips
    };
  }, [getTripStates, currentEvents]);

  const getDurationInfo = useCallback(() => {
    if (!startTimeRef.current || !endTimeRef.current) return null;
    
    const totalSeconds = (endTimeRef.current - startTimeRef.current) / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return {
      totalHours: hours,
      totalMinutes: minutes,
      totalSeconds: Math.floor(totalSeconds),
      formattedDuration: `${hours}h ${minutes}m`
    };
  }, []);

  return {
    isPlaying,
    speed,
    currentTime,
    progress,
    currentEvents,
    allEvents,
    play,
    pause,
    reset,
    changeSpeed,
    getTripStates,
    getFleetMetrics,
    getDurationInfo,
    isLoaded: allEvents.length > 0,
    loadError
  };
};