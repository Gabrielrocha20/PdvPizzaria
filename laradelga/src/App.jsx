import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Balcao from "./pages/balcao";
import PainelCadastro from "./pages/painelCadastro";
import CadastroProdutos from "./pages/produtos";
import CadastroCategoria from "./pages/categorias";
import CadastroSabor from "./pages/sabores";
import CadastroPromocao from "./pages/promocoes";
import CadastroClientes from "./pages/clientes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/balcao" element={<Balcao />} />
        <Route path="/painel" element={<PainelCadastro />} />
        <Route path="/produtos" element={<CadastroProdutos />} />
        <Route path="/categorias" element={<CadastroCategoria />} />
        <Route path="/sabores" element={<CadastroSabor />} />
        <Route path="/promocoes" element={<CadastroPromocao />} />
        <Route path="/clientes" element={<CadastroClientes />} />
      </Routes>
    </Router>
  );
}

export default App;
