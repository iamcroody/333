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
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
        className="absolute top-6 left-6 z-50 hidden md:block hover:opacity-100 transition-opacity"
      >
        <NeonName centered={false} />
      </motion.div>

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

            <div className="mt-8 flex flex-col gap-6">
              <motion.div whileHover={{ x: 10 }}>
                <a href="https://instagram.com/iamcroody" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-purple-400 hover:text-purple-200 transition-all font-['Bebas_Neue'] text-3xl tracking-widest">
                  INSTAGRAM_FEED <span>→</span>
                </a>
              </motion.div>

              <motion.div whileHover={{ x: 10 }}>
                <a href="https://co.linkedin.com/in/josealejandrojimenez" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-purple-400 hover:text-purple-200 transition-all font-['Bebas_Neue'] text-3xl tracking-widest">
                  LINKEDIN_NETWORK <span>→</span>
                </a>
              </motion.div>
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
                Born in <span className="text-purple-400 font-bold">2005</span>. My digital journey began at 14 in the depths of cybersecurity forums, where I learned that code is power and privacy is non-negotiable.
              </p>
              <p>
                Today, as a Systems Engineering student at <span className="text-purple-400 font-bold">EAFIT University</span> and Founder/CTO of <span className="text-purple-400 font-bold">Croody</span>, my natural environment has no graphical interface; it's the terminal. I build distributed systems and Artificial Intelligence architectures that respect human agency. I don't believe in vendor lock-in or relying on third-party public networks; I prioritize proprietary infrastructure, radical security, and raw performance.
              </p>
              <p>
                My Christian faith is the anchor that gives purpose to every line of code: creating technology that edifies, returns sovereignty to the user, and transcends digital noise instead of exploiting it.
              </p>
            </div>

            <div className="space-y-6 mt-8">
              <h3 className="font-mono text-xs tracking-[0.4em] text-purple-500/60 uppercase border-b border-purple-500/20 pb-4">The Ethos / Discipline</h3>
              <div className="text-lg sm:text-xl font-light text-purple-100/80 leading-relaxed font-['Dosis'] text-justify bg-purple-900/10 p-6 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all">
                <p>
                  Technical excellence doesn't come from syntax, it comes from routine. My days start at 4 A.M., combining high physical performance with engineering. I firmly believe that discipline in the physical world translates directly into cleaner, more scalable, and resilient architectures in the digital world. They say luck is handed out at 5 A.M., and I make sure to be first in line.
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              <h3 className="font-mono text-xs tracking-[0.4em] text-purple-500/60 uppercase border-b border-purple-500/20 pb-4">Core Protocols</h3>
              <ul className="space-y-8 text-lg sm:text-xl font-light text-purple-100/80 leading-relaxed font-['Dosis'] text-justify">
                <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-purple-500 before:rounded-full">
                  <strong className="text-purple-400 font-bold font-mono text-sm tracking-widest uppercase block mb-1">Systems Architecture & Backend</strong>
                  Design of scalable ecosystems and proprietary infrastructure (Rust, Python, Node.js, Next.js).
                </li>
                <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-purple-500 before:rounded-full">
                  <strong className="text-purple-400 font-bold font-mono text-sm tracking-widest uppercase block mb-1">Operational Security (SecOps)</strong>
                  Server hardening, Kali Linux administration, WireGuard tunnels implementation, and strict automation.
                </li>
                <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-purple-500 before:rounded-full">
                  <strong className="text-purple-400 font-bold font-mono text-sm tracking-widest uppercase block mb-1">Ethical AI & Sovereignty</strong>
                  Development of models and natural language processing focused on empowering user independence, not generating friction.
                </li>
                <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-purple-500 before:rounded-full">
                  <strong className="text-purple-400 font-bold font-mono text-sm tracking-widest uppercase block mb-1">Full-Stack Deployment</strong>
                  Interfaces tailored for absolute performance and accessibility, connecting complex backend logic with fluid ecosystems (Flutter, Web).
                </li>
              </ul>
            </div>

            {/* Espaciador final para la navbar */}
            <div className="h-24 sm:h-32"></div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
