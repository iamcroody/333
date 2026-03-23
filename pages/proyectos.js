// pages/proyectos.js
"use client";
import Menu333 from "../components/Menu333";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAllProyectos, getProyectosByCategory, getProyectosByStatus, categorias, estados, searchProyectos } from "../data/proyectos";
import { useGithubRepos } from "../hooks/useGithubRepos";
import WasmTensorVisualizer from "../components/WasmTensorVisualizer";
import "@fontsource/emblema-one";
import "@fontsource/dosis";

export default function Proyectos() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [proyectos, setProyectos] = useState([]);
  const [showGithubRepos, setShowGithubRepos] = useState(true);

  // Hook para obtener repos de GitHub
  const { projectsFromGithub, loading: githubLoading, error: githubError, lastUpdated } = useGithubRepos();

  useEffect(() => {
    // Combinar proyectos locales con repos de GitHub
    let allProjects = [...getAllProyectos()];

    if (showGithubRepos && projectsFromGithub.length > 0) {
      allProjects = [...allProjects, ...projectsFromGithub];
    }

    let filteredProjects = allProjects;

    // Filtrar por categoría
    if (selectedCategory !== "Todos") {
      filteredProjects = filteredProjects.filter(p => p.category === selectedCategory);
    }

    // Filtrar por estado
    if (selectedStatus !== "Todos") {
      filteredProjects = filteredProjects.filter(p => p.status === selectedStatus);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredProjects = filteredProjects.filter(p =>
        (p.title.toLowerCase().includes(query) ||
         p.description.toLowerCase().includes(query) ||
         p.technologies.some(tech => tech.toLowerCase().includes(query)) ||
         p.tags.some(tag => tag.toLowerCase().includes(query))) &&
        (selectedCategory === "Todos" || p.category === selectedCategory) &&
        (selectedStatus === "Todos" || p.status === selectedStatus)
      );
    }

    // Ordenar por fecha de actualización (repos de GitHub primero si están activos)
    filteredProjects.sort((a, b) => {
      if (a.githubData?.isFromGithub && !b.githubData?.isFromGithub) return -1;
      if (!a.githubData?.isFromGithub && b.githubData?.isFromGithub) return 1;
      return new Date(b.startDate) - new Date(a.startDate);
    });

    setProyectos(filteredProjects);
  }, [selectedCategory, selectedStatus, searchQuery, projectsFromGithub, showGithubRepos]);

  const getStatusColor = (status) => {
    const colors = {
      "Activo": "bg-green-900/30 text-green-300 border-green-700/50",
      "En Desarrollo": "bg-blue-900/30 text-blue-300 border-blue-700/50",
      "Beta": "bg-yellow-900/30 text-yellow-300 border-yellow-700/50",
      "Concepto": "bg-purple-900/30 text-purple-300 border-purple-700/50"
    };
    return colors[status] || "bg-gray-900/30 text-gray-300 border-gray-700/50";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Inteligencia Artificial": "🤖",
      "Ciberseguridad": "🔒",
      "Herramientas": "🛠️",
      "Web Development": "🌐",
      "Espiritualidad + Tech": "🧘"
    };
    return icons[category] || "💻";
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#0c0115] via-black to-black pt-24 px-4 pb-16 relative">
      {selectedCategory === "Inteligencia Artificial" && <WasmTensorVisualizer />}
      <Menu333 />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-purple-400 text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "Emblema One, sans-serif", letterSpacing: "0.05em" }}
          >
            MIS PROYECTOS
          </h1>
          <p className="text-purple-200 text-lg" style={{ fontFamily: "Dosis, sans-serif" }}>
            Creaciones que fusionan código, consciencia y propósito
          </p>
        </motion.div>

        {/* Controles */}
        <motion.div
          className="flex flex-col lg:flex-row gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Buscador */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/20 border border-purple-700/50 rounded-xl text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-600 transition-colors"
              style={{ fontFamily: "Dosis, sans-serif" }}
            />
          </div>

          {/* Toggle GitHub Repos */}
          <div className="flex items-center gap-3">
            <span className="text-purple-400 text-sm" style={{ fontFamily: "Dosis, sans-serif" }}>
              Repos GitHub:
            </span>
            <button
              onClick={() => setShowGithubRepos(!showGithubRepos)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showGithubRepos ? 'bg-purple-600' : 'bg-purple-900/30'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showGithubRepos ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            {githubLoading && (
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>Cargando repos...</span>
              </div>
            )}
            {githubError && (
              <div className="text-red-400 text-sm">
                Error: {githubError}
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-purple-400 text-sm px-3 py-2">Categoría:</span>
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => setSelectedCategory(categoria)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    selectedCategory === categoria
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-purple-900/20 text-purple-300 border-purple-700/50 hover:bg-purple-800/30"
                  } border`}
                  style={{ fontFamily: "Dosis, sans-serif" }}
                >
                  {categoria}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-purple-400 text-sm px-3 py-2">Estado:</span>
              {estados.map((estado) => (
                <button
                  key={estado}
                  onClick={() => setSelectedStatus(estado)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    selectedStatus === estado
                      ? "bg-green-600 text-white border-green-500"
                      : "bg-purple-900/20 text-purple-300 border-purple-700/50 hover:bg-purple-800/30"
                  } border`}
                  style={{ fontFamily: "Dosis, sans-serif" }}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid de proyectos */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          layout
        >
          {proyectos.map((proyecto, index) => (
            <motion.article
              key={proyecto.id}
              className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-2xl p-6 hover:from-purple-800/30 hover:to-purple-700/20 hover:border-purple-600/50 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedProject(proyecto)}
              layout
            >
              {/* Header del proyecto */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCategoryIcon(proyecto.category)}</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs border ${getStatusColor(proyecto.status)}`}>
                        {proyecto.status}
                      </span>
                      {proyecto.githubData?.isFromGithub && (
                        <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg flex items-center gap-1">
                          <span>⚡</span>
                          GitHub Live
                        </span>
                      )}
                    </div>
                    {proyecto.githubData?.isFromGithub && (
                      <div className="flex items-center gap-2 text-xs text-purple-400 overflow-hidden">
                        <span className="truncate">⭐ {proyecto.githubData.stars}</span>
                        <span className="truncate">🍴 {proyecto.githubData.forks}</span>
                        <span className="truncate">👁️ {proyecto.githubData.watchers}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {proyecto.github && (
                    <a
                      href={proyecto.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-purple-400 hover:text-purple-300 text-xl"
                    >
                      🖥️
                    </a>
                  )}
                  {proyecto.demo && (
                    <a
                      href={proyecto.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-purple-400 hover:text-purple-300 text-xl"
                    >
                      🚀
                    </a>
                  )}
                </div>
              </div>

              <h2
                className="text-purple-100 text-xl font-bold mb-2 truncate"
                style={{ fontFamily: "Emblema One, sans-serif" }}
                title={proyecto.title} // Mostrar título completo en hover
              >
                {proyecto.title}
              </h2>

              <h3
                className="text-purple-300 text-sm mb-3 font-medium truncate"
                style={{ fontFamily: "Dosis, sans-serif" }}
                title={proyecto.subtitle}
              >
                {proyecto.subtitle}
              </h3>

              <p
                className="text-purple-300 text-sm leading-relaxed mb-4 line-clamp-3 break-words"
                style={{ fontFamily: "Dosis, sans-serif" }}
                title={proyecto.description}
              >
                {proyecto.description}
              </p>

              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-400 text-xs">Progreso</span>
                  <span className="text-purple-400 text-xs">{proyecto.progress}%</span>
                </div>
                <div className="w-full bg-purple-900/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${proyecto.progress}%` }}
                  />
                </div>
              </div>

              {/* Tecnologías */}
              <div className="flex flex-wrap gap-2">
                {proyecto.technologies.slice(0, 4).map((tech, i) => {
                  // Truncar tecnologías muy largas
                  const truncatedTech = tech.length > 12 ? tech.substring(0, 9) + '...' : tech;
                  return (
                    <span
                      key={i}
                      className="text-purple-400 text-xs px-2 py-1 bg-purple-900/30 rounded-lg"
                      title={tech} // Mostrar nombre completo en hover
                    >
                      {truncatedTech}
                    </span>
                  );
                })}
                {proyecto.technologies.length > 4 && (
                  <span className="text-purple-400 text-xs px-2 py-1 bg-purple-900/30 rounded-lg">
                    +{proyecto.technologies.length - 4}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {proyectos.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-purple-400 text-lg" style={{ fontFamily: "Dosis, sans-serif" }}>
              No se encontraron proyectos con esos criterios
            </p>
          </div>
        )}
      </div>

      {/* Modal para proyecto completo */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-900/40 to-black/60 border border-purple-700/50 rounded-2xl max-w-5xl max-h-[90vh] overflow-y-auto backdrop-blur-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header del modal */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getCategoryIcon(selectedProject.category)}</span>
                    <div>
                      <span className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </span>
                      <p className="text-purple-400 text-sm mt-2">{selectedProject.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-purple-400 hover:text-purple-300 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Contenido principal */}
                  <div className="lg:col-span-2">
                    <h1
                      className="text-purple-100 text-3xl font-bold mb-2"
                      style={{ fontFamily: "Emblema One, sans-serif" }}
                    >
                      {selectedProject.title}
                    </h1>

                    <h2
                      className="text-purple-300 text-lg mb-6"
                      style={{ fontFamily: "Dosis, sans-serif" }}
                    >
                      {selectedProject.subtitle}
                    </h2>

                    <div
                      className="text-purple-200 leading-relaxed prose prose-purple max-w-none mb-8"
                      style={{ fontFamily: "Dosis, sans-serif" }}
                      dangerouslySetInnerHTML={{ __html: selectedProject.longDescription }}
                    />

                    {/* Links */}
                    <div className="flex gap-4 mb-6">
                      {selectedProject.github && (
                        <a 
                          href={selectedProject.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all"
                        >
                          <span>🖥️</span>
                          <span style={{ fontFamily: "Dosis, sans-serif" }}>Ver Código</span>
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a 
                          href={selectedProject.demo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all"
                        >
                          <span>🚀</span>
                          <span style={{ fontFamily: "Dosis, sans-serif" }}>Ver Demo</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Sidebar con detalles */}
                  <div className="space-y-6">
                    {/* Progreso */}
                    <div>
                      <h3 className="text-purple-400 font-bold mb-3" style={{ fontFamily: "Emblema One, sans-serif" }}>
                        Progreso
                      </h3>
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-300 text-sm">{selectedProject.progress}%</span>
                        </div>
                        <div className="w-full bg-purple-900/30 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-purple-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${selectedProject.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Características */}
                    <div>
                      <h3 className="text-purple-400 font-bold mb-3" style={{ fontFamily: "Emblema One, sans-serif" }}>
                        Características
                      </h3>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-purple-200 text-sm">
                            <span className="text-green-400">✓</span>
                            <span style={{ fontFamily: "Dosis, sans-serif" }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Desafíos */}
                    <div>
                      <h3 className="text-purple-400 font-bold mb-3" style={{ fontFamily: "Emblema One, sans-serif" }}>
                        Desafíos
                      </h3>
                      <ul className="space-y-2">
                        {selectedProject.challenges.map((challenge, i) => (
                          <li key={i} className="flex items-center gap-2 text-purple-200 text-sm">
                            <span className="text-yellow-400">⚡</span>
                            <span style={{ fontFamily: "Dosis, sans-serif" }}>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tecnologías */}
                    <div>
                      <h3 className="text-purple-400 font-bold mb-3" style={{ fontFamily: "Emblema One, sans-serif" }}>
                        Tecnologías
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="text-purple-400 text-xs px-2 py-1 bg-purple-900/30 rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h3 className="text-purple-400 font-bold mb-3" style={{ fontFamily: "Emblema One, sans-serif" }}>
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-purple-400 text-xs px-2 py-1 bg-purple-900/30 rounded-lg"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .prose h3 {
          color: #c084fc;
          font-family: "Emblema One", sans-serif;
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose ul, .prose ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .prose li {
          margin: 0.5rem 0;
          color: #c4b5fd;
        }
        .prose strong {
          color: #a855f7;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
