import React, { useState, useEffect } from "react";
import SidebarMenu from "../components/menuPainel";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Message from "../components/Message";
import { useCliente } from "../hook/useCliente";
import { FaEye, FaTrash, FaPencilAlt } from "react-icons/fa"; // Import dos ícones

export default function CadastroClientes() {
  const {
    clientes,
    loading_cliente,
    erro_cliente,
    criaCliente,
    editaCliente,
    deletaCliente,
    buscaPedidosCliente,
  } = useCliente();

  const [filteredClientes, setFilteredClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPedidosOpen, setModalPedidosOpen] = useState(false);

  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [enderecoCliente, setEnderecoCliente] = useState("");
  const [taxaEntrega, setTaxaEntrega] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [totalGasto, setTotalGasto] = useState(0);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const clientesPerPage = 6;

  useEffect(() => setFilteredClientes(clientes), [clientes]);

  const handleSearch = (query) => {
    if (!query) setFilteredClientes(clientes);
    else
      setFilteredClientes(
        clientes.filter((c) =>
          c.nome.toLowerCase().includes(query.toLowerCase())
        )
      );
    setCurrentPage(1);
  };

  const handleEditar = (c) => {
    setNomeCliente(c.nome);
    setTelefoneCliente(c.telefone);
    setEnderecoCliente(c.endereco);
    setTaxaEntrega(c.taxaEntrega);
    setEditandoId(c.id);
    setModalOpen(true);
  };

  const handleSalvar = async () => {
    if (!nomeCliente || !telefoneCliente || !enderecoCliente || !taxaEntrega) {
      setMensagem({ type: "error", message: "Preencha todos os campos!" });
      return;
    }

    try {
      const formData = {
        nome: nomeCliente,
        telefone: telefoneCliente,
        endereco: enderecoCliente,
        taxaEntrega: parseFloat(taxaEntrega).toFixed(2),
      };

      if (editandoId) {
        await editaCliente(editandoId, formData);
        setMensagem({ type: "success", message: "Cliente atualizado com sucesso!" });
      } else {
        await criaCliente(formData);
        setMensagem({ type: "success", message: "Cliente cadastrado com sucesso!" });
      }

      setNomeCliente("");
      setTelefoneCliente("");
      setEnderecoCliente("");
      setTaxaEntrega("");
      setEditandoId(null);
      setModalOpen(false);
    } catch (err) {
      setMensagem({ type: "error", message: err.message || "Erro ao salvar cliente" });
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await deletaCliente(id);
      setMensagem({ type: "success", message: "Cliente excluído com sucesso!" });
    } catch (err) {
      setMensagem({ type: "error", message: err.message || "Erro ao excluir cliente" });
    }
  };

  const handleVerPedidos = async (clienteId) => {
    try {
      const resultado = await buscaPedidosCliente(clienteId);
      console.log("Resultado do IPC:", resultado);

      // Extrai o array de pedidos
      const pedidosArray = resultado?.pedidos ?? [];

      setPedidosCliente(pedidosArray);

      // Calcula total com base no array de pedidos
      const total = pedidosArray.reduce((acc, p) => acc + parseFloat(p.total || 0), 0);
      setTotalGasto(total.toFixed(2));

      setModalPedidosOpen(true);
    } catch (err) {
      setMensagem({ type: "error", message: err.message || "Erro ao buscar pedidos" });
    }
  };

  const indexOfLast = currentPage * clientesPerPage;
  const indexOfFirst = indexOfLast - clientesPerPage;
  const currentClientes = filteredClientes.slice(indexOfFirst, indexOfLast);

  return (
    <div style={styles.container}>
      <SidebarMenu />
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1>Clientes</h1>
          <button style={styles.novoButton} onClick={() => setModalOpen(true)}>
            + Novo Cliente
          </button>
        </div>

        <SearchBar onSearch={handleSearch} placeholder="Pesquisar cliente..." />

        <div style={styles.clientesList}>
          {loading_cliente ? (
            <p>Carregando...</p>
          ) : currentClientes.length === 0 ? (
            <p>Nenhum cliente encontrado.</p>
          ) : (
            currentClientes.map((c) => (
              <div key={c.id} style={styles.clienteCard}>
                <div style={styles.iconContainer}>
                  <FaPencilAlt
                    style={styles.icon}
                    title="Editar"
                    onClick={() => handleEditar(c)}
                  />
                  <FaTrash
                    style={styles.icon}
                    title="Excluir"
                    onClick={() => handleExcluir(c.id)}
                  />
                  <FaEye
                    style={styles.icon}
                    title="Ver Pedidos"
                    onClick={() => handleVerPedidos(c.id)}
                  />
                </div>
                <h3>{c.nome}</h3>
                <p>Telefone: {c.telefone}</p>
                <p>Endereço: {c.endereco}</p>
                <p>Taxa de Entrega: R$ {c.taxaEntrega}</p>
              </div>
            ))
          )}
        </div>

        {Math.ceil(filteredClientes.length / clientesPerPage) > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredClientes.length / clientesPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modal de cadastro/edição */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{editandoId ? "Editar Cliente" : "Novo Cliente"}</h2>
            <div style={styles.form}>
              <label>
                Nome:
                <input
                  type="text"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label>
                Telefone:
                <input
                  type="text"
                  value={telefoneCliente}
                  onChange={(e) => setTelefoneCliente(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label>
                Endereço:
                <input
                  type="text"
                  value={enderecoCliente}
                  onChange={(e) => setEnderecoCliente(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label>
                Taxa de Entrega (R$):
                <input
                  type="number"
                  value={taxaEntrega}
                  onChange={(e) => setTaxaEntrega(e.target.value)}
                  style={styles.input}
                />
              </label>
              <div style={styles.modalActions}>
                <button onClick={handleSalvar} style={styles.submitButton}>
                  {editandoId ? "Salvar" : "Cadastrar"}
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setEditandoId(null);
                    setNomeCliente("");
                    setTelefoneCliente("");
                    setEnderecoCliente("");
                    setTaxaEntrega("");
                  }}
                  style={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de pedidos */}
      {modalPedidosOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Pedidos do Cliente</h2>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "1rem" }}>
              {pedidosCliente.length === 0 ? (
                <p>Não há pedidos para este cliente.</p>
              ) : (
                pedidosCliente.map((p) => (
                  <div key={p.id} style={{ marginBottom: "0.5rem" }}>
                    <p>Pedido #{p.id} - R$ {p.total}</p>
                    <p>Data: {new Date(p.data).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
            <h3>Total Gasto: R$ {totalGasto}</h3>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button
                onClick={() => setModalPedidosOpen(false)}
                style={styles.cancelButton}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {mensagem && (
        <Message
          type={mensagem.type}
          message={mensagem.message}
          onClose={() => setMensagem(null)}
        />
      )}

      {erro_cliente && <p style={{ color: "red" }}>{erro_cliente.message}</p>}
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", backgroundColor: "#111827", color: "white", width: "1004px" },
  mainContent: { flex: 1, padding: "2rem", display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  novoButton: { padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#3B82F6", color: "white", cursor: "pointer", fontWeight: "bold" },
  clientesList: { marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" },
  clienteCard: { backgroundColor: "#1F2937", padding: "1rem", borderRadius: "0.5rem", position: "relative" },
  iconContainer: { position: "absolute", top: "0.5rem", right: "0.5rem", display: "flex", gap: "0.5rem" },
  icon: { cursor: "pointer", color: "white", fontSize: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", marginTop: "1rem" },
  input: { padding: "0.5rem", borderRadius: "0.25rem", border: "none", marginTop: "0.25rem", width: "100%" },
  submitButton: { padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#10B981", color: "white", cursor: "pointer", fontWeight: "bold" },
  cancelButton: { padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#6B7280", color: "white", cursor: "pointer", fontWeight: "bold" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#1F2937", padding: "2rem", borderRadius: "0.75rem", width: "400px" },
  modalActions: { display: "flex", justifyContent: "space-between", marginTop: "1rem" },
};
