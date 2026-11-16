import "./Contador.css";

function Contador({ etiqueta, valor, min, max, onCambiar, formato = String, deshabilitado }) {
  return (
    <div className="contador">
      <span className="contador__etiqueta">{etiqueta}</span>
      <button
        type="button"
        aria-label={`Disminuir ${etiqueta}`}
        onClick={() => onCambiar(Math.max(min, valor - 1))}
        disabled={deshabilitado || valor <= min}
      >
        −
      </button>
      <strong>{formato(valor)}</strong>
      <button
        type="button"
        aria-label={`Aumentar ${etiqueta}`}
        onClick={() => onCambiar(Math.min(max, valor + 1))}
        disabled={deshabilitado || valor >= max}
      >
        +
      </button>
    </div>
  );
}

export default Contador;