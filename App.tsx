import React, { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Star } from './components/StarCanvas';
import { Controls } from './components/Controls';
import { InfoPanel } from './components/InfoPanel';
import { HRDiagramModal } from './components/HRDiagramModal';
import { calcMainSequence, applyAgeEffects, getSpectralClass, getFeedbackText, SUN_TEMP, tempToRGB, getAccurateStarClassification } from './lib/physics';

export default function App() {
  // Primary state variables
  const [mass, setMass] = useState<number>(1);
  const [age, setAge] = useState<number>(0.5); // 0 to 1
  
  // Secondary state variables (can be overridden manually)
  const [temperature, setTemperature] = useState<number>(SUN_TEMP);
  const [radius, setRadius] = useState<number>(1);
  const [luminosity, setLuminosity] = useState<number>(1);
  
  const [isHRModalOpen, setIsHRModalOpen] = useState(false);

  // Derived properties for display
  const spectralClass = useMemo(() => getSpectralClass(temperature), [temperature]);
  const feedbackText = useMemo(() => getFeedbackText(mass, age, spectralClass), [mass, age, spectralClass]);
  const starClassification = useMemo(() => getAccurateStarClassification(mass, temperature, radius, luminosity), [mass, temperature, radius, luminosity]);
  
  const rgb = useMemo(() => tempToRGB(temperature), [temperature]);
  const starColorHex = useMemo(() => {
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
  }, [rgb]);

  // Handlers
  const updateFromMassAge = useCallback((m: number, a: number) => {
    const base = calcMainSequence(m);
    const current = applyAgeEffects(m, a, base.luminosity, base.radius, base.temperature);
    setTemperature(current.temperature);
    setRadius(current.radius);
    setLuminosity(current.luminosity);
  }, []);

  const handleMassChange = (m: number) => {
    setMass(m);
    updateFromMassAge(m, age);
  };

  const handleAgeChange = (a: number) => {
    setAge(a);
    updateFromMassAge(mass, a);
  };

  const handleTempChange = (t: number) => {
    setTemperature(t);
    // If temp changes, recalculate luminosity keeping radius constant
    const newL = Math.pow(radius, 2) * Math.pow(t / SUN_TEMP, 4);
    setLuminosity(newL);
  };

  const handleRadiusChange = (r: number) => {
    setRadius(r);
    // If radius changes, recalculate luminosity keeping temp constant
    const newL = Math.pow(r, 2) * Math.pow(temperature / SUN_TEMP, 4);
    setLuminosity(newL);
  };

  const handleLuminosityChange = (l: number) => {
    setLuminosity(l);
    // If luminosity changes, recalculate radius keeping temp constant
    const newR = Math.sqrt(l / Math.pow(temperature / SUN_TEMP, 4));
    setRadius(newR);
  };

  const handlePresetSelect = (m: number, t: number, r: number, l: number, a: number) => {
    setMass(m);
    setTemperature(t);
    setRadius(r);
    setLuminosity(l);
    setAge(a);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col lg:overflow-hidden">
      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 h-16 lg:h-20 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-between px-6 transition-colors duration-500"
        style={{ 
          borderBottom: `1px solid ${starColorHex}40`,
          boxShadow: `0 4px 30px -10px ${starColorHex}60`
        }}
      >
        <div>
          <h1 className="text-[10px] lg:text-[14px] font-black text-white tracking-widest uppercase opacity-90">
            FUNWEB: STELLAR SPECTRAL <span style={{ color: starColorHex }} className="transition-colors duration-500">CLASSIFICATION</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 hidden sm:block font-mono mt-1 tracking-wider">EXPLORE STELLAR PROPERTIES // MISSION CONTROL</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row mt-16 lg:mt-20 lg:h-[calc(100vh-5rem)]">
        
        {/* Left: Star Canvas (60%) */}
        <div className="w-full lg:w-[60%] h-[50vh] lg:h-full relative bg-black shrink-0">
          <Canvas gl={{ antialias: true, alpha: false }} camera={{ position: [0, 0, 15], fov: 45 }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.1} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Star temperature={temperature} radius={radius} luminosity={luminosity} />
            <OrbitControls enablePan={false} enableZoom={true} minDistance={5} maxDistance={50} target={[0, 0, 0]} />
          </Canvas>
          
          {/* Live Star Classification Indicator */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <div 
              className="px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border text-xs sm:text-sm font-mono tracking-widest uppercase text-white/90 transition-colors duration-500 flex items-center gap-3"
              style={{ 
                borderColor: `${starColorHex}50`,
                boxShadow: `0 0 20px -5px ${starColorHex}50`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: starColorHex, boxShadow: `0 0 10px ${starColorHex}` }}
              />
              {starClassification}
            </div>
          </div>
        </div>

        {/* Right: Controls & Info (40%) */}
        <div className="w-full lg:w-[40%] lg:h-full lg:overflow-y-auto overscroll-none custom-scrollbar bg-[#050914] relative border-l border-slate-800 p-6 lg:p-8 pb-24 lg:pb-8">
          {/* Subtle Grid Background for Mission Control Vibe */}
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#050914]/50 to-[#050914]"></div>
          
          <div className="relative z-10">
            <Controls 
              mass={mass}
              temperature={temperature}
              radius={radius}
              luminosity={luminosity}
              age={age}
              onMassChange={handleMassChange}
              onTempChange={handleTempChange}
              onRadiusChange={handleRadiusChange}
              onLuminosityChange={handleLuminosityChange}
              onAgeChange={handleAgeChange}
              onPresetSelect={handlePresetSelect}
            />
            
            <InfoPanel 
              spectralClass={spectralClass}
              temperature={temperature}
              luminosity={luminosity}
              radius={radius}
              mass={mass}
              age={age}
              feedbackText={feedbackText}
              onOpenHRDiagram={() => setIsHRModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="fixed bottom-0 left-0 right-0 h-12 lg:h-16 bg-slate-950/90 backdrop-blur-md z-50 transition-colors duration-500"
        style={{ 
          borderTop: `1px solid ${starColorHex}40`,
          boxShadow: `0 -4px 30px -10px ${starColorHex}60`
        }}
      />

      {/* Modals */}
      <HRDiagramModal 
        isOpen={isHRModalOpen} 
        onClose={() => setIsHRModalOpen(false)} 
        temperature={temperature} 
        luminosity={luminosity} 
        starColorHex={starColorHex} 
      />
    </div>
  );
}
