import { motion } from "framer-motion";
import NeonName from "../components/NeonName";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col px-6 md:px-24 justify-center items-center relative overflow-hidden">
      
      <main className="z-10 flex flex-col items-center gap-8 w-full max-w-4xl mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <NeonName centered={true} />
          {/* Reflejo del neón sutil */}
          <div className="absolute top-full left-0 w-full h-16 bg-gradient-to-b from-purple-500/10 to-transparent blur-2xl pointer-events-none" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.h2 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(88, 28, 135, 0.25)" }}
            className="font-mono text-purple-200/90 text-xs md:text-sm tracking-[0.5em] uppercase font-light border border-purple-500/30 py-4 px-10 bg-purple-900/10 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-colors cursor-default"
          >
            Software Architect <span className="text-purple-400 mx-3 animate-pulse">×</span> Digital Artisan
          </motion.h2>
        </motion.div>
      </main>

      {/* Partículas flotantes sutiles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full pointer-events-none"
          animate={{
            x: [Math.random() * 100 + "vw", Math.random() * 100 + "vw"],
            y: [Math.random() * 100 + "vh", Math.random() * 100 + "vh"],
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
