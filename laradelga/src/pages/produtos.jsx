import React, { useState, useMemo } from "react";
import SidebarMenu from "../components/menuPainel";
import { useProduto } from "../hook/useProduto";
import { useCategoria } from "../hook/useCategoria";
import { FaUtensils, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

// já existentes
import SearchBar from "../components/SearchBar";
import CategoriaFilter from "../components/CategoriaFilter";
import Pagination from "../components/Pagination";

// novo componente de mensagem
import Message from "../components/Message";

export default function CadastroProdutos() {
  const { produtos, criaProduto, editaProduto, deletaProduto, loading_produto } =
    useProduto();
  const { categorias } = useCategoria();

  const [modalOpen, setModalOpen] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");
  const [categoriaProduto, setCategoriaProduto] = useState("");
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [temSabor, setTemSabor] = useState(false);

  // novos estados para filtros e paginação
  const [query, setQuery] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // estado para mensagens
  const [alert, setAlert] = useState({ type: "", message: "" });

  // filtro + busca
  const produtosFiltrados = useMemo(() => {
    return (produtos ?? []).filter((p) => {
      const matchQuery = p.nome?.toLowerCase().includes(query.toLowerCase());
      const matchCategoria = categoriaFiltro
        ? p.categoriaId === parseInt(categoriaFiltro)
        : true;
      return matchQuery && matchCategoria;
    });
  }, [produtos, query, categoriaFiltro]);

  const totalPages = Math.ceil(produtosFiltrados.length / pageSize);
  const paginatedProdutos = produtosFiltrados.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSalvar = async () => {
    if (!nomeProduto || !precoProduto || !categoriaProduto) {
      setAlert({ type: "error", message: "Preencha todos os campos!" });
      return;
    }

    try {
      const formData = {
        nome: nomeProduto,
        preco: parseFloat(precoProduto),
        categoriaId: parseInt(categoriaProduto),
        temSabor,
      };

      if (produtoEditando) {
        await editaProduto(produtoEditando.id, formData);
        setAlert({ type: "success", message: "Produto editado com sucesso!" });
      } else {
        await criaProduto(formData);
        setAlert({ type: "success", message: "Produto cadastrado com sucesso!" });
      }

      resetForm();
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "Erro ao salvar produto." });
    }
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setNomeProduto(produto.nome);
    setPrecoProduto(produto.preco);
    setCategoriaProduto(produto.categoriaId);
    setTemSabor(produto.temSabor || false);
    setModalOpen(true);
  };

  const handleExcluir = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      try {
        await deletaProduto(id);
        setAlert({ type: "success", message: "Produto excluído com sucesso!" });
      } catch (error) {
        setAlert({ type: "error", message: "Erro ao excluir produto." });
      }
    }
  };

  const resetForm = () => {
    setNomeProduto("");
    setPrecoProduto("");
    setCategoriaProduto("");
    setProdutoEditando(null);
    setModalOpen(false);
  };

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
              <h1 style={styles.pageTitle}>Produtos</h1>
              <p style={styles.pageSubtitle}>Gerencie seus produtos</p>
            </div>
            <button
              style={styles.novoButton}
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }}
            >
              <FaPlus style={styles.buttonIcon} />
              Novo Produto
            </button>
          </div>

          {/* Filtros */}
          <div style={styles.filtersContainer}>
            <SearchBar query={query} setQuery={setQuery} />
            <CategoriaFilter
              categorias={categorias}
              selected={categoriaFiltro}
              setSelected={setCategoriaFiltro}
            />
          </div>

          {/* Lista de produtos */}
          <div style={styles.contentArea}>
            {loading_produto ? (
              <div style={styles.loadingState}>
                <p style={styles.loadingText}>Carregando produtos...</p>
              </div>
            ) : paginatedProdutos.length === 0 ? (
              <div style={styles.emptyState}>
                <FaUtensils style={styles.emptyIcon} />
                <p style={styles.emptyText}>Nenhum produto encontrado.</p>
              </div>
            ) : (
              <div style={styles.produtosList}>
                {paginatedProdutos.map((p) => (
                  <div key={p.id} style={styles.produtoCard}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>{p.nome}</h3>
                      {p.temSabor && <span style={styles.saborTag}>Com Sabor</span>}
                    </div>
                    
                    <div style={styles.cardContent}>
                      <p style={styles.cardInfo}>
                        <span style={styles.cardLabel}>Categoria:</span>
                        {categorias.find((c) => c.id === p.categoriaId)?.nome ||
                          "Sem categoria"}
                      </p>
                      <p style={styles.cardPrice}>R$ {p.preco.toFixed(2)}</p>
                    </div>

                    <div style={styles.cardActions}>
                      <button 
                        style={styles.editButton} 
                        onClick={() => handleEditar(p)}
                      >
                        <FaEdit />
                        Editar
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleExcluir(p.id, p.nome)}
                      >
                        <FaTrash />
                        Excluir
                      </button>
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
                {produtoEditando ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button style={styles.modalCloseButton} onClick={resetForm}>
                <FaTimes />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nome do Produto:</label>
                  <input
                    type="text"
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                    style={styles.formInput}
                    placeholder="Digite o nome do produto"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Preço (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoProduto}
                    onChange={(e) => setPrecoProduto(e.target.value)}
                    style={styles.formInput}
                    placeholder="0,00"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Categoria:</label>
                  <select
                    value={categoriaProduto}
                    onChange={(e) => setCategoriaProduto(e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={temSabor}
                      onChange={(e) => setTemSabor(e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span style={styles.checkboxText}>Tem sabor</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={resetForm} style={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleSalvar} style={styles.submitButton}>
                {produtoEditando ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso/erro */}
      <Message
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
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
  produtosList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  produtoCard: {
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
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: 0,
    flex: 1,
  },
  saborTag: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },
  cardContent: {
    marginBottom: "16px",
  },
  cardInfo: {
    fontSize: "14px",
    color: "#e2e8f0",
    marginBottom: "8px",
  },
  cardLabel: {
    color: "#94a3b8",
    fontWeight: "500",
  },
  cardPrice: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#10b981",
    margin: 0,
  },
  cardActions: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flex: 1,
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f59e0b",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flex: 1,
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    justifyContent: "center",
    transition: "all 0.2s ease",
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
  formSelect: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  checkboxText: {
    fontSize: "14px",
    color: "#e2e8f0",
    fontWeight: "500",
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