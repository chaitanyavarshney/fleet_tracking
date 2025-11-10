# Fleet Tracking Dashboard

Real-time fleet management dashboard for monitoring 5 simultaneous vehicle trips across the US. Built as part of the MapUp technical assessment.

🔗 **Live Demo**: https://fleet-tracking-nine.vercel.app

---

## Overview

This dashboard simulates and visualizes vehicle tracking data from 5 concurrent trips, processing 14,000+ events including location updates, alerts, and trip lifecycle events.

**The 5 trips being monitored:**
- Cross-Country Long Haul - 10,000+ events
- Urban Dense Delivery - 500+ events  
- Mountain Route (Cancelled) - 100+ events
- Southern Route (Technical Issues) - 1,000+ events
- Regional Logistics - 2,000+ events

---

## Features

- **Real-time simulation** with adjustable playback speed (1x to 100x)
- **Interactive map** showing live vehicle positions and complete routes
- **Fleet metrics** - active trips, completion status, total distance, alerts
- **Individual trip cards** with detailed metrics and event counts
- **Event timeline** showing recent activity across all vehicles
- **Playback controls** - play, pause, reset, and speed adjustment

---

## Tech Stack

- React 19 + Vite
- shadcn/ui + Radix UI components
- Tailwind CSS for styling
- React Leaflet for maps
- Custom hook for simulation logic

---

## Installation

```bash
# Clone and install
git clone [your-repo-url]
cd fleet-tracking-dashboard
npm install

# Make sure your data files are in:
# public/data/assessment-2025-11-10-07-36-41/

# Start dev server
npm run dev
```

---

## How It Works

### The Simulation Hook (`useFleetSimulation`)

The core of the app is a custom hook that:
- Loads all 5 trip JSON files in parallel
- Sorts 14,000+ events by timestamp
- Filters events based on current simulation time
- Manages playback state (play/pause/speed)
- Calculates trip states and fleet metrics on the fly

The simulation uses actual timestamps to progress through events, so a 72-hour trip can be watched at 100x speed in about 43 minutes.

### Component Structure

```
Dashboard
├── PlaybackControls (play/pause/speed)
├── FleetOverview (6 metric cards)
├── TripCards (5 individual trip panels)
├── VehicleMap (Leaflet map with markers)
└── EventsTimeline (scrolling event feed)
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn components
│   └── dashboard/
│       ├── PlaybackControls.jsx
│       ├── FleetOverview.jsx
│       ├── TripCard.jsx
│       ├── VehicleMap.jsx
│       └── EventsTimeline.jsx
├── hooks/
│   └── useFleetSimulation.js    # Main simulation logic
└── pages/
    └── Dashboard.jsx

public/data/
└── assessment-2025-11-10-07-36-41/
    └── [5 trip JSON files]
```

---

## Key Implementation Details

**Handling different start times**: Each trip starts at a different time (8am, 9am, 10am, etc.). The simulation syncs all trips to a common timeline.

**Dynamic duration calculation**: Active trips show duration calculated from their events, while completed trips show the final duration from the completion event.

**Performance**: Uses refs to prevent duplicate data loads, memoized callbacks for expensive calculations, and 50ms update intervals for smooth playback.

**Map optimization**: Shows vehicle markers and complete route paths, with colors indicating status (blue=active, green=complete, red=cancelled).

---

## Deployment

```bash
# Build
npm run build

# Deploy to Vercel
vercel
```

---

## What I Learned

- Processing large event streams efficiently (14k+ events)
- Time-based simulation with variable speed controls
- Managing complex state without over-rendering
- Working with Leaflet for real-time map updates
- Building a clean dashboard UX with shadcn/ui

The trickiest part was getting the time simulation right - had to account for real timestamp differences between events rather than treating them as uniform intervals.

---

## Future Improvements

- Export trip reports
- Filter events by type
- Animated route playback
- Alert notifications
- Historical trip comparison

---

Built for MapUp technical assessment

**Chaitanya Varshney**  
chaitanya.varshney@gmail.com | https://www.linkedin.com/in/chaitanya-varshney-6a3634198 | https://github.com/chaitanyavarshney