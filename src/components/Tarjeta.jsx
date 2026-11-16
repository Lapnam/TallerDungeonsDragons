function Tarjeta({
  titulo,
  imagen,
  placeholder = "🐉",
  estadisticas = [],
  cargando = false,
  compacta = false,
  onClick,
}) {
  return (
    <article
      className={`tarjeta ${onClick ? "tarjeta--click" : ""} ${
        compacta ? "tarjeta--compacta" : ""
      }`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="tarjeta__imagen">
        {imagen ? (
          <img src={imagen} alt={titulo} loading="lazy" />
        ) : (
          <span>{placeholder}</span>
        )}
      </div>

      <h3 className="tarjeta__titulo">{titulo}</h3>

      <ul className="tarjeta__stats">
        {estadisticas.map((est) => (
          <li key={est.etiqueta} className={`stat ${est.clase || ""}`}>
            <span className="stat__icono">{est.icono}</span>
            <span className="stat__valor">{cargando ? "…" : est.valor}</span>
            <span className="stat__etiqueta">{est.etiqueta}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default Tarjeta;