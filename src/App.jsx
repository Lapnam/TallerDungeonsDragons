import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dados from "./pages/Dados";
import Bestiario from "./pages/Bestiario";
import Botin from "./pages/Botin";
import "./App.css";

function App() {
  const [seccion, setSeccion] = useState("dados");

  return (
    <div className="app">
      <Sidebar activa={seccion} onCambiar={setSeccion} />

      <main className="contenido">
        {seccion === "dados" && <Dados />}
        {seccion === "bestiario" && <Bestiario />}
        {seccion === "botin" && <Botin />}
      </main>
    </div>
  );
}

export default App;