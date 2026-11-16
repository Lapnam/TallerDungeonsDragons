import { IconoCubo, IconoLibro, IconoCuadricula, IconoDado } from "./Iconos";
import "./Sidebar.css";

const SECCIONES = [
  { id: "dados", nombre: "Dados", Icono: IconoCubo },
  { id: "bestiario", nombre: "Bestiario", Icono: IconoLibro },
  { id: "botin", nombre: "Botín", Icono: IconoCuadricula },
];

function Sidebar({ activa, onCambiar }) {
  return (
    <nav className="sidebar">
      <div className="sidebar__logo">
        <img className="sidebar__logo-img" src="public/silueta.png" alt="" />
        <div>
          <span className="sidebar__logo-texto">DM Toolkit</span>
          <span className="sidebar__logo-lema">El arte del master</span>
        </div>
      </div>

      <p className="sidebar__etiqueta">Tu mesa de juego</p>

      <ul className="sidebar__lista">
        {SECCIONES.map(({ id, nombre, Icono }) => (
          <li key={id}>
            <button
              className={`sidebar__boton ${activa === id ? "sidebar__boton--activo" : ""}`}
              onClick={() => onCambiar(id)}
            >
              <Icono className="sidebar__icono" />
              <span>{nombre}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar__pie">
        <div className="sidebar__d20">
          <IconoDado caras={20} />
          <span>d20</span>
        </div>
        <p className="sidebar__frase">
          Cada tirada,
          <br />
          una nueva historia
        </p>
        <small>{"D&D 5e · SRD 5.1"}</small>
      </div>
    </nav>
  );
}

export default Sidebar;