import React from 'react';
import { LineChart } from 'lucide-react';
import { cn } from '../lib/utils';

interface InfoBoxProps {
  label: string;
  value: string;
  tooltip?: string;
  className?: string;
}

const InfoBox = ({ label, value, tooltip, className }: InfoBoxProps) => (
  <div className={cn("group relative bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col items-center justify-center backdrop-blur-sm", className)}>
    <span className="text-xs text-slate-400 uppercase tracking-wider mb-1 text-center flex items-center gap-1 cursor-help">
      {label}
      {tooltip && (
        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-slate-200 p-2 rounded shadow-xl pointer-events-none z-50 whitespace-nowrap border border-slate-700">
          {tooltip}
        </span>
      )}
    </span>
    <span className="text-lg font-semibold text-white text-center">{value}</span>
  </div>
);

interface InfoPanelProps {
  spectralClass: string;
  temperature: number;
  luminosity: number;
  radius: number;
  mass: number;
  age: number;
  feedbackText: string;
  onOpenHRDiagram?: () => void;
}

export function InfoPanel({ spectralClass, temperature, luminosity, radius, mass, age, feedbackText, onOpenHRDiagram }: InfoPanelProps) {
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Derived Properties</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <InfoBox 
          label="Spectral Class" 
          value={spectralClass} 
          tooltip="Based on surface temperature." 
          className="col-span-2 bg-slate-800/60 border-blue-500/30"
        />
        <InfoBox 
          label="Surface Temp" 
          value={`${Math.round(temperature).toLocaleString()} K`} 
          tooltip="Determines the star's color." 
        />
        <InfoBox 
          label="Luminosity" 
          value={`${luminosity < 0.1 ? luminosity.toPrecision(2) : luminosity > 1000 ? Math.round(luminosity).toLocaleString() : luminosity.toFixed(2)} L☉`} 
          tooltip="Total energy emitted per second." 
        />
        <InfoBox 
          label="Radius" 
          value={`${radius < 0.1 ? radius.toPrecision(2) : radius.toFixed(2)} R☉`} 
          tooltip="Physical size relative to the Sun." 
        />
        <InfoBox 
          label="Mass" 
          value={`${mass.toFixed(2)} M☉`} 
          tooltip="Amount of matter relative to the Sun." 
        />
      </div>

      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg mb-4">
        <p className="text-sm text-blue-200 leading-relaxed">
          {feedbackText}
        </p>
      </div>

      {onOpenHRDiagram && (
        <button 
          onClick={onOpenHRDiagram}
          className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-bold transition-all border border-slate-600 shadow-lg hover:shadow-xl group"
        >
          <LineChart size={18} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="tracking-widest uppercase text-xs sm:text-sm">Show in HR Diagram</span>
        </button>
      )}
    </div>
  );
}
