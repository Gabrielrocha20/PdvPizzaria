import React, { useState, useMemo } from "react";
import SidebarMenu from "../components/menuPainel";
import { useCategoria } from "../hook/useCategoria";
import Message from "../components/Message";
import { FaUtensils, FaPlus, FaEdit, FaTrash, FaTimes, FaFolder } from "react-icons/fa";

// componentes existentes
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

export default function CadastroCategoria() {
  const { categorias = [], criaCategoria, editaCategoria, deletaCategoria, loading_categoria } =
    useCategoria();

  const [modalOpen, setModalOpen] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  // mensagem (sucesso/erro)
  const [message, setMessage] = useState({ message: "", type: "" });

  // pesquisa + paginação
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // filtra pelo nome
  const categoriasFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (categorias ?? []).filter((c) =>
      c.nome?.toLowerCase().includes(q)
    );
  }, [categorias, query]);

  // paginação
  const totalPages = Math.ceil(categoriasFiltradas.length / pageSize);
  const paginatedCategorias = categoriasFiltradas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSalvar = async () => {
    if (!nomeCategoria) {
      setMessage({ message: "Digite o nome da categoria!", type: "error" });
      return;
    }

    try {
      if (editandoId) {
        await editaCategoria(editandoId, { nome: nomeCategoria });
        setMessage({ message: "Categoria atualizada com sucesso!", type: "success" });
      } else {
        await criaCategoria({ nome: nomeCategoria });
        setMessage({ message: "Categoria cadastrada com sucesso!", type: "success" });
      }

      setNomeCategoria("");
      setModalOpen(false);
      setEditandoId(null);
      setCurrentPage(1);
    } catch (err) {
      setMessage({ message: "Erro ao salvar categoria.", type: "error" });
    }
  };

  const handleEditar = (categoria) => {
    setEditandoId(categoria.id);
    setNomeCategoria(categoria.nome);
    setModalOpen(true);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await deletaCategoria(id);
      setMessage({ message: "Categoria excluída com sucesso!", type: "success" });
    } catch (err) {
      setMessage({ message: "Erro ao excluir categoria.", type: "error" });
    }
  };

  return (
    <div style={styles.container}>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <SidebarMenu />

        {/* Right Content */}
        <div style={styles.rightContent}>
          {/* mensagem no canto superior direito */}
          {message.message && (
            <Message
              type={message.type}
              message={message.message}
              onClose={() => setMessage({ message: "", type: "" })}
            />
          )}

          {/* Page Header */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>Categorias</h1>
              <p style={styles.pageSubtitle}>Gerencie as categorias dos produtos</p>
            </div>
            <button
              style={styles.novoButton}
              onClick={() => setModalOpen(true)}
            >
              <FaPlus style={styles.buttonIcon} />
              Nova Categoria
            </button>
          </div>

          {/* Filtros */}
          <div style={styles.filtersContainer}>
            <SearchBar
              query={query}
              setQuery={(v) => {
                setQuery(v);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Lista de categorias */}
          <div style={styles.contentArea}>
            {loading_categoria ? (
              <div style={styles.loadingState}>
                <p style={styles.loadingText}>Carregando categorias...</p>
              </div>
            ) : paginatedCategorias.length === 0 ? (
              <div style={styles.emptyState}>
                <FaFolder style={styles.emptyIcon} />
                <p style={styles.emptyText}>Nenhuma categoria encontrada.</p>
              </div>
            ) : (
              <div style={styles.categoriasList}>
                {paginatedCategorias.map((c) => (
                  <div key={c.id} style={styles.categoriaCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardLeft}>
                        <div style={styles.cardIcon}>
                          <FaFolder />
                        </div>
                        <h3 style={styles.cardTitle}>{c.nome}</h3>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          style={styles.iconButton}
                          onClick={() => handleEditar(c)}
                          title="Editar categoria"
                        >
                          <FaEdit />
                        </button>
                        <button
                          style={styles.iconButtonDelete}
                          onClick={() => handleExcluir(c.id)}
                          title="Excluir categoria"
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
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
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
                {editandoId ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button
                style={styles.modalCloseButton}
                onClick={() => {
                  setModalOpen(false);
                  setEditandoId(null);
                  setNomeCategoria("");
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nome da Categoria:</label>
                  <input
                    type="text"
                    value={nomeCategoria}
                    onChange={(e) => setNomeCategoria(e.target.value)}
                    style={styles.formInput}
                    placeholder="Digite o nome da categoria"
                  />
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditandoId(null);
                  setNomeCategoria("");
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
  categoriasList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  categoriaCard: {
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
};