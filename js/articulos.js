// ============================================
// CATÁLOGO DE ARTÍCULOS
// Para agregar un artículo: sube el HTML en articulos/
// y copia una entrada aquí. No toques index.html.
// El orden NO importa: las tarjetas se ordenan solas
// por número de archivo (articulo-5 antes que articulo-10).
// Campo OPCIONAL: imagen (ruta relativa, p. ej. "portadas/portada5.png")
// → si existe, la tarjeta muestra SOLO esa imagen como portada;
//   si no, mantiene el degradado + texto de clasePortada.
// ============================================

const ARTICULOS = [
  {
    href: "articulos/articulo-5.html",
    portada: "Tema E",
    clasePortada: "portada-5",
    imagen: "portadas/portada5.png",
    categoria: "Sistemas inteligentes",
    fecha: "07 · 2026",
    titulo: "Lógica difusa, sentido común y creatividad",
    resumen:
      "Tres formas de razonar más allá del «sí o no»: lógica difusa, razonamiento con sentido común y creatividad.",
  },
  {
    href: "articulos/articulo-6.html",
    portada: "MD",
    clasePortada: "portada-6",
    imagen: "portadas/portada6.png",
    categoria: "Minería de Datos",
    fecha: "06 · 2026",
    titulo: "Minería de Datos",
    resumen:
      "Fundamentos, técnicas y usos de la minería de datos, y cómo aplicarla de forma responsable.",
  },
  {
    href: "articulos/articulo-7.html",
    portada: "CE",
    clasePortada: "portada-7",
    imagen: "portadas/portada7.png",
    categoria: "Computación evolutiva",
    fecha: "08 · 2026",
    titulo: "Cómputo evolutivo: estrategias evolutivas y programación genética",
    resumen:
      "Origen, fundamentos y operadores de las estrategias evolutivas y la programación genética, con ejemplos prácticos y una comparación entre ambos enfoques.",
  },

  {
    href: "articulos/articulo-8.html",
    portada: "IA · JUEGOS",
    clasePortada: "portada-6",
    imagen: "portadas/portada8.png",
    categoria: "Videojuegos e IA",
    fecha: "11 · 2026",
    titulo: "Juegos e IA Multimodal",
    resumen: "Cómo texto, imagen, audio y video en tiempo real transforman los videojuegos en mundos adaptativos."
  },
  
  {
    href: "articulos/articulo-9.html",
    portada: "AGENTIC AI",
    clasePortada: "portada-9",
    categoria: "AGENTIC AI",
    fecha: "11 · 2026",
    titulo: "Agentic AI: De responder a ejecutar",
    resumen:
      "Fundamentos, arquitectura, propiedades, coordinación multi-agente y gobernanza de los agentes autónomos de IA.",
  },

  {
    href: "articulos/articulo-10.html",
    portada: "AG+RN",
    clasePortada: "portada-10",
    imagen: "portadas/portada10.png",
    categoria: "Computación evolutiva",
    fecha: "06 · 2026",
    titulo: "Algoritmos genéticos y redes neuronales",
    resumen:
      "Cómo evolucionan las soluciones y cómo aprenden las redes: definición, componentes, funcionamiento y ejemplos en Python.",
  },
  {
    href: "articulos/articulo-11.html",
    portada: "STREAM ANALYTICS",
    clasePortada: "portada-7",
    imagen: "portadas/portada11.png",
    categoria: "Analítica de datos",
    fecha: "10 · 2026",
    titulo: "Analítica de Datos: Stream Analytics",
    resumen:
      "Arquitectura, motores y aplicaciones del análisis de datos en tiempo real."
  },
  {
    href: "articulos/articulo-12.html",
    portada: "MLOps",
    clasePortada: "portada-9",
    imagen: "portadas/portada9.png",
    categoria: "Ingeniería de IA",
    fecha: "11 · 2026",
    titulo: "MLOps, Ingeniería de IA y LLMOps",
    resumen:
      "Del laboratorio a la producción: cómo construir, operar y mantener sistemas de inteligencia artificial."
  },
  {
    href: "articulos/articulo-13.html",
    portada: "5 PILARES",
    clasePortada: "portada-13",
    imagen: "portadas/portada13.png",
    categoria: "Ética y Gobierno",
    fecha: "11 · 2026",
    titulo: "Los cinco pilares de una IA confiable",
    resumen:
      "IA responsable, evaluación, observabilidad, seguridad y gobierno: cómo construir sistemas de IA confiables."
  },
  {
    href: "articulos/articulo-14.html",
    portada: "NLP · LLM",
    clasePortada: "portada-7",
    categoria: "Procesamiento de Lenguaje Natural",
    fecha: "11 · 2026",
    titulo: "Inteligencia Artificial y Lenguaje: de los LLMs a la búsqueda inteligente",
    resumen: "NLP, LLMs, embeddings, búsqueda vectorial y RAG: cómo se combinan y qué límites tienen."
},
];
