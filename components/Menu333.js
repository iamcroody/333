"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Howl } from "howler";

const hoverSound = typeof window !== "undefined" ? new Howl({ 
  src: ["/neon-on.mp3"], 
  volume: 0.1,
  sprite: {
    short: [0, 700] // Reproduce desde el inicio hasta 0.7 segundos
  }
}) : null;

export default function Menu333() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const playSound = () => {
    hoverSound?.play("short");
  };

  const links = [
    { name: "Home", href: "/", icon: "⌂" },
    { name: "Work", href: "/proyectos", icon: "❖" },
    { name: "Archive", href: "/archivos", icon: "✦" },
    { name: "Time", href: "/reloj", icon: "⧖" },
    { name: "Node", href: "/blockchain/index.html", icon: "☍", external: true },
  ];

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4 sm:px-0">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center justify-between bg-[#05010a]/50 backdrop-blur-md border border-purple-500/30 p-2 rounded-3xl shadow-[0_20px_50px_rgba(147,51,234,0.15)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
        
        {links.map((link) => {
          const isActive = pathname === link.href;
          const content = (
            <>
              <span className={`text-xl sm:text-2xl mb-1 transition-all duration-300 ${isActive ? "text-purple-400 text-shadow-neon scale-110" : "text-purple-200/40 group-hover:text-purple-300 group-hover:scale-110"}`}>
                {link.icon}
              </span>
              <span className={`text-[8px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ${isActive ? "text-purple-300 font-bold" : "text-purple-200/30 group-hover:text-purple-200"}`}>
                {link.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-0 w-8 h-[2px] bg-purple-400 shadow-[0_0_12px_#a855f7] rounded-full"
                />
              )}
            </>
          );

          return link.external ? (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playSound}
              className="relative flex-1 flex flex-col items-center justify-center py-2 group"
            >
              {content}
            </a>
          ) : (
            <Link 
              key={link.name} 
              href={link.href}
              onMouseEnter={playSound}
              className="relative flex-1 flex flex-col items-center justify-center py-2 group"
            >
              {content}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
