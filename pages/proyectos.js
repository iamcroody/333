"use client";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProyectos } from "../data/proyectos";
import { useGithubRepos } from "../hooks/useGithubRepos";
import React, { useState, useEffect, useMemo } from "react";
import Menu333 from "../components/Menu333";
import NeonName from "../components/NeonName";

export default function Proyectos() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { projectsFromGithub, loading } = useGithubRepos();

  useEffect(() => {
    setMounted(true);
  }, []);

  const allProjects = useMemo(() => {
    let base = [...getAllProyectos()];
    if (projectsFromGithub && projectsFromGithub.length > 0) {
      base = [...base, ...projectsFromGithub];
    }
    return base.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [projectsFromGithub]);

  const categories = useMemo(() => {
    const cats = new Set(allProjects.map(p => p.category));
    return ["Todos", ...Array.from(cats)];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Todos") return allProjects;
    return allProjects.filter(p => p.category === selectedCategory);
  }, [allProjects, selectedCategory]);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#05010a] text-white flex flex-col items-center pt-24 sm:pt-32 px-4 pb-32">
      <Menu333 />
      <div className="absolute top-4 left-4 z-50 hidden md:block">
        <NeonName centered={false} />
      </div>

      <main className="z-10 w-full max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 sm:mb-20 text-center md:text-left"
        >
          <h1 className="text-5xl sm:text-8xl font-bold tracking-tighter mb-4 text-foreground font-['Emblema_One'] uppercase">
            Work.
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-2 rounded-full font-mono text-[9px] sm:text-xs tracking-widest uppercase transition-all border ${
                  selectedCategory === cat 
                    ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                    : "text-purple-400/40 border-purple-900/30 hover:border-purple-500/30 hover:text-purple-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-30">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-mono text-xs tracking-widest uppercase">Fetching architectural logs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proyecto, index) => (
                <motion.article
                  key={proyecto.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-purple-900/5 border border-purple-500/10 rounded-3xl p-6 sm:p-8 hover:bg-purple-900/10 hover:border-purple-500/30 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-3xl sm:text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">
                      {proyecto.category === "Ciberseguridad" ? "🔒" : proyecto.category === "Inteligencia Artificial" ? "🧠" : "🌐"}
                    </span>
                    <div className="flex gap-2">
                      {proyecto.github && (
                        <a href={proyecto.github} target="_blank" className="text-purple-400/40 hover:text-purple-400 transition-colors text-xl">
                          <span className="font-mono text-xs tracking-tighter mr-2 uppercase hidden sm:inline">Repo</span> ⎋
                        </a>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-purple-100 mb-2 font-['Bebas_Neue'] tracking-wider">
                    {proyecto.title}
                  </h2>
                  <p className="text-sm text-purple-300/60 leading-relaxed mb-6 font-['Dosis'] line-clamp-3">
                    {proyecto.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proyecto.technologies?.slice(0, 4).map((tech, i) => (
                      <span key={i} className="text-[9px] font-mono border border-purple-500/20 px-2 py-1 rounded-lg text-purple-400/60 uppercase tracking-widest bg-purple-900/20">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Overlay sutil de luz al hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
