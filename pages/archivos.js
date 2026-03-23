"use client";
import Menu333 from "../components/Menu333";
import NeonName from "../components/NeonName";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/emblema-one";
import "@fontsource/dosis";

const ARCHIVE_DATA = [
  {
    category: "Labs de Ciberseguridad",
    icon: "💀",
    items: [
      { title: "Hardening de Kernel Linux", type: "Exploit/Fix", date: "2023", description: "Configuración de sysctl para mitigar ataques de red y endurecimiento de memoria." },
      { title: "Análisis de Payload en Metasploit", type: "Lab", date: "2022", description: "Estudio de evasión de AV mediante polimorfismo en entornos controlados." },
      { title: "Scripting de Reconocimiento Pasivo", type: "Tool", date: "2024", description: "Automatización de OSINT usando APIs de Shodan y Censys en Python." }
    ]
  },
  {
    category: "Universidad (EAFIT)",
    icon: "🏛️",
    items: [
      { title: "Estructuras de Datos Avanzadas", type: "Notas", date: "2024", description: "Implementación de Árboles B+ y Grafos para optimización de búsquedas." },
      { title: "Sistemas Operativos", type: "Proyecto", date: "2024", description: "Simulación de Scheduler de CPU con algoritmos Round Robin y Priority." },
      { title: "Lógica de Programación", type: "Monitoría", date: "2023", description: "Guías de apoyo para recursividad y algoritmos de ordenamiento." }
    ]
  },
  {
    category: "Filosofía Digital",
    icon: "🧠",
    items: [
      { title: "Manifiesto del Código Consciente", type: "Ensayo", date: "2025", description: "Por qué la estética del código es tan importante como su funcionalidad." },
      { title: "Ética en la IA Generativa", type: "Reflexión", date: "2024", description: "Límites morales en el entrenamiento de modelos con datos públicos." }
    ]
  }
];

function Terminal({ onUnlock }) {
  const [history, setHistory] = useState([
    "iamcroody-os v2.4.1 (tty1)",
    "Sistema de archivos cifrado. Propiedad intelectual protegida.",
    "Para ver los comandos disponibles escriba 'help'."
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      let response = [];
      
      switch (cmd) {
        case "help":
          response = [
            "Comandos disponibles:",
            "  ls       - Lista los directorios del sistema",
            "  cat      - Muestra el contenido de un archivo",
            "  decrypt  - Inicia el proceso de descifrado",
            "  clear    - Limpia la terminal",
            "  whoami   - Muestra el usuario actual"
          ];
          break;
        case "ls":
          response = ["drwxr-xr-x  labs/", "drwxr-xr-x  universidad/", "drwxr-xr-x  filosofia/", "-rw-r--r--  secrets.enc"];
          break;
        case "whoami":
          response = ["guest_user"];
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "cat secrets.enc":
          response = ["[ERROR] Archivo cifrado. Use 'decrypt secrets' para intentar acceder."];
          break;
        case "decrypt secrets":
        case "decrypt secrets.enc":
        case "decrypt":
          response = [
            "Iniciando secuencia de descifrado cuántico...",
            "Calculando colisiones SHA-256...",
            "By-pass de firewall completado.",
            "Acceso concedido."
          ];
          setTimeout(() => onUnlock(), 1500);
          break;
        case "cat labs/linux-kernel.txt":
          response = [
            "fs.file-max = 2097152",
            "net.ipv4.tcp_syncookies = 1",
            "net.ipv4.conf.all.rp_filter = 1",
            "net.ipv4.conf.default.accept_source_route = 0"
          ];
          break;
        default:
          if (cmd.startsWith("cat ")) {
            response = [`cat: ${cmd.split(" ")[1]}: Permission denied o No such file`];
          } else if (cmd !== "") {
            response = [`bash: ${cmd}: command not found`];
          }
      }

      setHistory([...history, `root@iamcroody:~$ ${input}`, ...response]);
      setInput("");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-black border border-purple-500/30 rounded-lg p-4 font-mono text-sm sm:text-base crt overflow-hidden relative shadow-[0_0_15px_rgba(147,51,234,0.2)]" style={{ height: "400px" }}>
      <div className="absolute top-0 left-0 w-full h-6 bg-purple-900/40 flex items-center px-3 border-b border-purple-500/30">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="ml-4 text-xs text-purple-300">root@iamcroody-os:~</span>
      </div>
      <div className="pt-8 h-full overflow-y-auto text-green-400 space-y-1 pb-10" onClick={() => inputRef.current?.focus()}>
        {history.map((line, i) => (
          <div key={i} className={`${line.startsWith("root@") ? "text-purple-400" : ""}`}>{line}</div>
        ))}
        <div className="flex">
          <span className="text-purple-400 mr-2">root@iamcroody:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent outline-none border-none text-green-400"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default function ArchiveroPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <Menu333 />
      <div className="absolute top-4 left-4 z-50"><NeonName /></div>

      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-purple-500 text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "Emblema One, sans-serif" }}>
            EL ARCHIVERO
          </h1>
          <p className="text-purple-300/70 max-w-2xl mx-auto" style={{ fontFamily: "Dosis, sans-serif" }}>
            Mi propio sistema de archivos cifrado para proteger mi propiedad intelectual. 
            Conocimiento bruto, notas de campo y fragmentos de realidad digital.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              <Terminal onUnlock={() => setIsUnlocked(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Enlace al easter egg del blockchain */}
              <div className="mb-8 text-right">
                <a href="/blockchain/index.html" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 font-mono text-xs crt animate-pulse">
                  [!] ACCEDER_AL_SIMULADOR_BLOCKCHAIN_NODE
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {ARCHIVE_DATA.map((cat, idx) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      selectedCategory === idx 
                        ? "bg-purple-900/40 border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)]" 
                        : "bg-purple-900/10 border-purple-800/30 hover:border-purple-600/50"
                    }`}
                  >
                    <div className="text-4xl mb-4">{cat.icon}</div>
                    <h2 className="text-xl font-bold text-purple-200 mb-2" style={{ fontFamily: "Emblema One, sans-serif" }}>
                      {cat.category}
                    </h2>
                    <p className="text-xs text-purple-400/60 uppercase tracking-widest">
                      {cat.items.length} Archivos encontrados
                    </p>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {selectedCategory !== null && (
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {ARCHIVE_DATA[selectedCategory].items.map((item, i) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-purple-100 font-bold group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30">
                            {item.type} • {item.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}