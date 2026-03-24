// data/proyectos.js - Datos de los proyectos

export const proyectosData = [
  {
    id: 1,
    title: "NeuroChat AI",
    subtitle: "Sistema de Chat Inteligente con IA Personalizada",
    description:
      "Una plataforma de chat avanzada que integra múltiples modelos de IA (GPT-4, Claude, DeepSeek) con análisis semántico, memoria contextual y personalización adaptativa.",
    longDescription: `
      <p>NeuroChat AI es mi proyecto más ambicioso en el campo de la inteligencia artificial conversacional. Esta plataforma integra múltiples modelos de IA de última generación para crear experiencias de chat únicas y personalizadas.</p>

      <h3>Características Principales:</h3>
      <ul>
        <li><strong>Multi-modelo IA:</strong> Integración con GPT-4, Claude, DeepSeek y modelos locales</li>
        <li><strong>Memoria Contextual:</strong> Sistema de vectores con Pinecone para recordar conversaciones pasadas</li>
        <li><strong>Análisis Semántico:</strong> Procesamiento avanzado de lenguaje natural con LangChain</li>
        <li><strong>Personalización Adaptativa:</strong> La IA aprende de las preferencias del usuario</li>
        <li><strong>Interface Neuromórfica:</strong> Diseño UI/UX inspirado en redes neuronales</li>
      </ul>

      <p>El sistema utiliza una arquitectura de microservicios con Node.js y FastAPI, almacenamiento vectorial para la memoria semántica, y una interfaz React con animaciones Framer Motion que simula el comportamiento de neuronas.</p>
    `,
    status: "En Desarrollo",
    category: "Inteligencia Artificial",
    technologies: [
      "React",
      "Node.js",
      "Python",
      "FastAPI",
      "LangChain",
      "Pinecone",
      "OpenAI",
      "Claude",
      "DeepSeek",
      "TailwindCSS",
      "Framer Motion",
    ],
    startDate: "2024-09-01",
    progress: 75,
    features: [
      "Chat multimodal con IA",
      "Memoria contextual persistente",
      "Análisis de sentimientos",
      "Recomendaciones personalizadas",
      "API REST completa",
      "Dashboard de analytics",
    ],
    challenges: [
      "Optimización de costos de API",
      "Latencia en respuestas complejas",
      "Balanceeo entre modelos",
      "Privacidad de datos",
    ],
    github: "https://github.com/iamcroody/neurochat-ai",
    demo: null,
    images: ["/proyectos/neurochat-1.jpg", "/proyectos/neurochat-2.jpg"],
    tags: ["IA", "chat", "machine-learning", "nlp", "personalización"],
  },
  {
    id: 2,
    title: "EthosSecure",
    subtitle: "Framework de Seguridad Ética para Aplicaciones Web",
    description:
      "Un framework completo de seguridad que implementa principios éticos hacker para proteger aplicaciones web, incluyendo detección de vulnerabilidades y hardening automático.",
    longDescription: `
      <p>EthosSecure nace de mi formación en seguridad informática y la filosofía hacker ética. Es un framework que automatiza la implementación de medidas de seguridad en aplicaciones web siguiendo los mejores principios de la ciberseguridad responsable.</p>

      <h3>Módulos del Framework:</h3>
      <ul>
        <li><strong>VulnScanner:</strong> Análisis automático de vulnerabilidades OWASP Top 10</li>
        <li><strong>EthosGuard:</strong> Sistema de prevención de intrusiones en tiempo real</li>
        <li><strong>CryptoShield:</strong> Implementación automática de cifrado end-to-end</li>
        <li><strong>AuditTrail:</strong> Sistema de logging y auditoría completo</li>
        <li><strong>AccessMatrix:</strong> Control de acceso basado en roles y políticas</li>
      </ul>

      <p>El framework está construido con una mentalidad de "seguridad por diseño", donde cada componente integra protecciones desde su concepción, no como una capa adicional.</p>
    `,
    status: "Activo",
    category: "Ciberseguridad",
    technologies: [
      "Python",
      "FastAPI",
      "Redis",
      "PostgreSQL",
      "Docker",
      "Nginx",
      "OpenSSL",
      "JWT",
      "OAuth2",
      "Prometheus",
    ],
    startDate: "2024-09-15",
    progress: 90,
    features: [
      "Análisis de vulnerabilidades automático",
      "Hardening de servidores Linux",
      "Monitoreo de seguridad 24/7",
      "Cifrado automático de datos",
      "Dashboard de amenazas",
      "Alertas en tiempo real",
    ],
    challenges: [
      "Falsos positivos en detección",
      "Performance en análisis profundo",
      "Compatibilidad con frameworks legacy",
      "Balance seguridad-usabilidad",
    ],
    github: "https://github.com/iamcroody/ethos-secure",
    demo: "https://demo.ethossecure.dev",
    images: ["/proyectos/ethossecure-1.jpg", "/proyectos/ethossecure-2.jpg"],
    tags: [
      "seguridad",
      "ethical-hacking",
      "framework",
      "vulnerabilidades",
      "protección",
    ],
  },
  {
    id: 3,
    title: "MindfulCode",
    subtitle: "Editor de Código con Principios de Programación Consciente",
    description:
      "Un editor de código único que integra técnicas de mindfulness y bienestar digital para crear una experiencia de programación más consciente y productiva.",
    longDescription: `
      <p>MindfulCode surge de mi práctica diaria de meditación y programación. Es un editor que transforma el acto de programar en una experiencia mindful, integrando técnicas de respiración consciente y bienestar digital.</p>

      <h3>Características Innovadoras:</h3>
      <ul>
        <li><strong>Breathing Mode:</strong> Recordatorios de respiración consciente durante el coding</li>
        <li><strong>Zen Theme:</strong> Temas visuales diseñados para reducir fatiga mental</li>
        <li><strong>Flow Tracker:</strong> Análisis de patrones de concentración y productividad</li>
        <li><strong>Mindful Breaks:</strong> Pausas automáticas con ejercicios de mindfulness</li>
        <li><strong>Code Meditation:</strong> Modo especial para revisión contemplativa del código</li>
      </ul>

      <p>Más que un editor, es una herramienta para cultivar presencia y consciencia durante el desarrollo, mejorando tanto la calidad del código como el bienestar del programador.</p>
    `,
    status: "Beta",
    category: "Herramientas",
    technologies: [
      "Electron",
      "TypeScript",
      "Monaco Editor",
      "React",
      "Node.js",
      "SQLite",
      "Chart.js",
      "Howler.js",
    ],
    startDate: "2024-10-09",
    progress: 60,
    features: [
      "Editor de código completo",
      "Recordatorios de respiración",
      "Análisis de productividad",
      "Temas zen personalizables",
      "Sounds ambientales",
      "Métricas de bienestar",
    ],
    challenges: [
      "Balance entre funcionalidad y simplicidad",
      "Integración con IDEs existentes",
      "Métricas de bienestar precisas",
      "Performance en proyectos grandes",
    ],
    github: "https://github.com/iamcroody/mindful-code",
    demo: "https://mindfulcode.app",
    images: ["/proyectos/mindfulcode-1.jpg", "/proyectos/mindfulcode-2.jpg"],
    tags: ["editor", "mindfulness", "bienestar", "productividad", "coding"],
  },
  {
    id: 4,
    title: "QuantumPortfolio",
    subtitle: "Este Portafolio Personal",
    description:
      "Mi portafolio personal construido con Next.js, featuring animaciones cuánticas, diseño neuromórfico y una experiencia inmersiva que refleja mi filosofía de programación consciente.",
    longDescription: `
      <p>Este mismo portafolio es un proyecto en sí mismo, diseñado para ser más que una simple colección de trabajos. Es una experiencia inmersiva que refleja mi filosofía de desarrollo y mi enfoque único hacia la tecnología.</p>

      <h3>Arquitectura y Diseño:</h3>
      <ul>
        <li><strong>Next.js 15:</strong> Framework React de última generación</li>
        <li><strong>Framer Motion:</strong> Animaciones físicamente realistas</li>
        <li><strong>TailwindCSS:</strong> Sistema de diseño consistente</li>
        <li><strong>Diseño Responsivo:</strong> Optimizado para todos los dispositivos</li>
        <li><strong>Performance First:</strong> Optimizaciones de carga y rendering</li>
      </ul>

      <p>Cada sección está cuidadosamente crafteada para contar una historia, desde las animaciones cuánticas hasta la tipografía que refleja personalidad y profesionalismo.</p>
    `,
    status: "Activo",
    category: "Web Development",
    technologies: [
      "Next.js",
      "React",
      "TailwindCSS",
      "Framer Motion",
      "TypeScript",
      "Vercel",
    ],
    startDate: "2024-11-01",
    progress: 95,
    features: [
      "Sistema de blogs dinámico",
      "Galería fotográfica interactiva",
      "Showcase de proyectos",
      "Animaciones cuánticas",
      "Diseño neuromórfico",
      "SEO optimizado",
    ],
    challenges: [
      "Optimización de animaciones",
      "Balance visual-performance",
      "Compatibilidad cross-browser",
      "Accesibilidad completa",
    ],
    github: "https://github.com/iamcroody/quantum-portfolio",
    demo: "https://eskhe.com",
    images: ["/proyectos/portfolio-1.jpg", "/proyectos/portfolio-2.jpg"],
    tags: ["portfolio", "next.js", "web-design", "animaciones", "personal"],
  },
  {
    id: 5,
    title: "SpiritualTech",
    subtitle: "Plataforma de Meditación con IA",
    description:
      "Una aplicación que combina inteligencia artificial con prácticas espirituales, generando meditaciones personalizadas basadas en el estado emocional y objetivos del usuario.",
    longDescription: `
      <p>SpiritualTech es la intersección perfecta entre mi práctica espiritual y mis habilidades técnicas. Esta plataforma utiliza IA para crear experiencias de meditación únicas y personalizadas.</p>

      <h3>Funcionalidades Espirituales-Tech:</h3>
      <ul>
        <li><strong>AI Meditation Generator:</strong> Meditaciones generadas por IA según el estado del usuario</li>
        <li><strong>Biometric Integration:</strong> Conexión con dispositivos de monitoreo cardíaco</li>
        <li><strong>Sacred Geometry Visualizer:</strong> Visualizaciones matemáticas para meditación</li>
        <li><strong>Chakra Balancer:</strong> Análisis y equilibrio energético digital</li>
        <li><strong>Manifestation Tracker:</strong> Seguimiento de intenciones y manifestaciones</li>
      </ul>

      <p>La app integra conocimientos milenarios con tecnología de vanguardia, creando un puente entre lo ancestral y lo futurista.</p>
    `,
    status: "Concepto",
    category: "Espiritualidad + Tech",
    technologies: [
      "React Native",
      "Python",
      "TensorFlow",
      "Firebase",
      "Spotify API",
      "WebGL",
      "Three.js",
    ],
    startDate: "2024-12-01",
    progress: 25,
    features: [
      "Meditaciones generadas por IA",
      "Tracking biométrico",
      "Visualizaciones 3D",
      "Soundscapes adaptativos",
      "Community espiritual",
      "Progress spiritual analytics",
    ],
    challenges: [
      "Validación científica vs. espiritual",
      "Privacy en datos biométricos",
      "UX para diferentes niveles espirituales",
      "Monetización ética",
    ],
    github: "https://github.com/iamcroody/spiritual-tech",
    demo: null,
    images: ["/proyectos/spiritualtech-1.jpg", "/proyectos/spiritualtech-2.jpg"],
    tags: ["espiritualidad", "IA", "meditación", "biométrico", "visualización"],
  },

  // =====================
  // Proyectos añadidos según tu ecosistema actual
  // =====================
];

// Categorías de proyectos
export const categorias = [
  "Todos",
  "Inteligencia Artificial",
  "Ciberseguridad",
  "Herramientas",
  "Web Development",
  "Espiritualidad + Tech",
];

// Estados de proyectos
export const estados = ["Todos", "Activo", "En Desarrollo", "Beta", "Concepto"];

// Función para obtener todos los proyectos
export const getAllProyectos = () => proyectosData;

// Función para obtener proyectos por categoría
export const getProyectosByCategory = (category) => {
  if (category === "Todos") return proyectosData;
  return proyectosData.filter((proyecto) => proyecto.category === category);
};

// Función para obtener proyectos por estado
export const getProyectosByStatus = (status) => {
  if (status === "Todos") return proyectosData;
  return proyectosData.filter((proyecto) => proyecto.status === status);
};

// Función para buscar proyectos
export const searchProyectos = (query) =>
  proyectosData.filter((proyecto) =>
    proyecto.title.toLowerCase().includes(query.toLowerCase()) ||
    proyecto.description.toLowerCase().includes(query.toLowerCase()) ||
    proyecto.technologies.some((tech) => tech.toLowerCase().includes(query.toLowerCase())) ||
    proyecto.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );