// ============================================
// CATÁLOGO DE ARTÍCULOS
// Para agregar un artículo: sube el HTML en articulos/
// y copia una entrada aquí. No toques index.html.
// El orden NO importa: las tarjetas se ordenan solas
// por número de archivo (articulo-5 antes que articulo-10).
// Campo OPCIONAL: imagen (ruta relativa a assets/img/)
// → si existe, se usa como fondo de la tarjeta;
//   si no, mantiene el degradado de clasePortada.
// ============================================

const ARTICULOS = [
  {
    href: "articulos/articulo-5.html",
    portada: "Tema E",
    clasePortada: "portada-5",
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
    imagen: "assets/img/portada-ce.svg",
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
    categoria: "Videojuegos e IA",
    fecha: "11 · 2026",
    titulo: "Juegos e IA Multimodal",
    resumen: "Cómo texto, imagen, audio y video en tiempo real transforman los videojuegos en mundos adaptativos."
  },
  
  {
    href: "articulos/articulo-10.html",
    portada: "AG+RN",
    clasePortada: "portada-10",
    categoria: "Computación evolutiva",
    fecha: "06 · 2026",
    titulo: "Algoritmos genéticos y redes neuronales",
    resumen:
      "Cómo evolucionan las soluciones y cómo aprenden las redes: definición, componentes, funcionamiento y ejemplos en Python.",
  },
  {
    href: "articulos/articulo-11.html",
    portada: "Stream Analytics",
    clasePortada: "portada-11",
    categoria: "Analítica de Datos",
    fecha: "06 · 2026",
    titulo: "Analítica de Datos: Stream Analytics",
    resumen:
      "Introducción a la analítica de datos en tiempo real y sus aplicaciones prácticas.",
  },
];
