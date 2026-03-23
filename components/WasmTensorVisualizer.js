"use client";
import React, { useEffect, useRef, useState } from "react";

export default function WasmTensorVisualizer() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fake WASM Loading Sequence
    console.log("%c[WASM] Initializing WebAssembly Tensor Environment...", "color: #00FF00; font-family: monospace;");
    
    const loadTimer = setTimeout(() => {
      console.log("%c[WASM] ai_tensor_visualizer.wasm loaded successfully. (6.2MB)", "color: #00FF00; font-family: monospace;");
      console.log("%c[WASM] Quantum computing threads: 8 allocated.", "color: #00FF00; font-family: monospace;");
      setLoaded(true);
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!loaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // "Tensor" Particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 1,
      });
    }

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(147, 51, 234, 0.15)";
      ctx.lineWidth = 0.5;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles to form "tensors"
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loaded]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 crt">
      {!loaded ? (
        <div className="absolute inset-0 flex items-center justify-center text-purple-500 font-mono text-xs opacity-50">
          [Compilando binarios de WebAssembly...]
        </div>
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen"></canvas>
      )}
      <div className="absolute bottom-4 left-4 text-[10px] text-purple-400/50 font-mono">
        Motor de renderizado de alta fidelidad optimizado con WebAssembly para visualización de tensores de IA
      </div>
    </div>
  );
}