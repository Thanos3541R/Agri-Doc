import React, { useRef, useEffect, useState } from 'react';
import { SwitchCamera, Zap, ZapOff, Image as ImageIcon, ScanLine, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onFileUpload: (file: File) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onFileUpload }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string>('');
  const [flash, setFlash] = useState(false);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError('');
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get base64 data
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        
        onCapture(base64);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="relative h-full w-full bg-slate-950 overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <p className="text-lg font-semibold mb-2">Camera Error</p>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button 
             onClick={startCamera}
             className="px-6 py-2 bg-slate-800 rounded-full text-sm font-semibold border border-slate-700 active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />
          
          {/* Overlay Gradient for Text Readability - Reduced intensity since we have the shadow box */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 pt-8 flex justify-between items-start z-10">
              <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">Live Feed</span>
              </div>
              
              <button 
                onClick={() => setFlash(!flash)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg"
              >
                {flash ? <Zap size={18} className="text-amber-400 fill-amber-400" /> : <ZapOff size={18} className="text-slate-300" />}
              </button>
          </div>

          {/* Center Focus Frame - REMOVED BLUR, Added shadow cutout effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="w-[75%] aspect-[3/4] border border-white/20 rounded-[2rem] relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                {/* Corners */}
                <div className="absolute -top-[1px] -left-[1px] w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl shadow-sm"></div>
                <div className="absolute -top-[1px] -right-[1px] w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-3xl shadow-sm"></div>
                <div className="absolute -bottom-[1px] -left-[1px] w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-3xl shadow-sm"></div>
                <div className="absolute -bottom-[1px] -right-[1px] w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl shadow-sm"></div>
                
                {/* Guidance Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-80">
                    <ScanLine size={40} className="text-white/80 mb-2" />
                    <p className="text-white text-[10px] font-bold tracking-[0.2em] uppercase text-center text-shadow">Align Plant</p>
                </div>
              </div>
          </div>

          {/* Bottom Controls - Positioned above Navigation */}
          <div className="absolute bottom-[5.5rem] left-0 right-0 px-8 flex items-center justify-between z-20 pointer-events-auto">
              {/* Gallery Button */}
              <label className="group w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white cursor-pointer transition-all active:scale-90 hover:bg-black/60 shadow-lg">
                <ImageIcon size={20} className="group-hover:text-emerald-400 transition-colors" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {/* Shutter Button */}
              <button 
                onClick={handleCapture}
                className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center relative group active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]"
              >
                 <div className="absolute inset-0 rounded-full border-2 border-white opacity-80 group-hover:opacity-100 transition-opacity"></div>
                 <div className="w-16 h-16 rounded-full bg-white group-hover:bg-emerald-50 transition-colors shadow-inner flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-[2px] border-emerald-500/30"></div>
                 </div>
              </button>

              {/* Switch Camera */}
              <button 
                onClick={switchCamera}
                className="group w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white transition-all active:scale-90 hover:bg-black/60 shadow-lg"
              >
                <SwitchCamera size={20} className="group-hover:text-emerald-400 transition-colors" />
              </button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;