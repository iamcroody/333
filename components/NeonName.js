"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import "@fontsource/caveat/700.css";

const NAME_TEXT = "Jose Alejandro Jimenez Vasquez".split("");
const MNZZ_INDICES = [17, 19, 21, 29]; // "mnzz" (o el equivalente en este string)

export default function NeonName({ centered = true }) {
  const [litIndices, setLitIndices] = useState([]);
  const [glitchIndex, setGlitchIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const nameRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const adjustSize = () => {
      if (typeof window !== "undefined") {
        const size = Math.min(window.innerWidth * 0.08, 48);
        setFontSize(size);
      }
    };
    adjustSize();
    window.addEventListener("resize", adjustSize);

    // Secuencia de encendido "Quantum"
    const sequence = [
      [], [0, 1, 2, 3], [5, 6, 7, 8, 9, 10, 11, 12, 13], 
      [15, 16, 17, 18, 19, 20, 21], MNZZ_INDICES, 
      Array.from(NAME_TEXT.keys())
    ];

    sequence.forEach((step, i) => {
      setTimeout(() => setLitIndices(step), i * 800);
    });

    const glitchInterval = setInterval(() => {
      setGlitchIndex(Math.floor(Math.random() * NAME_TEXT.length));
      setTimeout(() => setGlitchIndex(null), 150);
    }, 8000);

    return () => {
      window.removeEventListener("resize", adjustSize);
      clearInterval(glitchInterval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <Link href="/sobre-mi" className="block cursor-pointer group">
      <motion.div
        ref={nameRef}
        className={`font-['Caveat'] italic select-none ${centered ? "text-center" : "text-left"}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {NAME_TEXT.map((char, i) => {
          const isLit = litIndices.includes(i) || litIndices.length === NAME_TEXT.length;
          const isGlitching = glitchIndex === i;
          
          return (
            <motion.span
              key={i}
              className="inline-block transition-all duration-300 group-hover:scale-110"
              animate={{
                opacity: isGlitching ? 0.3 : isLit ? 1 : 0.15,
                color: isLit ? "#d896ff" : "#222",
                textShadow: isLit 
                  ? "0 0 8px #a855f7, 0 0 16px #9333ea, 0 0 24px #6b21a8" 
                  : "none"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </motion.div>
    </Link>
  );
}
