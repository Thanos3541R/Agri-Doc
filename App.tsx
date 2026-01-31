import React, { useState, useEffect } from 'react';
import { Leaf, Camera, Image as ImageIcon, ScanSearch, ChevronRight, Calendar, Droplets, Wind, Thermometer, Sun, CloudRain, CloudSun, Sunrise, Sunset, Sprout } from 'lucide-react';
import Navigation from './components/Navigation';
import WeatherCard from './components/WeatherCard';
import DiagnosisView from './components/DiagnosisView';
import CameraCapture from './components/CameraCapture';
import CropLibrary from './components/CropLibrary';
import { fileToGenerativePart, analyzeCropDisease } from './services/geminiService';
import { DiagnosisResult, HistoryItem, WeatherData, DailyForecast, HourlyForecast } from './types';

// --- MOCK DATA ---
const MOCK_WEATHER: WeatherData = {
  temp: 28,
  condition: 'Cloudy',
  humidity: 82,
  windSpeed: 14,
  alert: 'Fungal Risk: High humidity favors blast disease in paddy.',
  location: 'Thanjavur, TN'
};

const HOURLY_FORECAST: HourlyForecast[] = [
  { time: 'Now', temp: 28, icon: CloudSun },
  { time: '11 AM', temp: 30, icon: Sun },
  { time: '12 PM', temp: 32, icon: Sun },
  { time: '1 PM', temp: 33, icon: Sun },
  { time: '2 PM', temp: 32, icon: CloudSun },
  { time: '3 PM', temp: 30, icon: CloudRain },
];

const DAILY_FORECAST: DailyForecast[] = [
  { day: 'Today', tempMax: 32, tempMin: 24, icon: CloudSun, condition: 'Partly Cloudy', rainChance: 20 },
  { day: 'Wed', tempMax: 31, tempMin: 23, icon: CloudRain, condition: 'Light Rain', rainChance: 60 },
  { day: 'Thu', tempMax: 30, tempMin: 23, icon: CloudRain, condition: 'Heavy Rain', rainChance: 80 },
  { day: 'Fri', tempMax: 32, tempMin: 24, icon: CloudSun, condition: 'Sunny', rainChance: 10 },
  { day: 'Sat', tempMax: 33, tempMin: 25, icon: Sun, condition: 'Clear', rainChance: 0 },
];

// --- SPLASH SCREEN ---
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-950 text-white fill-mode-forwards animate-out fade-out duration-700">
      <div className="relative">
         <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-500 opacity-20 blur-3xl"></div>
         <div className="relative z-10 mb-8 flex h-32 w-32 animate-bounce-slight items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            <Leaf size={64} className="text-emerald-400 drop-shadow-lg" />
         </div>
      </div>
      <h1 className="mb-2 bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-4xl font-bold tracking-tight text-transparent">AgriDoc AI</h1>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400/80">Digital Crop Doctor</p>
      
      <div className="absolute bottom-16 flex flex-col items-center gap-3">
         <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400"></div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'history' | 'weather'>('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('agri_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const processImage = async (base64: string) => {
    try {
      setIsAnalyzing(true);
      setCurrentImage(base64);
      
      const result = await analyzeCropDisease(base64);
      setDiagnosis(result);
      
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        crop: result.detectedCrop || 'Unknown',
        imagePreview: base64,
        diagnosis: result
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('agri_history', JSON.stringify(updatedHistory));
      
    } catch (error) {
      alert("Failed to analyze image. Please try again.");
      console.error(error);
      setCurrentImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const base64 = await fileToGenerativePart(file);
      processImage(base64);
    } catch (error) {
      console.error("File processing error", error);
    }
  };

  const handleImageUploadEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFileUpload(event.target.files[0]);
    }
  };

  const handleCameraCapture = (base64: string) => {
    processImage(base64);
  };

  const handleTabChange = (id: 'home' | 'scan' | 'history' | 'weather') => {
    setActiveTab(id);
    if (id !== 'scan' && !diagnosis) {
        // Optional: Reset states
    }
    if (id === 'scan') {
        setDiagnosis(null);
    }
  };

  const renderHome = () => (
    <div className="space-y-8 p-6 pb-28 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Good Morning, Farmer</h1>
          <p className="text-sm font-medium text-emerald-600">வணக்கம், விவசாயி</p>
        </div>
        <div className="rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-100">
           <img src="https://ui-avatars.com/api/?name=Farmer&background=10b981&color=fff" alt="Profile" className="h-10 w-10 rounded-full" />
        </div>
      </header>

      <WeatherCard weather={MOCK_WEATHER} />

      {/* Main Action Card */}
      <div className="group relative">
        <div className="absolute -inset-0.5 rounded-[2.2rem] bg-gradient-to-r from-emerald-600 to-teal-600 opacity-40 blur transition duration-500 group-hover:opacity-70"></div>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-900 to-teal-950 p-8 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-8 flex items-start justify-between">
               <div className="rounded-2xl border border-white/10 bg-white/10 p-3.5 shadow-lg backdrop-blur-md">
                  <ScanSearch size={32} className="text-emerald-100" />
               </div>
               <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-100 backdrop-blur-sm">
                  AI Powered
               </span>
            </div>
            
            <h2 className="mb-2 text-2xl font-bold leading-tight">Identify Crop Disease</h2>
            <p className="mb-8 max-w-[90%] text-sm leading-relaxed text-emerald-100/80">
               Instant diagnosis and treatment advice in Tamil & English.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleTabChange('scan')}
                className="group/btn flex flex-1 items-center justify-center rounded-xl bg-white py-4 font-bold text-emerald-950 shadow-lg transition-all hover:bg-emerald-50 active:scale-[0.98]"
              >
                 <Camera className="mr-2.5 transition-transform group-hover/btn:scale-110" size={20} />
                 <span>Scan Now</span>
              </button>
              
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-emerald-950/50 px-5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-emerald-950/60 active:scale-[0.98]">
                 <ImageIcon size={22} />
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUploadEvent} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
          <button 
             className="flex h-32 flex-col justify-between rounded-[2rem] border border-slate-100 bg-white p-6 text-left shadow-sm transition-all hover:border-emerald-100 hover:shadow-md active:scale-[0.98]"
             onClick={() => setShowLibrary(true)}
          >
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Leaf size={20} />
             </div>
             <div>
                <h3 className="text-sm font-bold text-slate-800">Crop Library</h3>
                <p className="mt-1 text-[10px] font-medium text-slate-400">Supported plants</p>
             </div>
          </button>
          <button 
             className="flex h-32 flex-col justify-between rounded-[2rem] border border-slate-100 bg-white p-6 text-left shadow-sm transition-all hover:border-blue-100 hover:shadow-md active:scale-[0.98]"
             onClick={() => setActiveTab('history')}
          >
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <ScanSearch size={20} />
             </div>
             <div>
                <h3 className="text-sm font-bold text-slate-800">Past Scans</h3>
                <p className="mt-1 text-[10px] font-medium text-slate-400">View history</p>
             </div>
          </button>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="min-h-screen bg-slate-50 p-6 pb-28 animate-in fade-in duration-300">
      <div className="mb-8 flex items-center justify-between pt-2">
        <h2 className="text-2xl font-bold text-slate-900">Scan History</h2>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
           {history.length} items
        </div>
      </div>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <div className="mb-6 rounded-full bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <Leaf size={48} className="text-emerald-100" />
           </div>
           <h3 className="mb-2 text-lg font-semibold text-slate-900">No Scans Yet</h3>
           <p className="max-w-[200px] text-sm text-slate-500">Start by scanning a crop to detect diseases.</p>
           <button 
              onClick={() => handleTabChange('scan')} 
              className="mt-8 rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
           >
              Scan Now
           </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="group flex cursor-pointer gap-4 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md active:scale-[0.99]" 
              onClick={() => {
                setDiagnosis(item.diagnosis);
                setCurrentImage(item.imagePreview);
              }}
            >
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                 <img src={`data:image/jpeg;base64,${item.imagePreview}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.crop} />
                 <div className="absolute inset-0 bg-black/5"></div>
              </div>
              
              <div className="flex flex-1 flex-col justify-center py-1 pr-2">
                 <div className="mb-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Calendar size={10} /> {item.date}
                    </span>
                    {item.diagnosis.isHealthy ? (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">Healthy</span>
                   ) : (
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.diagnosis.severity === 'High' ? 'bg-rose-50 text-rose-700' : 
                        item.diagnosis.severity === 'Medium' ? 'bg-amber-50 text-amber-700' : 
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {item.diagnosis.severity}
                      </span>
                   )}
                 </div>
                 
                 <h3 className="mb-1 text-base font-bold leading-tight text-slate-900">{item.diagnosis.diseaseName}</h3>
                 <p className="mb-3 text-sm font-medium text-emerald-600">{item.diagnosis.diseaseNameTamil}</p>
                 
                 <div className="flex items-center text-xs font-semibold text-slate-500">
                    <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1">
                      {item.diagnosis.detectedCrop}
                    </span>
                 </div>
              </div>
              
              <div className="flex items-center text-slate-300">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWeather = () => (
    <div className="min-h-screen bg-slate-50 pb-28 animate-in slide-in-from-bottom-5 duration-500">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 pb-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-indigo-500/30 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">{MOCK_WEATHER.location}</h2>
              <p className="text-sm font-medium text-indigo-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-2.5 backdrop-blur-md">
               <CloudSun size={24} />
            </div>
          </div>
          
          <div className="mb-6 flex items-baseline gap-4">
             <span className="text-8xl font-bold tracking-tighter drop-shadow-sm">{MOCK_WEATHER.temp}°</span>
             <div className="flex flex-col">
                <span className="text-2xl font-semibold">{MOCK_WEATHER.condition}</span>
                <span className="text-sm font-medium opacity-80">Feels like 32°</span>
             </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-10 space-y-6 px-6">
         {/* Metrics Grid */}
         <div className="grid grid-cols-3 gap-3 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
            {[
              { icon: Droplets, label: 'Humidity', value: `${MOCK_WEATHER.humidity}%`, color: 'text-blue-500' },
              { icon: Wind, label: 'Wind', value: `${MOCK_WEATHER.windSpeed} km/h`, color: 'text-teal-500' },
              { icon: Thermometer, label: 'UV Index', value: 'High', color: 'text-orange-500' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-1 py-2">
                 <item.icon size={20} className={item.color} />
                 <span className="text-sm font-bold text-slate-700">{item.value}</span>
                 <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</span>
              </div>
            ))}
         </div>

         {/* Hourly Forecast */}
         <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-900">
               <div className="h-2 w-2 rounded-full bg-orange-500"></div> Hourly Forecast
            </h3>
            <div className="no-scrollbar flex gap-8 overflow-x-auto pb-2">
               {HOURLY_FORECAST.map((item, idx) => (
                  <div key={idx} className="flex flex-shrink-0 flex-col items-center space-y-3">
                     <span className="text-xs font-semibold text-slate-400">{item.time}</span>
                     <item.icon size={28} className={idx === 0 ? "text-orange-500" : "text-slate-300"} />
                     <span className="text-sm font-bold text-slate-800">{item.temp}°</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Agri Insights */}
         <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[2.5rem] border border-emerald-100 bg-emerald-50 p-6">
               <div className="mb-3 flex items-center gap-2">
                  <Sprout size={20} className="text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Soil Moisture</span>
               </div>
               <p className="text-2xl font-bold text-emerald-900">Normal</p>
               <p className="mt-1 text-xs font-medium text-emerald-700">Optimal for planting</p>
            </div>
            <div className="rounded-[2.5rem] border border-blue-100 bg-blue-50 p-6">
               <div className="mb-3 flex items-center gap-2">
                  <CloudRain size={20} className="text-blue-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Rain Chance</span>
               </div>
               <p className="text-2xl font-bold text-blue-900">24%</p>
               <p className="mt-1 text-xs font-medium text-blue-700">Light drizzle expected</p>
            </div>
         </div>

         {/* 7 Day Forecast */}
         <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-900">
               <div className="h-2 w-2 rounded-full bg-blue-500"></div> 7-Day Forecast
            </h3>
            <div className="space-y-6">
               {DAILY_FORECAST.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                     <p className="w-16 text-sm font-bold text-slate-500">{day.day}</p>
                     <div className="flex flex-1 items-center gap-3">
                        <day.icon size={20} className="text-slate-300" />
                        <span className="w-24 text-xs font-semibold text-slate-400">{day.condition}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-900">{day.tempMax}°</span>
                        <span className="text-sm font-semibold text-slate-300">{day.tempMin}°</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Sun/Moon */}
         <div className="rounded-[2.5rem] bg-slate-900 p-6 text-white shadow-xl">
            <div className="mb-8 flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sunrise</p>
                  <p className="mt-1 text-2xl font-bold">6:12 AM</p>
               </div>
               <Sunrise className="text-amber-400" size={28} />
            </div>
            <div className="relative mb-8 h-1 w-full rounded-full bg-slate-700">
               <div className="absolute left-0 top-0 h-full w-2/3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"></div>
               <div className="absolute left-2/3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            </div>
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sunset</p>
                  <p className="mt-1 text-2xl font-bold">6:45 PM</p>
               </div>
               <Sunset className="text-indigo-400" size={28} />
            </div>
         </div>
      </div>
    </div>
  );

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Analyzing overlay
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-950/95 p-6 text-center backdrop-blur-sm">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-500 blur-xl opacity-20"></div>
          <div className="relative z-10 flex h-24 w-24 animate-bounce-slight items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-2xl shadow-emerald-900/50">
            <Leaf className="animate-pulse text-white" size={40} />
          </div>
          <div className="absolute left-0 top-0 h-full w-full animate-ping rounded-full border-4 border-emerald-500/30"></div>
        </div>
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">Analyzing Crop...</h2>
        <p className="mb-8 text-lg text-emerald-200/80">Detecting plant health & diseases</p>
        <div className="flex gap-2">
           <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
           <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
           <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
        </div>
      </div>
    );
  }

  // Library View
  if (showLibrary) {
     return <CropLibrary onClose={() => setShowLibrary(false)} />;
  }

  // Result View
  if (diagnosis && currentImage) {
    return (
      <DiagnosisView 
        result={diagnosis} 
        image={currentImage} 
        onClose={() => {
          setDiagnosis(null);
          setCurrentImage(null);
          if (activeTab === 'scan') setActiveTab('home');
        }} 
      />
    );
  }

  return (
    <div className="relative flex h-screen max-w-md flex-col overflow-hidden bg-slate-50 font-sans text-slate-900 shadow-2xl mx-auto">
      
      {/* Content Area */}
      <div className="no-scrollbar relative flex-1 overflow-y-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'scan' && (
           <div className="h-full w-full">
              <CameraCapture 
                 onCapture={handleCameraCapture} 
                 onFileUpload={handleFileUpload}
              />
           </div>
        )}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'weather' && renderWeather()}
      </div>

      {/* Navigation */}
      <div className="relative z-50">
         <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}