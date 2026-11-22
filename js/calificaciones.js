import { MODO, supabase } from './supabase-config.js';

const estrellas = [1, 2, 3, 4, 5];
const demoInicial = { promedio: 4.6, total: 28 };
const datosDemo = new Map();
const cacheContenidos = new Map();

async function obtenerContenido(slug) {
  if (cacheContenidos.has(slug)) return cacheContenidos.get(slug);
  const { data, error } = await supabase.from('contenidos').select('id').eq('slug', slug).single();
  if (error) throw error;
  cacheContenidos.set(slug, data.id);
  return data.id;
}

async function usuarioActual() {
  const { data: sesion, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (sesion.session?.user) return sesion.session.user.id;
  const { data, error: authError } = await supabase.auth.signInAnonymously();
  if (authError) throw authError;
  return data.user.id;
}

async function consultar(slug) {
  if (MODO === 'demo') {
    const dato = datosDemo.get(slug);
    return dato || { ...demoInicial, voto: null };
  }
  const contenidoId = await obtenerContenido(slug);
  // Paginación para no depender del límite por defecto de 1000 filas.
  let offset = 0, total = 0, suma = 0;
  while (true) {
    const { data, error } = await supabase.from('calificaciones')
      .select('puntuacion').eq('contenido_id', contenidoId)
      .range(offset, offset + 999);
    if (error) throw error;
    for (const fila of data) { total++; suma += fila.puntuacion; }
    if (data.length < 1000) break;
    offset += 1000;
  }
  const { data: sesion } = await supabase.auth.getSession();
  let voto = null;
  if (sesion.session?.user) {
    const { data, error } = await supabase.from('calificaciones')
      .select('puntuacion').eq('contenido_id', contenidoId)
      .eq('usuario_id', sesion.session.user.id).maybeSingle();
    if (error) throw error;
    voto = data?.puntuacion ?? null;
  }
  return { promedio: total ? suma / total : 0, total, voto };
}

async function guardar(slug, puntuacion) {
  if (MODO === 'demo') {
    const anterior = datosDemo.get(slug) || { ...demoInicial, voto: null };
    const total = anterior.total + (anterior.voto == null ? 1 : 0);
    const suma = anterior.promedio * anterior.total
      - (anterior.voto ?? 0) + puntuacion;
    datosDemo.set(slug, { promedio: suma / total, total, voto: puntuacion });
    return;
  }
  const usuarioId = await usuarioActual();
  const contenidoId = await obtenerContenido(slug);
  const { error } = await supabase.from('calificaciones').upsert({
    contenido_id: contenidoId,
    usuario_id: usuarioId,
    puntuacion,
    actualizado_en: new Date().toISOString()
  }, { onConflict: 'contenido_id,usuario_id' });
  if (error) throw error;
}

function montar(elemento) {
  const slug = elemento.dataset.contenido;
  if (!slug) return;
  const titulo = elemento.dataset.titulo || (slug === 'revista'
    ? '¿Qué te pareció nuestra revista?' : '¿Qué te pareció este artículo?');
  const subtitulo = elemento.dataset.subtitulo || 'Tu opinión nos ayuda a mejorar';
  elemento.classList.add('calificacion');
  const encabezado = document.createElement('h3');
  encabezado.className = 'calificacion__titulo';
  encabezado.textContent = titulo;
  const descripcion = document.createElement('p');
  descripcion.className = 'calificacion__subtitulo';
  descripcion.textContent = subtitulo;
  const estrellasCont = document.createElement('div');
  estrellasCont.className = 'calificacion__estrellas';
  estrellasCont.setAttribute('role', 'group');
  estrellasCont.setAttribute('aria-label', 'Seleccionar de una a cinco estrellas');
  const seleccion = document.createElement('p');
  seleccion.className = 'calificacion__seleccion';
  const estadistica = document.createElement('p');
  estadistica.className = 'calificacion__estadistica';
  const enviar = document.createElement('button');
  enviar.className = 'calificacion__enviar';
  enviar.type = 'button';
  enviar.textContent = 'Enviar calificación';
  enviar.disabled = true;
  const mensaje = document.createElement('p');
  mensaje.className = 'calificacion__mensaje';
  mensaje.setAttribute('role', 'status');
  elemento.append(encabezado, descripcion, estrellasCont, seleccion, estadistica, enviar, mensaje);

  let valor = 0, ocupado = false, votoAnterior = null;
  const botones = estrellas.map(n => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'calificacion__estrella';
    boton.textContent = '★';
    boton.setAttribute('aria-label', `${n} estrella${n === 1 ? '' : 's'}`);
    boton.addEventListener('click', () => {
      if (ocupado) return;
      valor = n;
      mensaje.textContent = '';
      pintar();
    });
    estrellasCont.appendChild(boton);
    return boton;
  });
  function pintar() {
    botones.forEach((boton, i) => {
      boton.classList.toggle('activa', i < valor);
      boton.setAttribute('aria-pressed', String(i + 1 === valor));
      boton.disabled = ocupado;
    });
    seleccion.textContent = valor
      ? `${valor} de 5 estrellas seleccionadas`
      : 'Selecciona una calificación';
    enviar.disabled = ocupado || !valor || valor === votoAnterior;
    enviar.textContent = votoAnterior == null ? 'Enviar calificación' : 'Actualizar calificación';
  }
  async function refrescar() {
    const datos = await consultar(slug);
    estadistica.textContent = `★ ${datos.total ? datos.promedio.toFixed(1) : '—'} / 5 · ${datos.total} calificación${datos.total === 1 ? '' : 'es'}`;
    votoAnterior = datos.voto ?? null;
    if (votoAnterior != null) valor = votoAnterior;
    pintar();
  }
  enviar.addEventListener('click', async () => {
    if (ocupado || !valor) return;
    ocupado = true;
    pintar();
    mensaje.textContent = 'Guardando...';
    try {
      await guardar(slug, valor);
      await refrescar();
      mensaje.textContent = MODO === 'demo'
        ? 'Calificación registrada en la demostración (no se guardó en Supabase).'
        : '¡Gracias! Tu calificación se guardó correctamente.';
    } catch (error) {
      console.error('Error al calificar:', error);
      mensaje.textContent = 'No se pudo guardar. Revisa la consola y vuelve a intentarlo.';
    } finally {
      ocupado = false;
      pintar();
    }
  });
  pintar();
  refrescar().catch(error => {
    console.error('Error al cargar calificaciones:', error);
    estadistica.textContent = 'No se pudieron cargar las calificaciones.';
  });
}

document.querySelectorAll('[data-contenido]').forEach(montar);
