import React, { useState, useEffect, useMemo } from "react";
import SidebarMenu from "../components/menuPainel";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Message from "../components/Message";
import { usePromocao } from "../hook/usePromocao";
import { useProduto } from "../hook/useProduto";
import { usePromocaoItemHook } from "../hook/usePromocaoItem";
import { useCategoria } from "../hook/useCategoria";
import { FaUtensils, FaPlus, FaEdit, FaTrash, FaTimes, FaTag, FaSearch, FaMinus, FaPlus as FaPlusQty } from "react-icons/fa";
import { Scrollbars } from "react-custom-scrollbars-2";

export default function CadastroPromocao() {
  const {
    promocoes,
    loading_promocao,
    erro_promocao,
    criaPromocao,
    editaPromocao,
    deletaPromocao,
  } = usePromocao();

  const { produtos, loading_produto } = useProduto();
  const { promocaoItens, cria, edita, deleta } = usePromocaoItemHook();
  const { categorias, loading_categoria } = useCategoria();

  const [filteredPromocoes, setFilteredPromocoes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProdutosOpen, setModalProdutosOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  const [mensagem, setMensagem] = useState(null);

  // Estados para o modal de produtos
  const [produtoSearch, setProdutoSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const promocoesPerPage = 4;

  useEffect(() => setFilteredPromocoes(promocoes), [promocoes]);

  const handleSearch = (query) => {
    if (!query) setFilteredPromocoes(promocoes);
    else
      setFilteredPromocoes(
        promocoes.filter((p) =>
          p.nome.toLowerCase().includes(query.toLowerCase())
        )
      );
    setCurrentPage(1);
  };

  // Filtrar produtos no modal
  const produtosFiltrados = useMemo(() => {
    if (!produtoSearch) return produtos;
    return produtos.filter(prod => 
      prod.nome.toLowerCase().includes(produtoSearch.toLowerCase())
    );
  }, [produtos, produtoSearch]);

  const handleEditar = (p) => {
    setNome(p.nome);
    setDescricao(p.descricao || "");
    setValor(p.valor || "");
    setCategoriaId(p.categoriaId || "");
    setEditandoId(p.id);
    setSelectedProdutos(
      p.itens ? p.itens.map((pi) => ({ itemId: pi.itemId, quantidade: pi.quantidade || 1 })) : []
    );
    setModalOpen(true);
  };

  const handleSalvar = async () => {
    if (!nome || !valor) {
      setMensagem({ type: "error", message: "Preencha nome e valor!" });
      return;
    }

    try {
      const formData = {
        nome,
        descricao,
        valor: parseFloat(valor),
        categoriaId: categoriaId || null,
      };
      let promo;
      if (editandoId) {
        promo = await editaPromocao(editandoId, formData);
      } else {
        promo = await criaPromocao(formData);
      }

      // Atualiza itens da promoção
      const itensExistentes = promocaoItens.filter(
        (pi) => pi.promocaoId === promo.id
      );

      // Remove itens desmarcados
      for (const pi of itensExistentes) {
        if (!selectedProdutos.some(p => p.itemId === pi.itemId)) await deleta(pi.id);
      }

      // Cria ou edita itens
      for (const p of selectedProdutos) {
        const existente = itensExistentes.find(pi => pi.itemId === p.itemId);
        if (existente) {
          if (existente.quantidade !== p.quantidade) {
            await edita(existente.id, p.quantidade);
          }
        } else {
          await cria(promo.id, p.itemId, p.quantidade);
        }
      }

      setMensagem({
        type: "success",
        message: `Promoção ${editandoId ? "atualizada" : "cadastrada"} com sucesso!`,
      });
      resetForm();
    } catch (err) {
      setMensagem({ type: "error", message: err.message || "Erro ao salvar promoção" });
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta promoção?")) return;
    try {
      await deletaPromocao(id);
      setMensagem({ type: "success", message: "Promoção excluída com sucesso!" });
    } catch (err) {
      setMensagem({ type: "error", message: err.message || "Erro ao excluir promoção" });
    }
  };

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setValor("");
    setCategoriaId("");
    setSelectedProdutos([]);
    setEditandoId(null);
    setModalOpen(false);
  };

  const updateQuantidade = (itemId, novaQuantidade) => {
    if (novaQuantidade < 1) return;
    setSelectedProdutos(selectedProdutos.map(p =>
      p.itemId === itemId ? { ...p, quantidade: novaQuantidade } : p
    ));
  };

  const toggleProduto = (prodId) => {
    const produtoSelecionado = selectedProdutos.find(p => p.itemId === prodId);
    if (produtoSelecionado) {
      setSelectedProdutos(selectedProdutos.filter(p => p.itemId !== prodId));
    } else {
      setSelectedProdutos([...selectedProdutos, { itemId: prodId, quantidade: 1 }]);
    }
  };

  const indexOfLast = currentPage * promocoesPerPage;
  const indexOfFirst = indexOfLast - promocoesPerPage;
  const currentPromocoes = filteredPromocoes.slice(indexOfFirst, indexOfLast);

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
              <h1 style={styles.pageTitle}>Promoções</h1>
              <p style={styles.pageSubtitle}>Gerencie as promoções do sistema</p>
            </div>
            <button
              style={styles.novoButton}
              onClick={() => setModalOpen(true)}
            >
              <FaPlus style={styles.buttonIcon} />
              Nova Promoção
            </button>
          </div>

          {/* Filtros */}
          <div style={styles.filtersContainer}>
            <SearchBar onSearch={handleSearch} placeholder="Pesquisar promoção..." />
          </div>

          {/* Lista de promoções */}
          <div style={styles.contentArea}>
            {loading_promocao ? (
              <div style={styles.loadingState}>
                <p style={styles.loadingText}>Carregando promoções...</p>
              </div>
            ) : currentPromocoes.length === 0 ? (
              <div style={styles.emptyState}>
                <FaTag style={styles.emptyIcon} />
                <p style={styles.emptyText}>Nenhuma promoção encontrada.</p>
              </div>
            ) : (
              <div style={styles.promocoesList}>
                {currentPromocoes.map((p) => (
                  <div key={p.id} style={styles.promocaoCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardLeft}>
                        <div style={styles.cardIcon}>
                          <FaTag />
                        </div>
                        <div style={styles.cardInfo}>
                          <h3 style={styles.cardTitle}>{p.nome}</h3>
                        </div>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          style={styles.iconButton}
                          onClick={() => handleEditar(p)}
                          title="Editar promoção"
                        >
                          <FaEdit />
                        </button>
                        <button
                          style={styles.iconButtonDelete}
                          onClick={() => handleExcluir(p.id)}
                          title="Excluir promoção"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div style={styles.cardContent}>
                      <div style={styles.cardPrice}>R$ {p.valor}</div>
                      {p.itens && p.itens.length > 0 && (
                        <div style={styles.cardItems}>
                          <p style={styles.itemsTitle}>Itens inclusos:</p>
                          <ul style={styles.itemsList}>
                            {p.itens.map((pi) => (
                              <li key={pi.id} style={styles.itemsListItem}>
                                {pi.item ? pi.item.nome : "Item não disponível"} × {pi.quantidade || 1}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {Math.ceil(filteredPromocoes.length / promocoesPerPage) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredPromocoes.length / promocoesPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal principal */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    {editandoId ? "Editar Promoção" : "Nova Promoção"}
                  </h2>
                  <button style={styles.modalCloseButton} onClick={resetForm}>
                    <FaTimes />
                  </button>
                </div>
                <Scrollbars
                  style={{ height: "400px" }} // define a altura fixa para rolar
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={200}
                  renderThumbVertical={({ style, ...props }) => (
                    <div {...props} style={{ ...style, backgroundColor: "#00ffff", borderRadius: 4 }} />
                  )}
                  renderTrackVertical={({ style, ...props }) => (
                    <div {...props} style={{ ...style, backgroundColor: "#16213e", borderRadius: 4 }} />
                  )}
                >
                  <div style={styles.modalBody}>
                    <div style={styles.form}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Nome:</label>
                        <input
                          type="text"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          style={styles.formInput}
                          placeholder="Nome da promoção"
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Descrição:</label>
                        <textarea
                          value={descricao}
                          onChange={(e) => setDescricao(e.target.value)}
                          style={styles.formTextarea}
                          placeholder="Descrição da promoção"
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Categoria:</label>
                        {loading_categoria ? (
                          <p style={styles.loadingText}>Carregando...</p>
                        ) : (
                          <select
                            value={categoriaId}
                            onChange={(e) => setCategoriaId(parseInt(e.target.value))}
                            style={styles.formSelect}
                          >
                            <option value="">Selecione uma categoria</option>
                            {categorias.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nome}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Valor da promoção (R$):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={valor}
                          onChange={(e) => setValor(e.target.value)}
                          style={styles.formInput}
                          placeholder="0.00"
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Itens da promoção:</label>
                        <button
                          type="button"
                          style={styles.selectProdutosButton}
                          onClick={() => setModalProdutosOpen(true)}
                        >
                          <FaPlus style={styles.buttonIcon} />
                          Selecionar Produtos ({selectedProdutos.length})
                        </button>
                        {selectedProdutos.length > 0 && (
                          <div style={styles.selectedProdutosList}>
                            {selectedProdutos.map((sp) => {
                              const produto = produtos.find(p => p.id === sp.itemId);
                              return (
                                <div key={sp.itemId} style={styles.selectedProdutoItem}>
                                  <span style={styles.selectedProdutoName}>
                                    {produto?.nome || "Produto não encontrado"}
                                  </span>
                                  <span style={styles.selectedProdutoQty}>× {sp.quantidade}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Scrollbars>

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

      {/* Modal de produtos melhorado */}
      {modalProdutosOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContentLarge}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Selecionar Produtos</h3>
              <button
                style={styles.modalCloseButton}
                onClick={() => {
                  setModalProdutosOpen(false);
                  setProdutoSearch("");
                }}
              >
                <FaTimes />
              </button>
            </div>
             <Scrollbars
              style={{ height: "400px" }} // define a altura fixa para rolar
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              renderThumbVertical={({ style, ...props }) => (
                <div {...props} style={{ ...style, backgroundColor: "#00ffff", borderRadius: 4 }} />
              )}
              renderTrackVertical={({ style, ...props }) => (
                <div {...props} style={{ ...style, backgroundColor: "#16213e", borderRadius: 4 }} />
              )}
            >
              <div style={styles.modalBody}>
                {/* Campo de busca no modal de produtos */}
                <div style={styles.produtoSearchContainer}>
                  <div style={styles.searchInputWrapper}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Buscar produto..."
                      value={produtoSearch}
                      onChange={(e) => setProdutoSearch(e.target.value)}
                      style={styles.produtoSearchInput}
                    />
                  </div>
                </div>

                {/* Lista de produtos */}
                <div style={styles.produtosList}>
                  {loading_produto ? (
                    <p style={styles.loadingText}>Carregando produtos...</p>
                  ) : produtosFiltrados.length === 0 ? (
                    <p style={styles.emptyText}>Nenhum produto encontrado.</p>
                  ) : (
                    produtosFiltrados.map((prod) => {
                      const produtoSelecionado = selectedProdutos.find(p => p.itemId === prod.id);
                      return (
                        <div key={prod.id} style={styles.produtoItem}>
                          <div style={styles.produtoItemLeft}>
                            <input
                              type="checkbox"
                              checked={!!produtoSelecionado}
                              onChange={() => toggleProduto(prod.id)}
                              style={styles.produtoCheckbox}
                            />
                            <span style={styles.produtoName}>{prod.nome}</span>
                          </div>
                          {produtoSelecionado && (
                            <div style={styles.produtoQuantityControls}>
                              <button
                                type="button"
                                style={styles.quantityButton}
                                onClick={() => updateQuantidade(prod.id, produtoSelecionado.quantidade - 1)}
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={produtoSelecionado.quantidade}
                                onChange={(e) => {
                                  const novaQtd = parseInt(e.target.value) || 1;
                                  updateQuantidade(prod.id, novaQtd);
                                }}
                                style={styles.quantityInput}
                              />
                              <button
                                type="button"
                                style={styles.quantityButton}
                                onClick={() => updateQuantidade(prod.id, produtoSelecionado.quantidade + 1)}
                              >
                                <FaPlusQty />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Scrollbars>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setModalProdutosOpen(false);
                  setProdutoSearch("");
                }}
              >
                Cancelar
              </button>
              <button
                style={styles.submitButton}
                onClick={() => {
                  setModalProdutosOpen(false);
                  setProdutoSearch("");
                }}
              >
                Confirmar Seleção ({selectedProdutos.length})
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
      {erro_promocao && (
        <div style={styles.errorMessage}>
          <p style={styles.errorText}>{erro_promocao.message}</p>
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
  promocoesList: {
    display: "grid",
    // gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  promocaoCard: {
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
    gap: "12px",
  },
  cardPrice: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#10b981",
  },
  cardItems: {
    backgroundColor: "#334155",
    padding: "12px",
    borderRadius: "6px",
  },
  itemsTitle: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    margin: "0 0 8px 0",
    fontWeight: "500",
  },
  itemsList: {
    margin: 0,
    paddingLeft: "16px",
  },
  itemsListItem: {
    fontSize: "14px",
    color: "#e2e8f0",
    marginBottom: "4px",
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
    padding: "24px",
    flex: 1,
    overflow: "auto",
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
  formTextarea: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease",
    minHeight: "80px",
    resize: "vertical",
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
  selectProdutosButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #64748b",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  selectedProdutosList: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  selectedProdutoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#64748b",
    borderRadius: "4px",
    fontSize: "14px",
  },
  selectedProdutoName: {
    color: "#e2e8f0",
  },
  selectedProdutoQty: {
    color: "#10b981",
    fontWeight: "600",
  },
  produtoSearchContainer: {
    marginBottom: "16px",
  },
  searchInputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "14px",
    color: "#64748b",
    zIndex: 1,
  },
  produtoSearchInput: {
    padding: "12px 14px 12px 44px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease",
    width: "100%",
  },
  produtosList: {
    maxHeight: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  produtoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#475569",
    borderRadius: "6px",
    border: "1px solid #64748b",
  },
  produtoItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  produtoCheckbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  produtoName: {
    fontSize: "14px",
    color: "#e2e8f0",
    fontWeight: "500",
  },
  produtoQuantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  quantityButton: {
    background: "none",
    border: "1px solid #64748b",
    borderRadius: "4px",
    color: "#e2e8f0",
    cursor: "pointer",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    transition: "all 0.2s ease",
  },
  quantityInput: {
    width: "60px",
    padding: "6px",
    textAlign: "center",
    borderRadius: "4px",
    border: "1px solid #475569",
    backgroundColor: "#475569",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
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