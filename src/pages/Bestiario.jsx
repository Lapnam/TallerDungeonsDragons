import { useState, useEffect } from "react";
import Tarjeta from "../components/Tarjeta";
import { getMonstruos, getMonstruo, urlImagen } from "../services/api";
import { textoCR, valorArmadura, modificador } from "../utils/formato";
import "./Bestiario.css";

const POR_PAGINA = 12;

const OPCIONES_CR = [
  { valor: "", texto: "Todos los niveles" },
  { valor: "0", texto: "CR 0" },
  { valor: "0.125", texto: "CR 1/8" },
  { valor: "0.25", texto: "CR 1/4" },
  { valor: "0.5", texto: "CR 1/2" },
  ...Array.from({ length: 20 }, (_, i) => ({
    valor: String(i + 1),
    texto: `CR ${i + 1}`,
  })),
];

const ATRIBUTOS = [
  ["FUE", "strength"],
  ["DES", "dexterity"],
  ["CON", "constitution"],
  ["INT", "intelligence"],
  ["SAB", "wisdom"],
  ["CAR", "charisma"],
];

function Bestiario() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cr, setCr] = useState("");
  const [pagina, setPagina] = useState(1);
  const [detalles, setDetalles] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  // 1. Cargar la lista (se repite cuando cambia el filtro de CR)
  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError("");

    getMonstruos(cr)
      .then((datos) => {
        if (!activo) return;
        setLista(datos);
        setPagina(1);
      })
      .catch(() => {
        if (activo) setError("No pudimos conectar con la API. Revisa tu internet e intenta de nuevo.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [cr]);

  // 2. Filtrar por nombre y cortar la página actual
  const filtrados = lista.filter((m) =>
    m.name.toLowerCase().includes(busqueda.toLowerCase())
  );
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const visibles = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const clave = visibles.map((m) => m.index).join(",");

  // 3. Pedir el detalle solo de los monstruos visibles que aún no tenemos
  useEffect(() => {
    const faltan = visibles.filter((m) => !detalles[m.index]);
    if (faltan.length === 0) return;

    let activo = true;
    Promise.all(faltan.map((m) => getMonstruo(m.index).catch(() => null))).then(
      (resultados) => {
        if (!activo) return;
        setDetalles((previo) => {
          const nuevo = { ...previo };
          resultados.forEach((d) => {
            if (d) nuevo[d.index] = d;
          });
          return nuevo;
        });
      }
    );

    return () => {
      activo = false;
    };
  }, [clave]);

  function cambiarBusqueda(e) {
    setBusqueda(e.target.value);
    setPagina(1);
  }

  return (
    <section>
      <h1>Bestiario</h1>
      <p className="subtitulo">Consulta a los enemigos de tu partida.</p>

      <div className="bestiario__controles">
        <input
          type="search"
          placeholder="🔍 Buscar monstruo..."
          value={busqueda}
          onChange={cambiarBusqueda}
        />
        <select value={cr} onChange={(e) => setCr(e.target.value)}>
          {OPCIONES_CR.map((op) => (
            <option key={op.valor} value={op.valor}>
              {op.texto}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p className="bestiario__mensaje">Invocando monstruos…</p>}
      {error && <p className="bestiario__mensaje bestiario__mensaje--error">{error}</p>}

      {!cargando && !error && filtrados.length === 0 && (
        <p className="bestiario__mensaje">No se encontró ningún monstruo.</p>
      )}

      {!cargando && !error && (
        <div className="bestiario__grid">
          {visibles.map((m) => {
            const d = detalles[m.index];
            return (
              <Tarjeta
                key={m.index}
                titulo={m.name}
                imagen={d ? urlImagen(d.image) : null}
                cargando={!d}
                onClick={d ? () => setSeleccionado(d) : undefined}
                estadisticas={[
                  {  etiqueta: " Armadura", valor: d ? valorArmadura(d.armor_class) : "" },
                  {  etiqueta: " Puntos de golpe", valor: d?.hit_points, clase: "stat--vida" },
                  {  etiqueta: " Desafío", valor: d ? textoCR(d.challenge_rating) : "", clase: "stat--desafio" },
                ]}
              />
            );
          })}
        </div>
      )}

      {!cargando && !error && filtrados.length > POR_PAGINA && (
        <div className="bestiario__paginacion">
          <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
            ← Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas}>
            Siguiente →
          </button>
        </div>
      )}

      {/* Detalle del monstruo */}
      {seleccionado && (
        <div className="modal" onClick={() => setSeleccionado(null)}>
          <div className="modal__caja" onClick={(e) => e.stopPropagation()}>
            <button className="modal__cerrar" onClick={() => setSeleccionado(null)}>
              ✕
            </button>

            <h2>{seleccionado.name}</h2>
            <p className="modal__tipo">
              {seleccionado.size} · {seleccionado.type} · {seleccionado.alignment}
            </p>

            {seleccionado.image && (
              <img className="modal__imagen" src={urlImagen(seleccionado.image)} alt={seleccionado.name} />
            )}

            <div className="modal__atributos">
              {ATRIBUTOS.map(([sigla, clave]) => (
                <div key={sigla} className="atributo">
                  <span className="atributo__sigla">{sigla}</span>
                  <strong>{seleccionado[clave]}</strong>
                  <span className="atributo__mod">{modificador(seleccionado[clave])}</span>
                </div>
              ))}
            </div>

            <p className="modal__linea">
              <strong>Velocidad:</strong>{" "}
              {Object.entries(seleccionado.speed || {})
                .map(([tipo, valor]) => `${tipo} ${valor}`)
                .join(", ")}
            </p>
            <p className="modal__linea">
              <strong>Experiencia:</strong> {seleccionado.xp} XP
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Bestiario;