import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-purple/20 via-gray-950 to-gray-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="z-10 flex flex-col items-center text-center p-8 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-3xl shadow-2xl">
          <div className="mb-8 relative">
            <Gamepad2 className="w-24 h-24 text-neon-green drop-shadow-[0_0_20px_rgba(57,255,20,0.6)]" />
            <div className="absolute inset-0 animate-ping opacity-20 bg-neon-green rounded-full"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] tracking-tighter">
            NEON SNAKE
          </h1>
          <p className="text-xl text-gray-400 mb-12 tracking-widest uppercase font-semibold">
            + Synthwave Player
          </p>
          
          <button
            onClick={() => setHasStarted(true)}
            className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-cyan to-neon-purple opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-[2px] bg-gray-950 rounded-lg transition-all duration-300 group-hover:bg-opacity-0"></div>
            <span className="relative text-white font-bold text-xl tracking-widest uppercase group-hover:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              Initialize System
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden flex flex-col">
      {/* Global Background Styling */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-neon-purple/10 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-8 flex justify-between items-center border-b border-gray-800/50 bg-gray-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-neon-green" />
          <h1 className="text-2xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
            Neon Snake
          </h1>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-widest">v1.0.0 // Online</div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 p-4 md:p-8">
        
        {/* Left/Top: Game Area */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <SnakeGame isActive={hasStarted} />
        </div>

        {/* Right/Bottom: Music Player Area */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 backdrop-blur-sm">
              <h2 className="text-neon-pink text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse"></span>
                Now Playing
              </h2>
              <p className="text-gray-400 text-sm">
                Enjoy the AI-generated synthwave tracks while you play. Use the controls below to manage playback.
              </p>
            </div>
            
            <MusicPlayer autoPlay={true} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
