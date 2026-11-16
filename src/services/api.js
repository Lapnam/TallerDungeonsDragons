const BASE = "https://www.dnd5eapi.co";

// Lista de monstruos (solo nombres). Si se pasa "cr", la API filtra por nivel de desafío.
export async function getMonstruos(cr = "") {
  const url =
    cr === ""
      ? `${BASE}/api/monsters`
      : `${BASE}/api/monsters?challenge_rating=${cr}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo cargar la lista de monstruos");
  const data = await res.json();
  return data.results;
}

// Detalle completo de un monstruo
export async function getMonstruo(index) {
  const res = await fetch(`${BASE}/api/monsters/${index}`);
  if (!res.ok) throw new Error("No se pudo cargar el monstruo");
  return res.json();
}

// La API entrega la imagen como ruta relativa; la completamos
export function urlImagen(ruta) {
  return ruta ? `${BASE}${ruta}` : null;
}

// Las listas completas se guardan para no pedirlas dos veces
const cacheListas = {};

async function getLista(endpoint) {
  if (!cacheListas[endpoint]) {
    const res = await fetch(`${BASE}/api/${endpoint}`);
    if (!res.ok) throw new Error("No se pudo cargar la lista");
    const data = await res.json();
    cacheListas[endpoint] = data.results;
  }
  return cacheListas[endpoint];
}

export const getListaEquipo = () => getLista("equipment");
export const getListaMagicos = () => getLista("magic-items");

// Detalle de cualquier elemento usando la url que trae la lista
export async function getDetalle(url) {
  const res = await fetch(`${BASE}${url}`);
  if (!res.ok) throw new Error("No se pudo cargar el objeto");
  return res.json();
}