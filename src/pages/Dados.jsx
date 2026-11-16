import { useState, useRef, useEffect } from "react";
import EncabezadoPagina from "../components/EncabezadoPagina";
import Contador from "../components/Contador";
import { IconoDado } from "../components/Iconos";
import { TIPOS_DADO, lanzarDado, lanzarVarios, notacion } from "../utils/dados";
import "./Dados.css";

// Crítico y pifia solo cuentan con un único d20 (el "natural")
function tipoDeTirada(t) {
  if (t.caras === 20 && t.cantidad === 1) {
    if (t.tiradas[0] === 20) return "critico";
    if (t.tiradas[0] === 1) return "pifia";
  }
  return "normal";
}

function Dados() {
  const [caras, setCaras] = useState(20);
  const [cantidad, setCantidad] = useState(1);
  const [modificador, setModificador] = useState(0);
  const [tirada, setTirada] = useState(null);
  const [lanzando, setLanzando] = useState(false);
  const [numeroGirando, setNumeroGirando] = useState(1);
  const [historial, setHistorial] = useState([]);
  const intervalo = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalo.current);
  }, []);

  function lanzar() {
    if (lanzando) return;
    setLanzando(true);

    let vueltas = 0;
    intervalo.current = setInterval(() => {
      vueltas++;

      if (vueltas < 10) {
        setNumeroGirando(lanzarDado(caras)); // solo efecto visual
      } else {
        clearInterval(intervalo.current);

        const tiradas = lanzarVarios(caras, cantidad);
        const total = tiradas.reduce((suma, n) => suma + n, 0) + modificador;
        const nueva = { id: Date.now(), caras, cantidad, modificador, tiradas, total };

        setTirada(nueva);
        setHistorial((anterior) => [nueva, ...anterior].slice(0, 5));
        setLanzando(false);
      }
    }, 60);
  }

  const tipo = tirada && !lanzando ? tipoDeTirada(tirada) : "normal";
  const hayResultado = tirada && !lanzando;

  let titulo = "Todo comienza con una tirada";
  let subtitulo = "Selecciona un dado y desafía al destino";
  let eyebrow = "Tu aventura empieza aquí";

  if (hayResultado) {
    eyebrow = "El destino ha hablado";
    const detalle = notacion(tirada.cantidad, tirada.caras, tirada.modificador);

    if (tipo === "critico") {
      titulo = "¡20 natural!";
      subtitulo = `${detalle} · Éxito crítico`;
    } else if (tipo === "pifia") {
      titulo = "¡Pifia!";
      subtitulo = `${detalle} · Fallo crítico`;
    } else {
      titulo = "La suerte está echada";
      subtitulo =
        tirada.cantidad > 1
          ? `${detalle} · ${tirada.tiradas.join(" + ")}${
              tirada.modificador ? ` (${tirada.modificador > 0 ? "+" : ""}${tirada.modificador})` : ""
            }`
          : detalle;
    }
  }

  let centro = "—";
  if (lanzando) centro = numeroGirando;
  else if (tirada) centro = tirada.total;

  return (
    <section>
      <EncabezadoPagina
        titulo="Lanzamiento de dados"
        subtitulo="Que el destino decida tu próxima aventura."
      />

      <div className="dados__selector">
        {TIPOS_DADO.map((tipoDado) => (
          <button
            key={tipoDado}
            className={`dado-boton ${caras === tipoDado ? "dado-boton--activo" : ""}`}
            onClick={() => setCaras(tipoDado)}
            disabled={lanzando}
          >
            <IconoDado caras={tipoDado} />
            <span>d{tipoDado}</span>
          </button>
        ))}
      </div>

      <div className={`mesa mesa--${tipo}`}>
        <p className="mesa__eyebrow">{eyebrow}</p>

        <div className={`mesa__dado ${lanzando ? "mesa__dado--girando" : ""}`}>
          <span className="mesa__anillo mesa__anillo--1" />
          <span className="mesa__anillo mesa__anillo--2" />
          <IconoDado caras={caras} className="mesa__icono" />
          <span className="mesa__numero">{centro}</span>
        </div>

        <h2 className="mesa__titulo">{titulo}</h2>
        <p className="mesa__sub">{subtitulo}</p>

        <div className="mesa__controles">
          <Contador
            etiqueta="Cantidad"
            valor={cantidad}
            min={1}
            max={10}
            onCambiar={setCantidad}
            deshabilitado={lanzando}
          />
          <Contador
            etiqueta="Modificador"
            valor={modificador}
            min={-20}
            max={20}
            onCambiar={setModificador}
            formato={(v) => (v >= 0 ? `+${v}` : String(v))}
            deshabilitado={lanzando}
          />
        </div>

        <button className="boton-lanzar" onClick={lanzar} disabled={lanzando}>
          {lanzando ? "Lanzando…" : tirada ? "Volver a lanzar" : "Lanzar dado"}
        </button>
      </div>

      <div className="historial__cabecera">
        <h2>Historial de lanzamientos</h2>
        <span>Últimas 5 tiradas</span>
      </div>

      <div className="historial__fila">
        {Array.from({ length: 5 }).map((_, i) => {
          const t = historial[i];
          if (!t) {
            return (
              <div key={i} className="ficha ficha--vacia">
                —
              </div>
            );
          }
          const tipoFicha = tipoDeTirada(t);
          return (
            <div key={t.id} className={`ficha ficha--${tipoFicha}`}>
              <strong>{t.total}</strong>
              <small>{notacion(t.cantidad, t.caras, t.modificador)}</small>
              {tipoFicha !== "normal" && (
                <em>{tipoFicha === "critico" ? "Crítico" : "Pifia"}</em>
              )}
            </div>
          );
        })}
      </div>

      <p className="historial__pie">Sin límites de tiradas. Solo tú, los dados y la historia.</p>
    </section>
  );
}

export default Dados;