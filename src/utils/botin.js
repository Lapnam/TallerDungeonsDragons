// Número entero al azar entre min y max (ambos incluidos)
export function entre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Elige "cantidad" elementos de una lista sin repetir
export function elegirAlAzar(lista, cantidad) {
  const copia = [...lista];
  const elegidos = [];
  while (elegidos.length < cantidad && copia.length > 0) {
    const i = Math.floor(Math.random() * copia.length);
    elegidos.push(copia.splice(i, 1)[0]);
  }
  return elegidos;
}

// Cada nivel define qué tan generoso es el tesoro
export const NIVELES = [
  {
    nombre: "Tesoro menor",
    desde: 0,
    hasta: 4,
    monedas: { cp: [20, 300], sp: [10, 150], gp: [0, 40], pp: [0, 0] },
    objetos: [0, 2],
    probMagico: 0.1,
    rarezas: ["Common"],
    caro: false,
  },
  {
    nombre: "Tesoro medio",
    desde: 5,
    hasta: 10,
    monedas: { cp: [100, 600], sp: [50, 400], gp: [50, 400], pp: [0, 10] },
    objetos: [1, 3],
    probMagico: 0.3,
    rarezas: ["Common", "Uncommon"],
    caro: false,
  },
  {
    nombre: "Tesoro mayor",
    desde: 11,
    hasta: 16,
    monedas: { cp: [0, 200], sp: [100, 500], gp: [500, 3000], pp: [10, 100] },
    objetos: [2, 4],
    probMagico: 0.5,
    rarezas: ["Uncommon", "Rare", "Very Rare"],
    caro: true,
  },
  {
    nombre: "Tesoro legendario",
    desde: 17,
    hasta: 30,
    monedas: { cp: [0, 0], sp: [0, 0], gp: [3000, 12000], pp: [100, 800] },
    objetos: [3, 5],
    probMagico: 0.7,
    rarezas: ["Rare", "Very Rare", "Legendary"],
    caro: true,
  },
];

export function obtenerNivel(cr) {
  return NIVELES.find((n) => cr >= n.desde && cr <= n.hasta);
}

// Monedas: el rango lo da el nivel y el CR lo ajusta (de 60% a 140%)
export function generarMonedas(cr) {
  const nivel = obtenerNivel(cr);
  const progreso = (cr - nivel.desde) / (nivel.hasta - nivel.desde);
  const factor = 0.6 + progreso * 0.8;

  const monedas = {};
  for (const [tipo, [min, max]] of Object.entries(nivel.monedas)) {
    monedas[tipo] = Math.round(entre(min, max) * factor);
  }
  return monedas;
}

export const RAREZA = {
  Common: "Común",
  Uncommon: "Poco común",
  Rare: "Raro",
  "Very Rare": "Muy raro",
  Legendary: "Legendario",
  Artifact: "Artefacto",
  Varies: "Variable",
};