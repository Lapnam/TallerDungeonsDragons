const BASE = "https://www.dnd5eapi.co";

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


export async function getMonstruo(index) {
  const res = await fetch(`${BASE}/api/monsters/${index}`);
  if (!res.ok) throw new Error("No se pudo cargar el monstruo");
  return res.json();
}


export function urlImagen(ruta) {
  return ruta ? `${BASE}${ruta}` : null;
}


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


export async function getDetalle(url) {
  const res = await fetch(`${BASE}${url}`);
  if (!res.ok) throw new Error("No se pudo cargar el objeto");
  return res.json();
}