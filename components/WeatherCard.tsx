import React from 'react';
import { CloudRain, Sun, Droplets, Wind, ThermometerSun } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 p-7 text-white shadow-xl shadow-blue-900/10 transition-transform active:scale-[0.99] mb-8">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-opacity group-hover:opacity-70"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl"></div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-wide opacity-95">
            {weather.location}
          </h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-blue-100 opacity-80">Live Forecast</p>
        </div>
        <div className="rounded-2xl bg-white/20 p-2.5 shadow-sm backdrop-blur-md">
           {weather.condition.includes('Rain') 
             ? <CloudRain size={24} className="text-white" /> 
             : <Sun size={24} className="text-amber-300" />
           }
        </div>
      </div>

      {/* Main Stats */}
      <div className="relative z-10 mt-8 mb-8 flex items-baseline">
        <span className="text-[5rem] font-bold leading-none tracking-tighter text-white drop-shadow-sm">{weather.temp}°</span>
        <div className="ml-4 flex flex-col">
          <span className="text-xl font-medium leading-tight">{weather.condition}</span>
          <span className="text-sm text-blue-100 opacity-90">Today</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="relative z-10 grid grid-cols-3 gap-3">
        {[
          { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
          { icon: Wind, label: 'Wind', value: '12 km/h' },
          { icon: ThermometerSun, label: 'UV Index', value: 'Moderate' }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md transition-colors hover:bg-white/20">
            <item.icon size={18} className="mb-2 opacity-90" />
            <span className="text-[10px] uppercase tracking-wider opacity-75">{item.label}</span>
            <span className="mt-0.5 text-sm font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Alert */}
      {weather.alert && (
        <div className="relative z-10 mt-6 rounded-xl border border-orange-200/20 bg-orange-500/20 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
             <div className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-orange-300 shadow-[0_0_8px_rgba(253,186,116,0.6)]"></div>
             <div>
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-100">Agri Advisory</p>
                <p className="text-sm font-medium leading-relaxed text-white">
                  {weather.alert}
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;