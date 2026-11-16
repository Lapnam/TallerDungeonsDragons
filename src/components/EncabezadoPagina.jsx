import "./EncabezadoPagina.css";

function EncabezadoPagina({ titulo, subtitulo }) {
  return (
    <header className="encabezado">
      <div className="encabezado__barra">
        <span className="encabezado__eyebrow">Grimorio del master</span>
        <span className="encabezado__edicion">Dungeons &amp; Dragons | 5ª edición</span>
      </div>
      <h1>{titulo}</h1>
      <p className="encabezado__subtitulo">{subtitulo}</p>
    </header>
  );
}

export default EncabezadoPagina;