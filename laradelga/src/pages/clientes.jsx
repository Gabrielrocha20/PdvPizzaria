import React, { useState, useEffect } from "react";
import SidebarMenu from "../components/menuPainel";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Message from "../components/Message";
import { useCliente } from "../hook/useCliente";
import { Scrollbars } from 'react-custom-scrollbars-2';
import { FaUtensils, FaPlus, FaEdit, FaTrash, FaTimes, FaUsers, FaEye, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";

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
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

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

      resetForm();
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

  const handleVerPedidos = async (cliente) => {
    try {
      setClienteSelecionado(cliente);
      const resultado = await buscaPedidosCliente(cliente.id);
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

  const resetForm = () => {
    setNomeCliente("");
    setTelefoneCliente("");
    setEnderecoCliente("");
    setTaxaEntrega("");
    setEditandoId(null);
    setModalOpen(false);
  };

  const indexOfLast = currentPage * clientesPerPage;
  const indexOfFirst = indexOfLast - clientesPerPage;
  const currentClientes = filteredClientes.slice(indexOfFirst, indexOfLast);

  return (
    <div style={styles.container}>
      {/* Main Content */}
      <div style={styles.mainContent}>
        <SidebarMenu />

        {/* Right Content */}
        <div style={styles.rightContent}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>Clientes</h1>
              <p style={styles.pageSubtitle}>Gerencie os clientes do sistema</p>
            </div>
            <button
              style={styles.novoButton}
              onClick={() => setModalOpen(true)}
            >
              <FaPlus style={styles.buttonIcon} />
              Novo Cliente
            </button>
          </div>

          {/* Filtros */}
          <div style={styles.filtersContainer}>
            <SearchBar onSearch={handleSearch} placeholder="Pesquisar cliente..." />
          </div>

          {/* Lista de clientes */}
          <div style={styles.contentArea}>
            {loading_cliente ? (
              <div style={styles.loadingState}>
                <p style={styles.loadingText}>Carregando clientes...</p>
              </div>
            ) : currentClientes.length === 0 ? (
              <div style={styles.emptyState}>
                <FaUsers style={styles.emptyIcon} />
                <p style={styles.emptyText}>Nenhum cliente encontrado.</p>
              </div>
            ) : (
              <div style={styles.clientesList}>
                {currentClientes.map((c) => (
                  <div key={c.id} style={styles.clienteCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardLeft}>
                        <div style={styles.cardIcon}>
                          <FaUsers />
                        </div>
                        <div style={styles.cardInfo}>
                          <h3 style={styles.cardTitle}>{c.nome}</h3>
                          <p style={styles.cardSubtitle}>{c.telefone}</p>
                        </div>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          style={styles.iconButton}
                          onClick={() => handleEditar(c)}
                          title="Editar cliente"
                        >
                          <FaEdit />
                        </button>
                        <button
                          style={styles.iconButtonView}
                          onClick={() => handleVerPedidos(c)}
                          title="Ver pedidos"
                        >
                          <FaEye />
                        </button>
                        <button
                          style={styles.iconButtonDelete}
                          onClick={() => handleExcluir(c.id)}
                          title="Excluir cliente"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div style={styles.cardContent}>
                      <div style={styles.clienteInfo}>
                        <p style={styles.clienteInfoItem}>
                          <strong>Endereço:</strong> {c.endereco}
                        </p>
                        <p style={styles.clienteInfoItem}>
                          <strong>Taxa de Entrega:</strong> R$ {c.taxaEntrega}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {Math.ceil(filteredClientes.length / clientesPerPage) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredClientes.length / clientesPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editandoId ? "Editar Cliente" : "Novo Cliente"}
              </h2>
              <button style={styles.modalCloseButton} onClick={resetForm}>
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              <Scrollbars style={styles.modalScrollbars} autoHide>
                <div style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Nome:</label>
                    <input
                      type="text"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      style={styles.formInput}
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Telefone:</label>
                    <input
                      type="text"
                      value={telefoneCliente}
                      onChange={(e) => setTelefoneCliente(e.target.value)}
                      style={styles.formInput}
                      placeholder="Telefone do cliente"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Endereço:</label>
                    <input
                      type="text"
                      value={enderecoCliente}
                      onChange={(e) => setEnderecoCliente(e.target.value)}
                      style={styles.formInput}
                      placeholder="Endereço do cliente"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Taxa de Entrega (R$):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={taxaEntrega}
                      onChange={(e) => setTaxaEntrega(e.target.value)}
                      style={styles.formInput}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </Scrollbars>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={resetForm} style={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleSalvar} style={styles.submitButton}>
                {editandoId ? "Salvar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de pedidos melhorado */}
      {modalPedidosOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContentLarge}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Pedidos do Cliente</h2>
              <button
                style={styles.modalCloseButton}
                onClick={() => setModalPedidosOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              {/* Informações do Cliente */}
              {clienteSelecionado && (
                <div style={styles.clienteInfoHeader}>
                  <div style={styles.clienteInfoIcon}>
                    <FaUsers />
                  </div>
                  <div style={styles.clienteInfoDetails}>
                    <h3 style={styles.clienteInfoName}>{clienteSelecionado.nome}</h3>
                    <p style={styles.clienteInfoPhone}>{clienteSelecionado.telefone}</p>
                    <p style={styles.clienteInfoAddress}>{clienteSelecionado.endereco}</p>
                  </div>
                </div>
              )}

              {/* Resumo */}
              <div style={styles.pedidosResumo}>
                <div style={styles.resumoItem}>
                  <div style={styles.resumoIcon}>
                    <FaShoppingCart />
                  </div>
                  <div style={styles.resumoInfo}>
                    <span style={styles.resumoLabel}>Total de Pedidos</span>
                    <span style={styles.resumoValue}>{pedidosCliente.length}</span>
                  </div>
                </div>
                <div style={styles.resumoItem}>
                  <div style={styles.resumoIcon}>
                    <span style={styles.currencyIcon}>R$</span>
                  </div>
                  <div style={styles.resumoInfo}>
                    <span style={styles.resumoLabel}>Total Gasto</span>
                    <span style={styles.resumoValueMoney}>R$ {totalGasto}</span>
                  </div>
                </div>
              </div>

              {/* Lista de Pedidos */}
              <div style={styles.pedidosListContainer}>
                <h3 style={styles.pedidosListTitle}>Histórico de Pedidos</h3>
                <Scrollbars style={styles.pedidosScrollbars} autoHide>
                  <div style={styles.pedidosList}>
                    {pedidosCliente.length === 0 ? (
                      <div style={styles.emptyPedidos}>
                        <FaShoppingCart style={styles.emptyPedidosIcon} />
                        <p style={styles.emptyPedidosText}>Não há pedidos para este cliente.</p>
                      </div>
                    ) : (
                      pedidosCliente.map((p) => (
                        <div key={p.id} style={styles.pedidoItem}>
                          <div style={styles.pedidoHeader}>
                            <div style={styles.pedidoId}>
                              <FaShoppingCart style={styles.pedidoIcon} />
                              <span style={styles.pedidoNumber}>Pedido #{p.id}</span>
                            </div>
                            <div style={styles.pedidoValue}>R$ {parseFloat(p.total || 0).toFixed(2)}</div>
                          </div>
                          <div style={styles.pedidoFooter}>
                            <div style={styles.pedidoDate}>
                              <FaCalendarAlt style={styles.dateIcon} />
                              <span>{new Date(p.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Scrollbars>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setModalPedidosOpen(false)}
                style={styles.submitButton}
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

      {erro_cliente && (
        <div style={styles.errorMessage}>
          <p style={styles.errorText}>{erro_cliente.message}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "1004px",
    height: "100vh",
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
    fontFamily: "system-ui, -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    height: "60px",
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #334155",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    fontSize: "24px",
    color: "#10b981",
    backgroundColor: "#064e3b",
    padding: "8px",
    borderRadius: "6px",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  headerRight: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  version: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  mainContent: {
    flex: 1,
    display: "flex",
  },
  rightContent: {
    flex: 1,
    padding: "24px",
    overflow: "auto",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#e2e8f0",
    margin: "0 0 4px 0",
  },
  pageSubtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    margin: 0,
  },
  novoButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#10b981",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  buttonIcon: {
    fontSize: "14px",
  },
  filtersContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    padding: "20px",
    backgroundColor: "#334155",
    borderRadius: "8px",
    border: "1px solid #475569",
  },
  contentArea: {
    backgroundColor: "#334155",
    borderRadius: "8px",
    border: "1px solid #475569",
    padding: "24px",
  },
  loadingState: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#94a3b8",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    gap: "16px",
  },
  emptyIcon: {
    fontSize: "48px",
    color: "#64748b",
  },
  emptyText: {
    fontSize: "16px",
    color: "#94a3b8",
  },
  clientesList: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  clienteCard: {
    backgroundColor: "#475569",
    border: "1px solid #64748b",
    borderRadius: "8px",
    padding: "20px",
    transition: "all 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  cardLeft: {
    display: "flex",
    gap: "12px",
    flex: 1,
  },
  cardIcon: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: "0 0 4px 0",
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  cardActions: {
    display: "flex",
    gap: "4px",
  },
  iconButton: {
    background: "none",
    border: "none",
    color: "#f59e0b",
    fontSize: "16px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    width: "32px",
    height: "32px",
  },
  iconButtonView: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontSize: "16px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    width: "32px",
    height: "32px",
  },
  iconButtonDelete: {
    background: "none",
    border: "none",
    color: "#ef4444",
    fontSize: "16px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    width: "32px",
    height: "32px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  clienteInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  clienteInfoItem: {
    fontSize: "14px",
    color: "#e2e8f0",
    margin: 0,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#334155",
    borderRadius: "8px",
    width: "500px",
    maxWidth: "90vw",
    border: "1px solid #475569",
    overflow: "hidden",
    maxHeight: "90vh",
  },
  modalContentLarge: {
    backgroundColor: "#334155",
    borderRadius: "8px",
    width: "700px",
    maxWidth: "90vw",
    border: "1px solid #475569",
    overflow: "hidden",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #475569",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: 0,
  },
  modalCloseButton: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
  },
  modalBody: {
    flex: 1,
    overflow: "hidden",
  },
  modalScrollbars: {
    height: "400px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  formLabel: {
    fontSize: "14px",
    color: "#e2e8f0",
    fontWeight: "500",
  },
  formInput: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  clienteInfoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#475569",
    margin: "0 0 24px 0",
  },
  clienteInfoIcon: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  clienteInfoDetails: {
    flex: 1,
  },
  clienteInfoName: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: "0 0 4px 0",
  },
  clienteInfoPhone: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: "0 0 2px 0",
  },
  clienteInfoAddress: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  pedidosResumo: {
    display: "flex",
    gap: "16px",
    padding: "0 24px",
    marginBottom: "24px",
  },
  resumoItem: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#475569",
    borderRadius: "8px",
    border: "1px solid #64748b",
  },
  resumoIcon: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },
  currencyIcon: {
    fontSize: "18px",
    fontWeight: "600",
  },
  resumoInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  resumoLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: "500",
    letterSpacing: "0.025em",
  },
  resumoValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#e2e8f0",
  },
  resumoValueMoney: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#10b981",
  },
  pedidosListContainer: {
    padding: "0 24px 24px 24px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  pedidosListTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: "0 0 16px 0",
  },
  pedidosScrollbars: {
    height: "250px",
  },
  pedidosList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "4px",
  },
  emptyPedidos: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "150px",
    gap: "16px",
  },
  emptyPedidosIcon: {
    fontSize: "32px",
    color: "#64748b",
  },
  emptyPedidosText: {
    fontSize: "14px",
    color: "#94a3b8",
    textAlign: "center",
  },
  pedidoItem: {
    backgroundColor: "#64748b",
    border: "1px solid #94a3b8",
    borderRadius: "6px",
    padding: "16px",
    transition: "all 0.2s ease",
  },
  pedidoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  pedidoId: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pedidoIcon: {
    fontSize: "14px",
    color: "#10b981",
  },
  pedidoNumber: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  pedidoValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#10b981",
  },
  pedidoFooter: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pedidoDate: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#94a3b8",
  },
  dateIcon: {
    fontSize: "12px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "20px 24px",
    borderTop: "1px solid #475569",
  },
  cancelButton: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "1px solid #64748b",
    backgroundColor: "transparent",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  submitButton: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#10b981",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  errorMessage: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#ef4444",
    color: "white",
    padding: "12px 16px",
    borderRadius: "6px",
    zIndex: 1001,
  },
  errorText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "500",
  },
};