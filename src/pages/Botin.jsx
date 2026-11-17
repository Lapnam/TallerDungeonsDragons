import { useState } from "react";
import Tarjeta from "../components/Tarjeta";
import { generarBotin } from "../services/botin";
import { obtenerNivel, RAREZA } from "../utils/botin";
import "./Botin.css";

const MONEDAS = [
  { clave: "cp", nombre: "Cobre", icono: "🟤" },
  { clave: "sp", nombre: "Plata", icono: "⚪" },
  { clave: "gp", nombre: "Oro", icono: "🟡" },
  { clave: "pp", nombre: "Platino", icono: "🔷" },
];

function estadisticasDe(objeto) {
  if (objeto.magico) {
    return [
      {
        icono: "✨",
        etiqueta: "Rareza",
        valor: RAREZA[objeto.rareza] ?? objeto.rareza,
        clase: `stat--rareza-${objeto.rareza.toLowerCase().replace(" ", "-")}`,
      },
      { icono: "📦", etiqueta: "Tipo", valor: objeto.categoria },
    ];
  }
  return [
    { icono: "💰", etiqueta: "Valor", valor: objeto.valor },
    { icono: "⚖️", etiqueta: "Peso", valor: objeto.peso },
    { icono: "📦", etiqueta: "Tipo", valor: objeto.categoria },
  ];
}

function Botin() {
  const [cr, setCr] = useState(5);
  const [botin, setBotin] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function generar() {
    setCargando(true);
    setError("");
    try {
      const resultado = await generarBotin(cr);
      setBotin(resultado);
    } catch {
      setError("No pudimos conectar con la API. Revisa tu internet e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <section>
      <h1>Generador de botín</h1>
      <p className="subtitulo">Recompensas para tus jugadores.</p>

      <div className="botin__panel">
        <div className="botin__cr">
          <span>Nivel de desafío del monstruo</span>
          <strong>{cr}</strong>
        </div>

        <input
          type="range"
          min="0"
          max="30"
          value={cr}
          onChange={(e) => setCr(Number(e.target.value))}
          disabled={cargando}
        />

        <p className="botin__tipo">{obtenerNivel(cr).nombre}</p>

        <button className="botin__boton" onClick={generar} disabled={cargando}>
          {cargando ? "Abriendo el cofre…" : " Generar botín"}
        </button>
      </div>

      {error && <p className="botin__mensaje botin__mensaje--error">{error}</p>}

      {!botin && !cargando && !error && (
        <p className="botin__mensaje">Elige un nivel y genera el botín.</p>
      )}

      {botin && !error && (
        <div className={cargando ? "botin__resultado botin__resultado--carga" : "botin__resultado"}>
          <h2>Monedas</h2>
          <div className="botin__monedas">
            {MONEDAS.map((m) => (
              <div
                key={m.clave}
                className={`moneda ${botin.monedas[m.clave] === 0 ? "moneda--vacia" : ""}`}
              >
                <span className="moneda__icono">{m.icono}</span>
                <strong>{botin.monedas[m.clave]}</strong>
                <span className="moneda__nombre">{m.nombre}</span>
              </div>
            ))}
          </div>

          <h2>Objetos</h2>
          {botin.objetos.length === 0 ? (
            <p className="botin__mensaje">Esta vez no hubo objetos, solo monedas.</p>
          ) : (
            <div className="botin__objetos">
              {botin.objetos.map((obj) => (
                <Tarjeta
                  key={obj.id}
                  titulo={obj.nombre}
                  imagen={obj.imagen}
                  placeholder={obj.magico ? "✨" : "🎒"}
                  compacta
                  estadisticas={estadisticasDe(obj)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Botin;