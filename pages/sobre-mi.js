"use client";
import Menu333 from "../components/Menu333";
import NeonName from "../components/NeonName";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "../config/content";

export default function SobreMi() {
  const stats = [
    { label: "Systems Engineer", value: "@EAFIT", icon: "🏛️" },
    { label: "Experience", value: "+2 Years", icon: "⚡" },
    { label: "Location", value: "Medellín, CO", icon: "📍" },
    { label: "Faith", value: "Christian", icon: "✞" },
  ];

  return (
    <div className="min-h-screen bg-[#05010a] text-white flex flex-col items-center pt-24 sm:pt-32 px-4 pb-32">
      <Menu333 />
      <div className="absolute top-4 left-4 z-50 hidden md:block">
        <NeonName centered={false} />
      </div>

      <main className="z-10 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20">
          
          {/* Columna Izquierda: Imagen y Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative aspect-[4/5] bg-purple-900/20 rounded-[2rem] border border-purple-500/20 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img 
                  src="/textures/sobre-mi.jpg" 
                  alt="Jose Jimenez" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="bg-purple-900/10 border border-purple-500/10 p-4 rounded-2xl flex flex-col items-center text-center hover:border-purple-500/30 transition-all"
                >
                  <span className="text-xl mb-2">{stat.icon}</span>
                  <span className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">{stat.label}</span>
                  <span className="text-sm font-bold text-purple-100">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Columna Derecha: Bio y Skills */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 flex flex-col gap-10"
          >
            <header>
              <h1 className="text-5xl sm:text-8xl font-bold font-['Emblema_One'] text-purple-500 mb-4 uppercase">
                Profile.
              </h1>
              <div className="h-1 w-20 bg-purple-600 rounded-full" />
            </header>

            <div className="space-y-6 text-lg sm:text-xl font-light text-purple-100/80 leading-relaxed font-['Dosis'] text-justify">
              <p>
                Nacido en <span className="text-purple-400 font-bold">2005</span>, mi camino digital comenzó en la profundidad de la red a los 14 años. Lo que empezó como curiosidad radical en foros de seguridad se transformó en una vocación innegociable por la ingeniería de sistemas.
              </p>
              <p>
                Hoy, como estudiante de la <span className="text-purple-400 font-bold">Universidad EAFIT</span> y desarrollador Full-Stack, fusiono la estética brutalista con arquitecturas robustas. Mi fe cristiana es el ancla que le da propósito a cada línea de código: crear herramientas que edifiquen y trasciendan el ruido digital.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-mono text-xs tracking-[0.4em] text-purple-500/60 uppercase border-b border-purple-500/20 pb-4">Core Protocols</h3>
              <div className="flex flex-wrap gap-3">
                {SITE_CONFIG.pages.about.skills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-purple-900/20 border border-purple-500/10 rounded-xl text-xs sm:text-sm text-purple-300 font-mono hover:bg-purple-600 hover:text-white transition-all cursor-default">
                    {skill.split(".")[0]}
                  </span>
                ))}
              </div>
            </div>

            <motion.div 
              whileHover={{ x: 10 }}
              className="mt-4"
            >
              <a href={`mailto:${SITE_CONFIG.personal.email}`} className="group flex items-center gap-4 text-purple-400 hover:text-purple-200 transition-all font-['Bebas_Neue'] text-3xl tracking-widest">
                ESTABLISH_CONNECTION <span>→</span>
              </a>
            </motion.div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
