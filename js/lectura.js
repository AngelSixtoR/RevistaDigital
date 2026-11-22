// ============================================
// LECTOR DE REVISTA - inicializa page-flip
// ============================================

const _erroresLectura = [];
window.addEventListener("error", (e) => {
  _erroresLectura.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`);
});

// Depuración: ?debug=1 muestra métricas en pantalla (aunque el init falle)
if (location.search.indexOf("debug") !== -1) {
  setTimeout(() => {
    const flip = window._flip;
    const cont = document.getElementById("revista");
    const zona = document.querySelector(".zona-revista");
    const d = document.createElement("div");
    d.style.cssText =
      "position:fixed;left:0;top:0;z-index:9999;background:#000;color:#0f0;font:12px monospace;padding:6px;white-space:pre;max-width:100%;";
    d.textContent = flip
      ? JSON.stringify({
          ori: flip.getOrientation(),
          innerW: window.innerWidth,
          zonaW: zona ? zona.offsetWidth : null,
          bookW: cont ? cont.offsetWidth : null,
          idx: flip.getCurrentPageIndex(),
          total: flip.getPageCount(),
          errores: _erroresLectura,
        })
      : JSON.stringify({ flip: "NO CREADO", errores: _erroresLectura, St: typeof St });
    document.body.appendChild(d);
  }, 3500);
}

document.addEventListener("DOMContentLoaded", () => {
  const cont = document.getElementById("revista");
  if (!cont) return;

  // Fallback: si la librería no cargó, mostrar páginas en modo lista
  if (typeof St === "undefined" || typeof St.PageFlip !== "function") {
    document.body.classList.add("revista-estatica");
    return;
  }

  const paginas = cont.querySelectorAll(".pagina");
  if (!paginas.length) return;

  // Numerar páginas de contenido (portada y contraportada quedan sin número)
  // y construir etiquetas para el contador ( Portada | 1 | 2 | ... | Fin )
  const etiquetas = [];
  let n = 0;
  paginas.forEach((p) => {
    if (p.dataset.density === "hard") {
      etiquetas.push(etiquetas.length === 0 ? "Portada" : "Fin");
      return;
    }
    n++;
    etiquetas.push(String(n));
    const num = document.createElement("div");
    num.className = "pagina-num";
    num.textContent = n;
    p.appendChild(num);
  });
  const totalContenido = n;

  const flip = new St.PageFlip(cont, {
    width: 480,
    height: 660,
    size: "stretch",
    minWidth: 300,
    maxWidth: 1100,
    minHeight: 410,
    maxHeight: 1500,
    drawShadow: true,
    maxShadowOpacity: 0.55,
    flippingTime: 800,
    usePortrait: true,
    autoSize: true,
    showCover: true,
    startZIndex: 0,
    mobileScrollSupport: true,
    clickEventForward: false,
    useMouseEvents: false,
    swipeDistance: 30,
    // OJO: con useMouseEvents:false no se enlazan handlers de ratón/touch,
    // así que poner false NO habilita el volteo por clic. Es necesario
    // dejarlo en false porque flipPrev() usa un punto (x:10) que en modo
    // retrato (móvil) no cae en una esquina y con true el volteo atrás
    // se cancelaba silenciosamente.
    disableFlipByClick: false,
  });

  flip.loadFromHTML(paginas);
  window._flip = flip;

  // --- Contador de páginas ---
  const contador = document.getElementById("contador");
  const btnPrev = document.querySelector(".lector-flecha.prev");
  const btnNext = document.querySelector(".lector-flecha.next");

  const actualizar = () => {
    const idx = flip.getCurrentPageIndex();
    const esNum = (v) => v !== undefined && /^\d+$/.test(v);
    const etiqueta = (i) => etiquetas[i];

    if (contador) {
      if (flip.getOrientation() === "portrait") {
        const actual = etiqueta(idx);
        contador.textContent = esNum(actual)
          ? `Página ${actual} de ${totalContenido}`
          : actual || "";
      } else if (idx === 0) {
        contador.textContent = `Portada · ${totalContenido} págs.`;
      } else {
        const a = etiqueta(idx);
        const b = etiqueta(idx + 1);
        if (esNum(a) && esNum(b)) {
          contador.textContent = `Páginas ${a}\u2013${b} de ${totalContenido}`;
        } else if (esNum(a)) {
          contador.textContent = `Página ${a} de ${totalContenido}`;
        } else {
          contador.textContent = a || "";
        }
      }
    }

    if (btnPrev) btnPrev.disabled = idx <= 0;
    if (btnNext) btnNext.disabled = idx >= flip.getPageCount() - 1;
  };

  flip.on("flip", actualizar);
  flip.on("changeOrientation", actualizar);
  actualizar();

  // --- Ajuste automático del contenido a cada página ---
  // Escala la tipografía (--fit) para que nada quede cortado y reparte
  // el contenido de las páginas muy vacías. Se recalcula al girar/resize.
  const CLASES_FIT = [
    "fit-95", "fit-90", "fit-85", "fit-80", "fit-75", "fit-70", "fit-65", "fit-60",
    "fit-104", "fit-108", "fit-112",
  ];
  const ESCALAS_BAJADA = ["fit-95", "fit-90", "fit-85", "fit-80", "fit-75", "fit-70", "fit-65", "fit-60"];
  const ESCALAS_SUBIDA = ["fit-104", "fit-108", "fit-112"];
  const paginasContenido = Array.from(paginas).filter(
    (p) => p.dataset.density !== "hard"
  );

  let intentosAjuste = 0;

  const ajustarPaginas = () => {
    // Medimos con el tamaño real de una página y altura automática para
    // obtener el alto del contenido (scrollHeight nunca es menor que
    // clientHeight, así que no sirve para detectar páginas vacías).
    const rect = flip.getRender().getRect();
    const anchoPag = Math.round(rect.pageWidth);
    const altoPag = Math.round(rect.height);
    if (!anchoPag || !altoPag) {
      if (intentosAjuste < 6) {
        intentosAjuste++;
        setTimeout(ajustarPaginas, 400);
      }
      return;
    }

    let pendientes = 0;

    paginasContenido.forEach((p) => {
      const cssPrevio = p.style.cssText;
      // Modo medición: visible pero invisible, ancho de página, alto auto.
      p.style.cssText =
        `display:block!important;visibility:hidden!important;` +
        `position:absolute!important;left:0!important;top:0!important;` +
        `width:${anchoPag}px!important;height:auto!important;`;
      p.classList.remove(...CLASES_FIT, "pagina-scroll");

      const altoContenido = () => p.scrollHeight;

      if (!altoContenido()) {
        p.style.cssText = cssPrevio;
        pendientes++;
        return;
      }

      const desborda = () => altoContenido() > altoPag + 1;

      if (desborda()) {
        // Encoger hasta que quepa
        for (const clase of ESCALAS_BAJADA) {
          p.classList.add(clase);
          if (!desborda()) break;
        }
      } else {
        // Páginas muy vacías: agrandar un poco sin desbordar
        for (const clase of ESCALAS_SUBIDA) {
          if (altoContenido() / altoPag >= 0.62) break;
          p.classList.add(clase);
          if (desborda()) {
            p.classList.remove(clase);
            break;
          }
        }
      }

      const ratioFinal = altoContenido() / altoPag;
      const desbordaFinal = desborda();
      if (desbordaFinal) p.classList.add("pagina-scroll");

      p.dataset.fit =
        getComputedStyle(p).getPropertyValue("--fit").trim() || "1";
      p.dataset.ratio = ratioFinal.toFixed(2);
      p.dataset.desborde = desbordaFinal ? "si" : "no";

      p.style.cssText = cssPrevio;
    });

    // Reintento corto por si alguna página aún no tenía tamaño
    if (pendientes && intentosAjuste < 6) {
      intentosAjuste++;
      setTimeout(ajustarPaginas, 400);
    }
  };

  let tAjuste = 0;
  const programarAjuste = () => {
    clearTimeout(tAjuste);
    tAjuste = setTimeout(ajustarPaginas, 220);
  };

  window.addEventListener("resize", programarAjuste);
  flip.on("changeOrientation", programarAjuste);

  const arrancarAjuste = () => requestAnimationFrame(ajustarPaginas);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arrancarAjuste);
  } else {
    arrancarAjuste();
  }
  window.addEventListener("load", arrancarAjuste);

  // --- Flechas ---
  if (btnPrev) btnPrev.addEventListener("click", () => flip.flipPrev());
  if (btnNext) btnNext.addEventListener("click", () => flip.flipNext());

  // --- Teclado ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") flip.flipPrev();
    if (e.key === "ArrowRight") flip.flipNext();
  });

  // La revista permanece en portada; solo flechas/teclado cambian de página.
});
