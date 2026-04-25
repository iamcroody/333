"use client";
import Menu333 from "../components/Menu333";
import NeonName from "../components/NeonName";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOKS_DATA = [
  {
    id: "01",
    title: "El Alquimista",
    author: "Paulo Coelho",
    synopsis: "Santiago, un joven pastor, emprende un viaje desde España hasta los desiertos de Egipto en busca de un tesoro. En el camino, descubre que el tesoro real es la capacidad de escuchar a su corazón y leer el lenguaje de las señales que el universo pone frente a él.",
    perspective: "Es mi manual de visión estratégica. Me enseña que el camino del emprendedor (mi \"Leyenda Personal\") no es lineal, sino una serie de pruebas diseñadas para ver si somos capaces de sostener el sueño cuando el desierto se pone difícil. Es el alma detrás de cada proyecto."
  },
  {
    id: "02",
    title: "La Biblia",
    author: "Especialmente Evangelios y Sabiduría",
    synopsis: "Los Evangelios narran la vida y el liderazgo de servicio de Jesús, mientras que los libros sapienciales de Salomón (Eclesiastés y Proverbios) ofrecen máximas sobre la naturaleza humana, la ética y el discernimiento.",
    perspective: "Mi protocolo de gobernanza. En un mundo saturado de información efímera, la Biblia me da leyes inmutables. Los Evangelios me enseñan el liderazgo de servicio, y Salomón me da la lógica para discernir qué es vanidad y qué es valor real en el mercado y en la vida."
  },
  {
    id: "03",
    title: "El Club de las 5 de la Mañana",
    author: "Robin Sharma",
    synopsis: "A través de una fábula sobre un artista y una emprendedora, Sharma presenta la \"Fórmula 20/20/20\" para optimizar la primera hora del día, enfocándose en la salud física, mental, emocional y espiritual.",
    perspective: "Mi algoritmo de alto rendimiento. Aunque yo lo llevé al siguiente nivel empezando a las 4:00 A.M., este libro me dio la estructura para entender que la victoria se gana en la soledad de la madrugada. Es donde optimizo mi hardware biológico antes de entrar al mundo."
  },
  {
    id: "04",
    title: "Meditaciones",
    author: "Marco Aurelio",
    synopsis: "Los diarios personales del emperador romano más poderoso de su tiempo, escritos durante campañas militares, donde reflexiona sobre la brevedad de la vida, el autocontrol y el cumplimiento del deber por encima del placer o el dolor.",
    perspective: "Mi firewall emocional. Cuando eres responsable de tecnología y de personas, el caos es constante. Marco Aurelio me enseña a mantener la \"ciudadela interna\" invicta. No puedo controlar que un servidor falle, pero sí mi reacción ante el fallo."
  },
  {
    id: "05",
    title: "El Guardián Entre el Centeno",
    author: "J.D. Salinger",
    synopsis: "Holden Caulfield narra su deambular por Nueva York tras ser expulsado del colegio. Es una exploración cruda de la alienación adolescente, el rechazo a la hipocresía social (la \"falsedad\") y el deseo de proteger la inocencia.",
    perspective: "Mi manifiesto de autenticidad. Fue el libro que encendió mi voluntad de leer y pensar por fuera del sistema. Me recuerda que para innovar de verdad, hay que tener el coraje de señalar lo que no funciona y mantener una esencia propia frente a las expectativas del mundo."
  },
  {
    id: "06",
    title: "El Poder del Ahora",
    author: "Eckhart Tolle",
    synopsis: "Un tratado sobre la importancia de desidentificarse de la mente y el ego para vivir en el presente. Tolle explica cómo el sufrimiento surge de vivir en el pasado o de la ansiedad por el futuro.",
    perspective: "Mi parche de latencia cero. En tecnología siempre estamos pensando en el próximo \"release\", pero este libro me obliga a ejecutar con presencia absoluta. La claridad mental que necesito para resolver problemas complejos solo existe cuando apago el ruido del ego y me enfoco en el \"ahora\"."
  },
  {
    id: "07",
    title: "Buda Blues",
    author: "Mario Mendoza",
    synopsis: "Una correspondencia entre dos amigos que exploran la resistencia ante un sistema devorador. Mendoza analiza la marginalidad, la espiritualidad rebelde y la necesidad de encontrar un sentido profundo en una sociedad que parece ir hacia el abismo.",
    perspective: "Mi análisis de sistemas sociales. Me gusta más que Satanás porque es una rebelión intelectual. Me recuerda que la tecnología que construyo en Croody debe ser una herramienta de liberación y no un engranaje más en la \"sociedad del cansancio\". Es mi cable a tierra con el humanismo."
  },
  {
    id: "08",
    title: "Resetea tu Mente",
    author: "Mario Alonso Puig",
    synopsis: "Un médico explica cómo nuestros pensamientos y palabras afectan físicamente nuestro cerebro y nuestra salud. Ofrece herramientas basadas en la neurociencia para cambiar percepciones y superar límites autoimpuestos.",
    perspective: "Mi manual de reingeniería neural. Si voy a construir inteligencia artificial, primero debo entender y optimizar mi propia inteligencia biológica. Este libro me dio la base científica para entender que puedo reprogramar mis miedos para que trabajen a mi favor."
  },
  {
    id: "09",
    title: "El Hombre Más Rico de Babilonia",
    author: "George Clason",
    synopsis: "A través de parábolas ambientadas en la antigua Babilonia, el libro enseña las reglas básicas del manejo del dinero: ahorrar el 10%, controlar gastos y hacer que el dinero trabaje para ti.",
    perspective: "Mi capa de infraestructura financiera. Son las leyes más simples y efectivas que existen. Entiendo que la soberanía total requiere independencia económica, y este libro es el cimiento sobre el cual construyo la escalabilidad de mi vida y mis empresas."
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
      <style jsx>{`
        .crt::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
      `}</style>
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
  const [isMounted, setIsMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#05010a] text-white relative overflow-hidden font-sans">
      <Menu333 />
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
        className="absolute top-6 left-6 z-50 hidden md:block hover:opacity-100 transition-opacity"
      >
        <NeonName centered={false} />
      </motion.div>

      <div className="pt-32 pb-64 px-6 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-purple-500 text-4xl md:text-6xl font-bold mb-4 font-['Emblema_One'] tracking-widest">
            EL ARCHIVERO
          </h1>
          <AnimatePresence>
            {isUnlocked && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-purple-300/70 max-w-3xl mx-auto font-['Dosis'] text-lg"
              >
                Esta es la selección de los 9 pilares que sostienen mi visión como arquitecto de tecnología y buscador de propósito. No son solo libros; son los "bloques de código" con los que he programado mi realidad para estar a las 4:00 A.M. listo para cuando la suerte decida aparecer.
              </motion.p>
            )}
          </AnimatePresence>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {BOOKS_DATA.map((book, idx) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-6 sm:p-8 hover:bg-purple-900/20 hover:border-purple-500/40 hover:shadow-[0_10px_40px_-10px_rgba(147,51,234,0.2)] transition-all group flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 text-9xl font-['Emblema_One'] text-purple-900/10 group-hover:text-purple-500/10 transition-colors pointer-events-none select-none">
                      {book.id}
                    </div>
                    <div className="flex items-start gap-4 mb-6 relative z-10">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-purple-100 font-['Bebas_Neue'] tracking-wider mb-1">
                          {book.title}
                        </h2>
                        <h3 className="text-xs font-mono text-purple-400/80 uppercase tracking-widest">
                          {book.author}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="space-y-6 flex-grow text-sm sm:text-base font-light text-purple-100/70 font-['Dosis'] text-justify relative z-10">
                      <div>
                        <strong className="block text-xs font-mono text-purple-500/60 uppercase tracking-widest mb-2 border-b border-purple-500/10 pb-1">Sinopsis</strong>
                        <p>{book.synopsis}</p>
                      </div>
                      <div className="bg-purple-900/20 border-l-2 border-purple-500 p-4 rounded-r-xl">
                        <strong className="block text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">Mi Perspectiva</strong>
                        <p className="text-purple-200/90 italic">{book.perspective}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
