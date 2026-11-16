const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const FORMAS_DADO = {
  4: ["M12 3L21 19H3Z", "M12 3L15 19"],
  6: ["M5 5H19V19H5Z", "M5 5L19 19", "M19 5L5 19"],
  8: ["M12 2L21 12L12 22L3 12Z", "M12 2V22", "M3 12H21"],
  10: [
    "M12 2L21 9L18 20H6L3 9Z",
    "M12 2V11",
    "M12 11L3 9",
    "M12 11L21 9",
    "M12 11L6 20",
    "M12 11L18 20",
  ],
  12: [
    "M12 2L21 8.5L17.5 20H6.5L3 8.5Z",
    "M12 8L16 11L14.5 16H9.5L8 11Z",
    "M12 2V8",
    "M21 8.5L16 11",
    "M17.5 20L14.5 16",
    "M6.5 20L9.5 16",
    "M3 8.5L8 11",
  ],
  20: [
    "M12 2L20.5 7V17L12 22L3.5 17V7Z",
    "M12 7L17 16H7Z",
    "M12 2V7",
    "M3.5 7L7 16",
    "M20.5 7L17 16",
    "M12 22L7 16",
    "M12 22L17 16",
  ],
  100: ["M12 2L20.5 7V17L12 22L3.5 17V7Z", "M12 8L16 10V14L12 16L8 14V10Z"],
};

export function IconoDado({ caras, className = "" }) {
  const trazos = FORMAS_DADO[caras] ?? FORMAS_DADO[20];
  return (
    <svg {...base} className={`icono-dado ${className}`} aria-hidden="true">
      {trazos.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function crearIcono(trazos) {
  return function Icono({ className = "" }) {
    return (
      <svg {...base} className={`icono ${className}`} aria-hidden="true">
        {trazos.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    );
  };
}

export const IconoCubo = crearIcono([
  "M12 2L21 7V17L12 22L3 17V7Z",
  "M3 7L12 12L21 7",
  "M12 12V22",
]);

export const IconoLibro = crearIcono([
  "M3 5C6 4 9 4.5 12 6.5C15 4.5 18 4 21 5V19C18 18 15 18.5 12 20.5C9 18.5 6 18 3 19Z",
  "M12 6.5V20.5",
]);

export const IconoCuadricula = crearIcono([
  "M5 4H19A1 1 0 0 1 20 5V19A1 1 0 0 1 19 20H5A1 1 0 0 1 4 19V5A1 1 0 0 1 5 4Z",
  "M4 12H20",
  "M12 4V20",
]);