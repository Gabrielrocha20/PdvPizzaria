import React, { useState, useEffect } from "react";
import SidebarMenu from "../components/menuPainel";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Message from "../components/Message";
import { useSabor } from "../hook/useSabor";
import { FaUtensils, FaPlus, FaEdit, FaTrash, FaTimes, FaIceCream } from "react-icons/fa";

export default function CadastroSabor() {
  const {
    sabores,
    saborSelected,
    setSaborSelected,
    loading_sabor,
    erro_sabor,
    criaSabor,
    editaSabor,
    deletaSabor,
  } = useSabor();

  const [filteredSabores, setFilteredSabores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nomeSabor, setNomeSabor] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const saboresPerPage = 6;

  useEffect(() => {
    setFilteredSabores(sabores);
  }, [sabores]);

  // Filtrar pesquisa
  const handleSearch = (query) => {
    if (!query) {
      setFilteredSabores(sabores);
    } else {
      setFilteredSabores(
        sabores.filter((s) =>
          s.nome.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  };

  // Cadastrar ou Editar sabor
  const handleSalvar = async () => {
    if (!nomeSabor.trim()) {
      setMensagem({ type: "error", message: "Digite o nome do sabor!" });
      return;
    }

    try {
      if (editandoId) {
        await editaSabor(editandoId, { nome: nomeSabor });
        setMensagem({ type: "success", message: "Sabor atualizado com sucesso!" });
      } else {
        await criaSabor({ nome: nomeSabor });
        setMensagem({ type: "success", message: "Sabor cadastrado com sucesso!" });
      }
      setNomeSabor("");
      setEditandoId(null);
      setModalOpen(false);
    } catch (err) {
      setMensagem({ type: "error", message: err.message || "Erro ao salvar sabor" });
    }
  };

  // Excluir sabor
  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este sabor?")) return;
    try {
      await deletaSabor(id);
      setMensagem({ type: "success", message: "Sabor excluído com sucesso!" });
    } catch (err) {
      setMensagem({ type: "error", message: err.message || "Erro ao excluir sabor" });
    }
  };

  // Paginação lógica
  const indexOfLast = currentPage * saboresPerPage;
  const indexOfFirst = indexOfLast - saboresPerPage;
  const currentSabores = filteredSabores.slice(indexOfFirst, indexOfLast);

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
              <h1 style={styles.pageTitle}>Sabores</h1>
              <p style={styles.pageSubtitle}>Gerencie os sabores dos produtos</p>
            </div>
            <button
              style={styles.novoButton}
              onClick={() => setModalOpen(true)}
            >
              <FaPlus style={styles.buttonIcon} />
              Novo Sabor
            </button>
          </div>

          {/* Filtros */}
          <div style={styles.filtersContainer}>
            <SearchBar onSearch={handleSearch} placeholder="Pesquisar sabor..." />
          </div>

          {/* Lista de sabores */}
          <div style={styles.contentArea}>
            {loading_sabor ? (
              <div style={styles.loadingState}>
                <p style={styles.loadingText}>Carregando sabores...</p>
              </div>
            ) : currentSabores.length === 0 ? (
              <div style={styles.emptyState}>
                <FaIceCream style={styles.emptyIcon} />
                <p style={styles.emptyText}>Nenhum sabor encontrado.</p>
              </div>
            ) : (
              <div style={styles.saboresList}>
                {currentSabores.map((s) => (
                  <div key={s.id} style={styles.saborCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardLeft}>
                        <div style={styles.cardIcon}>
                          <FaIceCream />
                        </div>
                        <h3 style={styles.cardTitle}>{s.nome}</h3>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          style={styles.iconButton}
                          onClick={() => {
                            setNomeSabor(s.nome);
                            setEditandoId(s.id);
                            setModalOpen(true);
                          }}
                          title="Editar sabor"
                        >
                          <FaEdit />
                        </button>
                        <button
                          style={styles.iconButtonDelete}
                          onClick={() => handleExcluir(s.id)}
                          title="Excluir sabor"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {Math.ceil(filteredSabores.length / saboresPerPage) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredSabores.length / saboresPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editandoId ? "Editar Sabor" : "Novo Sabor"}
              </h2>
              <button
                style={styles.modalCloseButton}
                onClick={() => {
                  setModalOpen(false);
                  setEditandoId(null);
                  setNomeSabor("");
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nome do Sabor:</label>
                  <input
                    type="text"
                    value={nomeSabor}
                    onChange={(e) => setNomeSabor(e.target.value)}
                    style={styles.formInput}
                    placeholder="Digite o nome do sabor"
                  />
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditandoId(null);
                  setNomeSabor("");
                }}
                style={styles.cancelButton}
              >
                Cancelar
              </button>
              <button onClick={handleSalvar} style={styles.submitButton}>
                {editandoId ? "Salvar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem */}
      {mensagem && (
        <Message
          type={mensagem.type}
          message={mensagem.message}
          onClose={() => setMensagem(null)}
        />
      )}

      {erro_sabor && (
        <div style={styles.errorMessage}>
          <p style={styles.errorText}>{erro_sabor.message}</p>
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
  saboresList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  saborCard: {
    backgroundColor: "#475569",
    border: "1px solid #64748b",
    borderRadius: "8px",
    padding: "20px",
    transition: "all 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
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
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#e2e8f0",
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
    padding: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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