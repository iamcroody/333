"use client";
import { useState, useEffect, useRef } from "react";
import Menu333 from "../components/Menu333";
import NeonName from "../components/NeonName";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

const alarmSound = typeof window !== "undefined" ? new Howl({ src: ["/alarma.mp3"], volume: 1.0 }) : null;

export default function NexusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("clock");
  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef(null);
  
  // Triple Click Logic
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleTripleClick = (e) => {
    // Evitar que el clic en botones cuente para el modo pantalla completa
    if (e.target.tagName === 'BUTTON') return;

    const now = Date.now();
    if (now - lastClickTime.current < 400) {
      clickCount.current += 1;
    } else {
      clickCount.current = 1;
    }
    lastClickTime.current = now;

    if (clickCount.current === 3) {
      toggleFullScreen();
      clickCount.current = 0;
    }
  };

  // Sync state with browser fullscreen changes (e.g. if user presses ESC)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Pomodoro
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState("work");
  const [customTime, setCustomTime] = useState(15 * 60);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  // World Clocks
  const worldClocks = [
    { city: "Medellín", zone: "America/Bogota", flag: "🇨🇴" },
    { city: "London", zone: "Europe/London", flag: "🇬🇧" },
    { city: "Tokyo", zone: "Asia/Tokyo", flag: "🇯🇵" },
    { city: "New York", zone: "America/New_York", flag: "🇺🇸" },
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval = null;
    if (pomoRunning && pomoTime > 0) {
      interval = setInterval(() => setPomoTime((t) => t - 1), 1000);
    } else if (pomoTime === 0 && pomoRunning) {
      alarmSound?.play();
      setIsAlarmPlaying(true);
      setPomoRunning(false);
    }
    return () => clearInterval(interval);
  }, [pomoRunning, pomoTime]);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  const formatPomo = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleTripleClick}
      className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[#05010a] text-white flex flex-col items-center justify-center relative"
    >
      <AnimatePresence>
        {pomoRunning && pomoTime > 0 && pomoTime <= 5 && (
          <motion.div
            key={pomoTime}
            initial={{ opacity: (6 - pomoTime) * 0.15 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none fixed inset-0 bg-white z-[999]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isFullScreen && (
          <>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <Menu333 />
            </motion.div>
            <div className="absolute top-0 left-0 w-full flex flex-col items-center gap-4 pt-6 z-50">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
                className="hover:opacity-100 transition-opacity"
              >
                <NeonName centered={false} />
              </motion.div>

              {/* Mode Selector */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                className="flex justify-center gap-2 sm:gap-4 w-full"
              >
                {["clock", "pomo", "world"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-2 rounded-full font-mono text-[10px] tracking-widest transition-all ${
                      activeTab === tab 
                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                        : "text-purple-500/30 hover:text-purple-400 border border-transparent"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <div className={`w-full flex items-center justify-center transition-all duration-700 ${isFullScreen ? 'bg-black p-0 h-screen' : 'p-4 sm:p-12 pt-36 pb-24 min-h-screen'}`}>
        <div className={`
          ${isFullScreen ? 'w-full h-full overflow-visible' : 'bg-[#05010a] border border-[#05010a] rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-20 max-w-5xl w-full'} 
          relative transition-all duration-700 flex flex-col justify-center items-center
        `}>
          <AnimatePresence mode="wait">
            {activeTab === "clock" && (
              <motion.div
                key="clock"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center select-none w-full"
              >
                <h2 className={`font-['Bebas_Neue'] tracking-tight text-purple-100 leading-none mb-4 transition-all duration-700 ${isFullScreen ? 'text-[22vw]' : 'text-7xl sm:text-[14rem]'}`}>
                  {currentTime.toLocaleTimeString("es-ES", { hour12: false })}
                </h2>
                <div className="flex flex-col items-center gap-2">
                  <span className={`font-mono text-purple-400/60 tracking-[0.5em] uppercase transition-all ${isFullScreen ? 'text-[2vw]' : 'text-[10px] sm:text-sm'}`}>
                    {currentTime.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </motion.div>
            )}

            {activeTab === "pomo" && (
              <motion.div
                key="pomo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center w-full"
              >
                {!isFullScreen && (
                  <div className="flex justify-center gap-4 mb-8">
                    {["work", "break", "custom"].map((m) => (
                      <button 
                        key={m}
                        onClick={() => {
                          alarmSound?.stop();
                          setIsAlarmPlaying(false);
                          if (m === "custom") {
                            setPomoMode("custom");
                            setIsEditingTime(true);
                            setEditValue("");
                            setPomoRunning(false);
                          } else {
                            setPomoMode(m);
                            setPomoTime(m === "work" ? 25*60 : 5*60);
                            setPomoRunning(false);
                          }
                        }}
                        className={`px-4 py-1 rounded-full text-[10px] font-mono tracking-tighter transition-all ${pomoMode === m ? "bg-purple-600 text-white" : "text-purple-400/40 border border-purple-500/20"}`}
                      >
                        {m.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative inline-block w-full">
                  {isEditingTime && (
                    <input
                      autoFocus
                      type="tel"
                      value={editValue}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(-4);
                        setEditValue(val);
                      }}
                      onBlur={() => {
                        setIsEditingTime(false);
                        const padded = editValue.padStart(4, '0');
                        const m = parseInt(padded.slice(0, 2), 10);
                        const s = parseInt(padded.slice(2, 4), 10);
                        const totalSecs = m * 60 + s;
                        if (editValue !== "" && totalSecs >= 0) {
                          setCustomTime(totalSecs);
                          setPomoMode("custom");
                          setPomoTime(totalSecs);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.target.blur();
                      }}
                      className="absolute inset-0 opacity-0 cursor-text w-full h-full z-10"
                    />
                  )}
                  <h2 
                    onClick={() => {
                      if (!pomoRunning && !isEditingTime) {
                        setIsEditingTime(true);
                        setEditValue("");
                      }
                    }}
                    title="Click para editar"
                    className={`font-['Bebas_Neue'] leading-none mb-12 transition-all duration-700 ${isFullScreen ? 'text-[20vw]' : 'text-8xl sm:text-[12rem]'} ${isEditingTime ? 'text-purple-300' : 'text-purple-100 cursor-pointer'}`}
                  >
                    {isEditingTime ? (
                      `${editValue.padStart(4, '0').slice(0, 2)}:${editValue.padStart(4, '0').slice(2, 4)}`
                    ) : (
                      formatPomo(pomoTime)
                    )}
                  </h2>
                </div>
                <div className={`flex justify-center gap-4 sm:gap-8 w-full mx-auto ${isFullScreen ? 'max-w-6xl' : 'max-w-md'}`}>
                  <button 
                    onClick={() => {
                      if (isAlarmPlaying) {
                        alarmSound?.stop();
                        setIsAlarmPlaying(false);
                        setPomoTime(pomoMode === "work" ? 25*60 : pomoMode === "break" ? 5*60 : customTime);
                      } else {
                        setPomoRunning(!pomoRunning);
                      }
                    }}
                    className={`flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-['Bebas_Neue'] transition-all shadow-lg ${isFullScreen ? 'py-10 text-7xl' : 'py-4 text-2xl'}`}
                  >
                    {isAlarmPlaying ? "STOP" : (pomoRunning ? "STOP" : "START")}
                  </button>
                  <button 
                    onClick={() => { 
                      alarmSound?.stop();
                      setIsAlarmPlaying(false);
                      setPomoTime(pomoMode === "work" ? 25*60 : pomoMode === "break" ? 5*60 : customTime); 
                      setPomoRunning(false); 
                    }}
                    className={`flex-1 border border-purple-500/20 hover:bg-purple-500/10 rounded-2xl font-['Bebas_Neue'] transition-all ${isFullScreen ? 'py-10 text-7xl' : 'py-4 text-2xl'}`}
                  >
                    RESET
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "world" && (
              <motion.div
                key="world"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`grid gap-4 sm:gap-12 w-full px-8 ${isFullScreen ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}
              >
                {worldClocks.map((clock) => (
                  <div key={clock.city} className={`bg-purple-900/10 border border-purple-500/5 rounded-3xl flex justify-between items-center group hover:border-purple-500/20 transition-all ${isFullScreen ? 'p-16 flex-col text-center' : 'p-6 sm:p-8'}`}>
                    <div className={isFullScreen ? 'mb-8' : ''}>
                      <span className={`${isFullScreen ? 'text-8xl mb-6' : 'text-2xl mb-2'} block`}>{clock.flag}</span>
                      <h3 className={`font-['Bebas_Neue'] text-purple-200 tracking-wider uppercase ${isFullScreen ? 'text-6xl' : 'text-2xl'}`}>{clock.city}</h3>
                    </div>
                    <div className={isFullScreen ? '' : 'text-right'}>
                      <p className={`font-['Bebas_Neue'] text-purple-100 ${isFullScreen ? 'text-8xl' : 'text-3xl sm:text-5xl'}`}>
                        {new Date().toLocaleTimeString("es-ES", { timeZone: clock.zone, hour12: false, hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Removed footer text that overlapped clock */}
    </div>
  );
}
