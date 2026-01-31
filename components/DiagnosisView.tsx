import React, { useState } from 'react';
import { DiagnosisResult } from '../types';
import { Play, Pause, Sprout, Stethoscope, Droplet, ArrowLeft, Volume2, ShieldCheck, AlertOctagon } from 'lucide-react';

interface DiagnosisViewProps {
  result: DiagnosisResult;
  image: string;
  onClose: () => void;
}

const DiagnosisView: React.FC<DiagnosisViewProps> = ({ result, image, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakTamil = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = `
      கண்டறியப்பட்ட பயிர்: ${result.detectedCropTamil}.
      நோய்: ${result.diseaseNameTamil}.
      தீவிரம்: ${result.severity === 'High' ? 'அதிகம்' : result.severity === 'Medium' ? 'நடுத்தரம்' : 'குறைவு'}.
      விளக்கம்: ${result.descriptionTamil}.
      சிகிச்சை: ${result.treatmentTamil.join('. ')}.
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.9;
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-rose-500 text-white shadow-rose-200';
      case 'Medium': return 'bg-amber-500 text-white shadow-amber-200';
      default: return 'bg-emerald-500 text-white shadow-emerald-200';
    }
  };

  return (
    <div className="min-h-full bg-slate-50 pb-24 animate-in slide-in-from-bottom-5 duration-500">
      
      {/* Hero Header */}
      <div className="relative h-96 w-full overflow-hidden rounded-b-[3rem] bg-slate-900 shadow-2xl">
        <img 
          src={`data:image/jpeg;base64,${image}`} 
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-105" 
          alt="Analyzed Crop" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        
        {/* Navbar */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between p-6 pt-safe">
             <button 
                onClick={onClose} 
                className="rounded-full border border-white/10 bg-white/20 p-3 text-white backdrop-blur-md transition-all active:scale-95 hover:bg-white/30"
             >
                <ArrowLeft size={22} />
             </button>
             <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg backdrop-blur-md">
                 <Sprout size={14} className="text-emerald-400" />
                 {result.detectedCrop} <span className="text-white/40">|</span> {result.detectedCropTamil}
             </div>
        </div>

        {/* Hero Title */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8 pb-12 text-white">
          <div className="mb-4 flex items-center gap-3">
             <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg ${
               result.isHealthy 
                 ? 'bg-emerald-500 text-white' 
                 : 'bg-white text-slate-900'
             }`}>
                {result.isHealthy ? 'Healthy Plant' : 'Issue Detected'}
             </span>
             {!result.isHealthy && (
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg ${getSeverityColor(result.severity)}`}>
                   {result.severity} Severity
                </span>
             )}
          </div>
          <h1 className="mb-2 text-4xl font-bold leading-tight tracking-tight drop-shadow-md">{result.diseaseName}</h1>
          <p className="text-xl font-medium text-emerald-300">{result.diseaseNameTamil}</p>
        </div>
      </div>

      <div className="relative z-20 -mt-8 px-6">
        
        {/* Voice Assistant Button */}
        <button 
          onClick={speakTamil}
          className="group relative mb-8 flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-white p-1 shadow-xl shadow-slate-200 transition-all hover:shadow-2xl active:scale-[0.99]"
        >
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl transition-colors ${isPlaying ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-600 text-white group-hover:bg-emerald-700'}`}>
             {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </div>
          <div className="flex flex-1 flex-col items-start justify-center py-2">
             <span className="text-lg font-bold text-slate-900">Listen in Tamil</span>
             <span className="text-sm font-medium text-slate-500">விளக்கத்தை தமிழில் கேட்க</span>
          </div>
          <div className="mr-6 rounded-full bg-slate-50 p-2 text-slate-400">
             <Volume2 size={20} />
          </div>
        </button>

        <div className="space-y-6">
          
          {/* Diagnosis Section */}
          <section className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
            <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Stethoscope size={20} />
              </div>
              Diagnosis Details
            </h3>
            
            <div className="space-y-5">
               <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm leading-relaxed text-slate-600">{result.description}</p>
                  <div className="my-3 border-t border-slate-200"></div>
                  <p className="font-medium leading-relaxed text-slate-800">{result.descriptionTamil}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">Root Cause</p>
                    <p className="text-sm font-semibold text-slate-700">{result.cause}</p>
                 </div>
                 <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">AI Confidence</p>
                    <p className="text-sm font-semibold text-slate-700">{(result.confidence * 100).toFixed(0)}% Match</p>
                 </div>
               </div>
            </div>
          </section>

          {/* Treatment Section */}
          {!result.isHealthy && (
            <section className="space-y-4">
              <h3 className="flex items-center gap-3 px-2 text-lg font-bold text-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                   <Droplet size={20} />
                </div>
                 Recommended Treatment
              </h3>
              
              <div className="space-y-3">
                {result.treatment.map((t, idx) => (
                  <div key={idx} className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600 ring-4 ring-emerald-50/50 group-hover:bg-emerald-600 group-hover:text-white">
                      {idx + 1}
                    </div>
                    <div>
                       <p className="mb-1.5 font-semibold leading-snug text-slate-900">{t}</p>
                       <p className="text-sm leading-snug text-slate-500">{result.treatmentTamil[idx]}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Safety Warning */}
              <div className="mt-4 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                 <AlertOctagon size={24} className="mt-0.5 shrink-0 text-amber-600" />
                 <div>
                   <p className="mb-1 font-bold">Safety First / பாதுகாப்பு</p>
                   <p className="text-xs leading-relaxed opacity-90">
                     Always wear protective gear like masks and gloves when handling pesticides. Keep chemicals away from children.
                   </p>
                 </div>
              </div>
            </section>
          )}

          {/* Healthy Plant View */}
          {result.isHealthy && (
             <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-emerald-200 bg-emerald-50/50 p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Great Job!</h3>
                <p className="max-w-[200px] text-sm text-emerald-700">Your crop looks healthy and disease-free. Keep monitoring regularly.</p>
             </div>
          )}

          <button 
             onClick={onClose}
             className="w-full rounded-2xl border-2 border-dashed border-slate-300 py-4 font-semibold text-slate-500 transition-all hover:border-emerald-400 hover:bg-white hover:text-emerald-600 active:bg-slate-50"
          >
            Scan Another Plant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisView;