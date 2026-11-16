// 0.125 -> "1/8", 0.25 -> "1/4", 0.5 -> "1/2"
export function textoCR(cr) {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return String(cr);
}

// La API actual entrega la armadura como lista [{ type, value }]; versiones viejas, como número
export function valorArmadura(armor_class) {
  if (Array.isArray(armor_class)) return armor_class[0]?.value ?? "-";
  return armor_class ?? "-";
}

// Modificador de atributo en D&D: (valor - 10) / 2 redondeado hacia abajo
export function modificador(valor) {
  const mod = Math.floor((valor - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
}