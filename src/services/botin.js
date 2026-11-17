import { getListaEquipo, getListaMagicos, getDetalle, urlImagen } from "./api";
import { entre, elegirAlAzar, obtenerNivel, generarMonedas } from "../utils/botin";

const VALOR_EN_ORO = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 };

function valorEnOro(detalle) {
  if (!detalle.cost) return 0;
  return detalle.cost.quantity * (VALOR_EN_ORO[detalle.cost.unit] ?? 0);
}


async function elegirEquipo(cantidad, caro) {
  if (cantidad === 0) return [];

  const lista = await getListaEquipo();
  const candidatos = elegirAlAzar(lista, cantidad * 4);
  const detalles = await Promise.all(
    candidatos.map((c) => getDetalle(c.url).catch(() => null))
  );

  const validos = detalles.filter(Boolean);
  if (caro) validos.sort((a, b) => valorEnOro(b) - valorEnOro(a));

  return validos.slice(0, cantidad).map((d) => ({
    id: d.index,
    magico: false,
    nombre: d.name,
    categoria: d.equipment_category?.name ?? "Equipo",
    valor: d.cost ? `${d.cost.quantity} ${d.cost.unit}` : "—",
    peso: d.weight ? `${d.weight} lb` : "—",
    imagen: null,
  }));
}


async function elegirMagicos(cantidad, rarezas) {
  if (cantidad === 0) return [];

  const lista = await getListaMagicos();
  const usados = new Set();
  const buenos = [];

  for (let ronda = 0; ronda < 3 && buenos.length < cantidad; ronda++) {
    const candidatos = elegirAlAzar(
      lista.filter((m) => !usados.has(m.index)),
      10
    );
    candidatos.forEach((c) => usados.add(c.index));

    const detalles = await Promise.all(
      candidatos.map((c) => getDetalle(c.url).catch(() => null))
    );

    detalles.forEach((d) => {
      if (d && rarezas.includes(d.rarity?.name) && buenos.length < cantidad) {
        buenos.push(d);
      }
    });
  }

  return buenos.map((d) => ({
    id: d.index,
    magico: true,
    nombre: d.name,
    categoria: d.equipment_category?.name ?? "Objeto mágico",
    rareza: d.rarity.name,
    imagen: urlImagen(d.image),
  }));
}

export async function generarBotin(cr) {
  const nivel = obtenerNivel(cr);

  const total = entre(nivel.objetos[0], nivel.objetos[1]);
  let magicos = 0;
  for (let i = 0; i < total; i++) {
    if (Math.random() < nivel.probMagico) magicos++;
  }

  const [equipo, objetosMagicos] = await Promise.all([
    elegirEquipo(total - magicos, nivel.caro),
    elegirMagicos(magicos, nivel.rarezas),
  ]);

  return {
    cr,
    nivel: nivel.nombre,
    monedas: generarMonedas(cr),
    objetos: [...objetosMagicos, ...equipo],
  };
}