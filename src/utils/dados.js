export const TIPOS_DADO = [4, 6, 8, 10, 12, 20, 100];

// Devuelve un número entero entre 1 y "caras" (ambos incluidos)
export function lanzarDado(caras) {
  return Math.floor(Math.random() * caras) + 1;
}

// Lanza "cantidad" dados y devuelve la lista de resultados
export function lanzarVarios(caras, cantidad) {
  return Array.from({ length: cantidad }, () => lanzarDado(caras));
}

// Texto tipo "2d6 +3" o "d20"
export function notacion(cantidad, caras, modificador) {
  const mod = modificador > 0 ? ` +${modificador}` : modificador < 0 ? ` ${modificador}` : "";
  return `${cantidad > 1 ? cantidad : ""}d${caras}${mod}`;
}