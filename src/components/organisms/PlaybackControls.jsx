import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

export const PlaybackControls = ({ 
  isPlaying, 
  speed, 
  progress, 
  currentTime,
  durationInfo,
  onPlay, 
  onPause, 
  onReset, 
  onSpeedChange 
}) => {
  const speedOptions = [
    { value: 100, label: '100x' },
    { value: 200, label: '200x' },
    { value: 500, label: '500x' },
    { value: 1000, label: '1000x' },
    { value: 2000, label: '2000x' },
    { value: 5000, label: '5000x' },
    { value: 10000, label: '10000x' },
  ];

  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Playback Buttons - Centered at Top */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            title="Reset"
            className="h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            variant="default"
            size="lg"
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="h-14 w-14"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
        </div>

        {/* Time Display - Centered */}
        <div className="text-center space-y-1">
          <div className="font-bold text-2xl tracking-wide">{formatTime(currentTime)}</div>
          <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <Slider 
            value={[progress]} 
            max={100} 
            step={0.1}
            className="w-full"
            disabled
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress.toFixed(1)}%</span>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-center text-muted-foreground">
            Simulation Speed
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {speedOptions.map((option) => (
              <Button
                key={option.value}
                variant={speed === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSpeedChange(option.value)}
                className="font-medium"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};