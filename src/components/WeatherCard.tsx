import React from 'react';
import { Sun, Cloud, CloudRain, RefreshCw } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherCardProps {
  weather: WeatherInfo;
  onRefresh: () => void;
  isLoading: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onRefresh,
  isLoading,
}) => {
  return (
    <div
      onClick={onRefresh}
      className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-purple-100/80 shadow-sm shadow-purple-100/50 flex items-center justify-between cursor-pointer hover:border-purple-200 transition-all select-none active:scale-[0.99] group"
    >
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-[#6342E8] to-[#9B51E0]" />

        <div className="text-2xl font-bold font-heading text-[#6342E8] min-w-[55px]">
          {weather.temperature !== undefined ? `${weather.temperature}°C` : '--°C'}
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>{weather.isLive ? `${weather.location} • ${weather.condition}` : 'Live Weather • Tap to retry'}</span>
            {isLoading && <RefreshCw className="w-3 h-3 text-purple-600 animate-spin" />}
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            {weather.isLive
              ? `Live atmosphere synced • Humidity ${weather.humidity || 65}%`
              : 'Tap to refresh live atmosphere'}
          </div>
        </div>
      </div>

      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#7A58E6] group-hover:scale-110 transition-transform">
        {isLoading ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : weather.condition?.toLowerCase().includes('rain') ? (
          <CloudRain className="w-5 h-5" />
        ) : weather.condition?.toLowerCase().includes('cloud') ? (
          <Cloud className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
        )}
      </div>
    </div>
  );
};
