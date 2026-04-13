import React from 'react';
import { X } from 'lucide-react';

interface HRDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  temperature: number;
  luminosity: number;
  starColorHex: string;
}

export function HRDiagramModal({ isOpen, onClose, temperature, luminosity, starColorHex }: HRDiagramModalProps) {
  if (!isOpen) return null;

  // Math for mapping
  // X: Temp (40000 down to 2500) -> log10
  const logTMax = Math.log10(40000);
  const logTMin = Math.log10(2500);
  const logT = Math.log10(temperature);
  const xPercent = ((logTMax - logT) / (logTMax - logTMin)) * 100;

  // Y: Lum (10^6 down to 10^-4) -> log10
  const logLMax = 6;
  const logLMin = -4;
  const logL = Math.log10(luminosity);
  const yPercent = ((logLMax - logL) / (logLMax - logLMin)) * 100;

  const getX = (t: number) => ((logTMax - Math.log10(t)) / (logTMax - logTMin)) * 100;
  const getY = (l: number) => ((logLMax - Math.log10(l)) / (logLMax - logLMin)) * 100;

  const verticalGrids = [
    { temp: 30000, tempLabel: '30,000K', classLabel: 'O' },
    { temp: 15000, tempLabel: '15,000K', classLabel: 'B' },
    { temp: 9000, tempLabel: '9,000K', classLabel: 'A' },
    { temp: 7000, tempLabel: '7,000K', classLabel: 'F' },
    { temp: 5500, tempLabel: '5,500K', classLabel: 'G' },
    { temp: 4000, tempLabel: '4,000K', classLabel: 'K' },
    { temp: 3000, tempLabel: '3,000K', classLabel: 'M' }
  ];

  const horizontalGrids = [
    { lum: 1000000, lumLabel: '10⁶', magLabel: '-10' },
    { lum: 10000, lumLabel: '10⁴', magLabel: '-5' },
    { lum: 100, lumLabel: '10²', magLabel: '0' },
    { lum: 1, lumLabel: '1', magLabel: '+5' },
    { lum: 0.01, lumLabel: '10⁻²', magLabel: '+10' },
    { lum: 0.0001, lumLabel: '10⁻⁴', magLabel: '+15' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-[#050914] border border-slate-700/60 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50">
          <h2 className="text-sm sm:text-lg font-bold text-white tracking-widest uppercase flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Hertzsprung-Russell Diagram
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-2 sm:p-6 relative aspect-[4/5] sm:aspect-[16/9] w-full bg-[#020617] flex-1">
          
          {/* Top Axis: Temperature */}
          <div className="absolute top-0 left-12 sm:left-16 right-12 sm:right-16 h-10 sm:h-12">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase whitespace-nowrap drop-shadow-md">
              Temperature (K)
            </div>
            {verticalGrids.map(g => (
              <div key={`temp-${g.temp}`} className="absolute bottom-1 -translate-x-1/2 text-[9px] sm:text-xs font-bold text-slate-200 drop-shadow-md whitespace-nowrap" style={{ left: `${getX(g.temp)}%` }}>
                {g.tempLabel}
              </div>
            ))}
          </div>

          {/* Bottom Axis: Spectral Class */}
          <div className="absolute bottom-0 left-12 sm:left-16 right-12 sm:right-16 h-10 sm:h-12">
            {verticalGrids.map(g => (
              <div key={`class-${g.classLabel}`} className="absolute top-1 -translate-x-1/2 text-[10px] sm:text-sm font-bold text-slate-200 drop-shadow-md" style={{ left: `${getX(g.temp)}%` }}>
                {g.classLabel}
              </div>
            ))}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase whitespace-nowrap drop-shadow-md">
              Spectral Class
            </div>
          </div>

          {/* Left Axis: Absolute Magnitude */}
          <div className="absolute top-10 sm:top-12 bottom-10 sm:bottom-12 left-0 w-12 sm:w-16">
            <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase origin-center whitespace-nowrap drop-shadow-md">
              Abs Mag
            </div>
            {horizontalGrids.map(g => (
              <div key={`mag-${g.magLabel}`} className="absolute right-2 -translate-y-1/2 text-[9px] sm:text-xs font-bold text-slate-200 drop-shadow-md" style={{ top: `${getY(g.lum)}%` }}>
                {g.magLabel}
              </div>
            ))}
          </div>

          {/* Right Axis: Luminosity */}
          <div className="absolute top-10 sm:top-12 bottom-10 sm:bottom-12 right-0 w-12 sm:w-16">
            <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 text-[9px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase origin-center whitespace-nowrap drop-shadow-md">
              Luminosity (L☉)
            </div>
            {horizontalGrids.map(g => (
              <div key={`lum-${g.lumLabel}`} className="absolute left-2 -translate-y-1/2 text-[9px] sm:text-xs font-bold text-slate-200 drop-shadow-md" style={{ top: `${getY(g.lum)}%` }}>
                {g.lumLabel}
              </div>
            ))}
          </div>

          {/* Graph Area */}
          <div className="absolute top-10 sm:top-12 left-12 sm:left-16 right-12 sm:right-16 bottom-10 sm:bottom-12 border border-slate-700/50 bg-[#050914]/50 overflow-hidden">
            
            {/* Grid Lines */}
            {verticalGrids.map(g => (
              <div key={`grid-v-${g.temp}`} className="absolute top-0 bottom-0 border-l border-slate-700/50" style={{ left: `${getX(g.temp)}%` }} />
            ))}
            {horizontalGrids.map(g => (
              <div key={`grid-h-${g.lum}`} className="absolute left-0 right-0 border-t border-slate-700/50" style={{ top: `${getY(g.lum)}%` }} />
            ))}
            
            {/* Background Regions (Approximations) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              {/* Main Sequence Band */}
              <path d="M 0,0 C 30,30 70,70 100,100 L 100,90 C 70,60 30,20 0,-10 Z" fill="rgba(255,255,255,0.03)" />
              {/* Giants */}
              <ellipse cx="75%" cy="35%" rx="15%" ry="15%" fill="rgba(255,100,100,0.04)" />
              <text x="75%" y="35%" fill="#FF6B6B" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="font-mono uppercase tracking-widest">Giants</text>
              
              {/* Supergiants */}
              <rect x="10%" y="5%" width="80%" height="15%" fill="rgba(100,200,255,0.04)" rx="10" />
              <text x="50%" y="12%" fill="#4DABF7" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="font-mono uppercase tracking-widest">Supergiants</text>
              
              {/* White Dwarfs */}
              <ellipse cx="20%" cy="85%" rx="12%" ry="10%" fill="rgba(200,200,255,0.04)" />
              <text x="20%" y="85%" fill="#E9ECEF" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="font-mono uppercase tracking-widest">White Dwarfs</text>

              {/* Main Sequence Label */}
              <text x="50%" y="55%" fill="#FFD700" fontSize="14" fontWeight="bold" textAnchor="middle" transform="rotate(35, 50%, 55%)" className="font-mono uppercase tracking-widest">Main Sequence</text>
            </svg>

            {/* The Star Point */}
            <div 
              className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-white z-10 transition-all duration-500 ease-out"
              style={{ 
                left: `${Math.max(0, Math.min(100, xPercent))}%`, 
                top: `${Math.max(0, Math.min(100, yPercent))}%`,
                backgroundColor: starColorHex,
                boxShadow: `0 0 30px ${starColorHex}`
              }}
            >
              {/* Ping animation */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: starColorHex }}></div>
              
              {/* Label for current star */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono text-white whitespace-nowrap pointer-events-none">
                Current Star
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
