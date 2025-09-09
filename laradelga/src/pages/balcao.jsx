import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoria } from "../hook/useCategoria";
import { useCliente } from "../hook/useCliente";
import { useProduto } from "../hook/useProduto";
import { usePromocao } from "../hook/usePromocao";
import { useSabor } from "../hook/useSabor";
import { usePedidoHook } from "../hook/usePedido";
import { 
  Pizza, 
  User, 
  MapPin, 
  Phone, 
  ShoppingCart, 
  Trash, 
  Search, 
  Tag, 
  Percent,
  DollarSign,
  Plus,
  X,
  LogOut,
  Store
} from 'lucide-react';
import { Scrollbars } from "react-custom-scrollbars-2";


export default function Balcao() {
  const navigate = useNavigate();

  const { categorias, categoriaSelected, setCategoriaSelected } = useCategoria();
  const { clientes, clienteSelected, setClienteSelected } = useCliente();
  const { produtos } = useProduto();
  const { promocoes } = usePromocao();
  const { sabores } = useSabor();
  const { cria } = usePedidoHook();
  const [cart, setCart] = useState([]);
  const [showSaborModal, setShowSaborModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSabores, setSelectedSabores] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountInput, setDiscountInput] = useState(0);
  const [discountType, setDiscountType] = useState("valor");
  const [selectedPromoItem, setSelectedPromoItem] = useState(null);
  const [showSaborPromoModal, setShowSaborPromoModal] = useState(false);

  const handleCategoryClick = (category) => setCategoriaSelected(category);

  const handleItemClick = (item) => {
    if (item.temSabor) {
      const newItem = {
        ...item,
        cartItemId: Date.now() + Math.random(),
        sabores: [],
      };

      setCart((prevCart) => [...prevCart, newItem]);
      setSelectedItem(newItem);
      setSelectedSabores([]);
      setShowSaborModal(true);
      console.log("1") 
      console.log("Item requires sabor selection:", item); 
      console.log("Current cart before adding item:", cart); 
      console.log("Selected sabores:", selectedSabores);
    } else {
      setCart((prevCart) => [
        ...prevCart,
        {
          cartItemId: Date.now() + Math.random(),
          id: item.id,
          nome: item.nome,
          preco: item.preco,
          temSabor: item.temSabor || false, // mantém consistência com promoções
        },
      ]);
      console.log("2")
      console.log("Item requires sabor selection:", item);
      console.log("Current cart before adding item:", cart);
      console.log("Selected sabores:", selectedSabores);
    }
  };

  const handleSetCliente = (cliente) => {
    setClienteSelected(cliente);
    setShowClientModal(false);

    const existingTaxaIndex = cart.findIndex(i => i.id === "taxaEntrega");

    const taxaItem = {
      cartItemId: Date.now() + Math.random(),
      id: "taxaEntrega",
      nome: "Taxa de Entrega",
      preco: cliente.taxaEntrega || 0,
    };

    if (existingTaxaIndex >= 0) {
      const newCart = [...cart];
      newCart[existingTaxaIndex] = taxaItem;
      setCart(newCart);
    } else {
      setCart([...cart, taxaItem]);
    }
  };

  const handleAddPromocao = (promo) => {
    let newCartItems = [];

    // calcula total de unidades
    const totalQtd = promo.itens.reduce((acc, i) => acc + (i.quantidade || 1), 0);

    promo.itens.forEach((i) => {
      const qtd = i.quantidade || 1;
      for (let j = 0; j < qtd; j++) {
        newCartItems.push({
          cartItemId: Date.now() + Math.random(),
          id: i.item.id,
          nome: i.item.nome,
          preco: promo.valor / totalQtd, // <--- divide pelo total de unidades
          temSabor: i.item.temSabor || false,
          promoId: promo.id,
        });
      }
    });

    setCart([...cart, ...newCartItems]);

    // abre modal para o primeiro item que precisa de sabor
    const firstWithSabor = newCartItems.find((i) => i.temSabor);
    if (firstWithSabor) {
      setSelectedItem(firstWithSabor);
      setSelectedSabores([]);
      setShowSaborModal(true);
    }
  };

  const handlePromoSaborApply = () => {
    const updatedItem = {
      ...selectedPromoItem,
      nome: selectedPromoItem.nome + 
            (selectedPromoItem.selectedSabor ? ` (${selectedPromoItem.selectedSabor.nome})` : "")
    };

    const newCart = cart.map((i) =>
      i.cartItemId === updatedItem.cartItemId ? updatedItem : i
    );
    setCart(newCart);

    const nextItem = cart
      .filter((i) => i.temSabor && !i.selectedSabor)
      .find((i) => i.cartItemId !== updatedItem.cartItemId);

    if (nextItem) {
      setSelectedPromoItem(nextItem);
    } else {
      setSelectedPromoItem(null);
      setShowSaborPromoModal(false);
    }
  };

  const handleSaborApply = () => {
    // remove sabores antigos entre parênteses
    const baseName = selectedItem.nome.replace(/\s*\(.*\)$/, "");

    const nome =
      baseName +
      (selectedSabores.length > 0 ? ` (${selectedSabores.map(s => s.nome).join(", ")})` : "");

    const newCart = cart.map(i =>
      i.cartItemId === selectedItem.cartItemId ? { ...i, nome, sabores: selectedSabores } : i
    );

    setCart(newCart);
    setSelectedSabores([]);

    // seleciona próximo item que precisa de sabor
    const nextItem = newCart.find(i => i.temSabor && (!i.sabores || i.sabores.length === 0));
    if (nextItem) {
      setSelectedItem(nextItem);
      setShowSaborModal(true);
    } else {
      setSelectedItem(null);
      setShowSaborModal(false);
    }
  };

  const handleRemoveItem = (cartItemId) =>
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));

  const handleCancel = () => {
    setCart([]);
    setClienteSelected(null);
    setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.preco, 0);
  const total = subtotal - discount;

  const handleApplyDiscount = () => {
    let finalDiscount = discountInput;
    if (discountType === "percent") {
      finalDiscount = (subtotal * discountInput) / 100;
    }
    setDiscount(finalDiscount);
    setShowDiscountModal(false);
  };

  const handleFinalizeOrder = async () => {
    if (!clienteSelected) {
      alert("Selecione um cliente antes de finalizar.");
      return;
    }
    if (cart.length === 0) {
      alert("Adicione produtos ao pedido antes de finalizar.");
      return;
    }

    const orderData = {
      cliente: clienteSelected,
      itens: cart,
      total,
    };

    // só pega itens que têm itemId válido
    const itensParaSalvar = cart
      .filter(item => item.id !== "taxaEntrega")
      .map(item => ({
        itemId: item.id,
        quantidade: item.quantidade || 1,
      }));

    await cria(clienteSelected.id, total, itensParaSalvar);

    console.log("Finalizando pedido:", orderData);
    alert("Pedido finalizado!");

    setCart([]);
    setDiscount(0);
    setClienteSelected(null);
  };

  const filteredClients = clientes.filter((c) =>
    c?.nome?.toLowerCase().includes(searchClient.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <div style={styles.logo}>
              <Store size={24} color="white" />
            </div>
            Balcão - Sistema de Pedidos
          </h1>
          <div style={styles.systemInfo}>v0.0.3 - Pizzaria</div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Left Panel - Order Summary */}
        <div style={styles.leftPanel}>
          {/* Cliente Section */}
          <div style={styles.clientSection}>
            <h3 style={styles.sectionTitle}>
              <User size={18} />
              Cliente
            </h3>
            <div 
              style={styles.clientSelector}
              onClick={() => setShowClientModal(true)}
            >
              {clienteSelected ? (
                <div style={styles.selectedClient}>
                  <div style={styles.clientName}>{clienteSelected.nome}</div>
                  <div style={styles.clientInfo}>
                    <Phone size={14} />
                    {clienteSelected.telefone}
                  </div>
                  <div style={styles.clientInfo}>
                    <MapPin size={14} />
                    {clienteSelected.endereco}
                  </div>
                </div>
              ) : (
                <div style={styles.selectClientPrompt}>
                  <Plus size={16} />
                  Selecionar cliente
                </div>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div style={styles.cartSection}>
            <h3 style={styles.sectionTitle}>
              <ShoppingCart size={18} />
              Pedido ({cart.length} itens)
            </h3>
            <Scrollbars
              style={styles.scrollContainer}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              renderThumbVertical={({ style, ...props }) => (
                <div {...props} style={{ ...style, ...styles.scrollThumb }} />
              )}
              renderTrackVertical={({ style, ...props }) => (
                <div {...props} style={{ ...style, ...styles.scrollTrack }} />
              )}
            >
              <div style={styles.cartItems}>
                {cart.length === 0 ? (
                  <div style={styles.emptyCart}>
                    <ShoppingCart size={32} style={{opacity: 0.3}} />
                    <span>Nenhum item no pedido</span>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartItemId} style={styles.cartItem}>
                      <div style={styles.itemDetails}>
                        <div style={styles.itemName}>{item.nome}</div>
                        <div style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {item.temSabor && (
                          <button
                            style={styles.editButton}
                            onClick={() => {
                              setSelectedItem(item);
                              setSelectedSabores(item.sabores || []);
                              setShowSaborModal(true);
                            }}
                          >
                            Editar
                          </button>
                        )}
                        <button
                          style={styles.removeButton}
                          onClick={() => handleRemoveItem(item.cartItemId)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Scrollbars>
          </div>

          {/* Totals */}
          <div style={styles.totalsSection}>
            <div style={styles.totalLine}>
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.totalLine}>
              <span>Desconto:</span>
              <span style={{color: '#ef4444'}}>- R$ {discount.toFixed(2)}</span>
            </div>
            <div style={styles.finalTotal}>
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button 
              style={styles.discountBtn}
              onClick={() => setShowDiscountModal(true)}
            >
              <Tag size={16} />
              Desconto
            </button>
            <button 
              style={styles.cancelBtn}
              onClick={handleCancel}
            >
              <X size={16} />
              Cancelar
            </button>
            <button 
              style={styles.finalizeBtn}
              onClick={handleFinalizeOrder}
            >
              <ShoppingCart size={16} />
              Finalizar
            </button>
            <button 
              style={styles.exitBtn}
              onClick={() => navigate("/")}
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        {/* Right Panel - Menu */}
        <div style={styles.rightPanel}>
          {/* Categories */}
          <div style={styles.categoriesSection}>
            <h3 style={styles.menuTitle}>Cardápio</h3>
            <div style={styles.categoryTabs}>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  style={{
                    ...styles.categoryTab,
                    ...(categoriaSelected?.id === cat.id ? styles.activeCategoryTab : {})
                  }}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <Pizza size={18} />
                  {cat.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div style={styles.productsGrid}>
            {categoriaSelected ? (
              <>
                {/* Produtos */}
                {produtos
                  .filter((prod) => prod.categoriaId === categoriaSelected.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      style={styles.productCard}
                      onClick={() => handleItemClick(item)}
                    >
                      <div style={styles.productIcon}>
                        <Pizza size={24} />
                      </div>
                      <div style={styles.productInfo}>
                        <div style={styles.productName}>{item.nome}</div>
                        <div style={styles.productPrice}>R$ {item.preco.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                
                {/* Promoções */}
                {promocoes
                  .filter((p) => p.categoriaId === categoriaSelected.id)
                  .map((p) => (
                    <div
                      key={p.id}
                      style={styles.promoCard}
                      onClick={() => handleAddPromocao(p)}
                    >
                      <div style={styles.promoIcon}>
                        <Tag size={24} />
                      </div>
                      <div style={styles.productInfo}>
                        <div style={styles.productName}>{p.nome}</div>
                        <div style={styles.promoPrice}>R$ {p.valor.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <div style={styles.selectCategoryPrompt}>
                <Pizza size={48} style={{opacity: 0.3}} />
                <span>Selecione uma categoria para ver os produtos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      {/* Modal de Cliente */}
      {showClientModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Selecionar Cliente</h3>
              <button 
                style={styles.closeButton}
                onClick={() => setShowClientModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.searchContainer}>
              <Search size={16} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Pesquisar cliente por nome..."
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            
            <div style={styles.clientsList}>
              {filteredClients.map((c) => {
                const isSelected = clienteSelected?.id === c.id;
                return (
                  <div
                    key={c.id}
                    style={{
                      ...styles.clientCard,
                      ...(isSelected ? styles.selectedClientCard : {})
                    }}
                    onClick={() => handleSetCliente(c)}
                  >
                    <div style={styles.clientCardName}>{c.nome}</div>
                    <div style={styles.clientCardInfo}>
                      <Phone size={14} />
                      {c.telefone}
                    </div>
                    <div style={styles.clientCardInfo}>
                      <MapPin size={14} />
                      {c.endereco}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sabores */}
      {showSaborModal && selectedItem && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Escolher sabores para {selectedItem.nome}</h3>
              <button 
                style={styles.closeButton}
                onClick={() => setShowSaborModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.saboresList}>
              {sabores.map((s) => (
                <label key={s.id} style={styles.saborLabel}>
                  <input
                    type="checkbox"
                    checked={selectedSabores.includes(s)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelectedSabores([...selectedSabores, s]);
                      else
                        setSelectedSabores(selectedSabores.filter(x => x !== s));
                    }}
                    style={styles.checkbox}
                  />
                  <span style={styles.saborText}>{s.nome}</span>
                </label>
              ))}
            </div>
            
            <div style={styles.modalButtons}>
              <button style={styles.modalCancelBtn} onClick={() => setShowSaborModal(false)}>
                Cancelar
              </button>
              <button style={styles.modalConfirmBtn} onClick={handleSaborApply}>
                Adicionar ao Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Desconto */}
      {showDiscountModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Aplicar Desconto</h3>
              <button 
                style={styles.closeButton}
                onClick={() => setShowDiscountModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.discountTypes}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="valor"
                  checked={discountType === "valor"}
                  onChange={() => setDiscountType("valor")}
                  style={styles.radio}
                />
                <DollarSign size={16} />
                Valor em R$
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="percent"
                  checked={discountType === "percent"}
                  onChange={() => setDiscountType("percent")}
                  style={styles.radio}
                />
                <Percent size={16} />
                Porcentagem
              </label>
            </div>
            
            <input
              type="number"
              value={discountInput}
              onChange={(e) => setDiscountInput(Number(e.target.value))}
              placeholder={discountType === "percent" ? "Digite a porcentagem" : "Digite o valor"}
              style={styles.discountInput}
            />
            
            <div style={styles.modalButtons}>
              <button style={styles.modalCancelBtn} onClick={() => setShowDiscountModal(false)}>
                Cancelar
              </button>
              <button style={styles.modalConfirmBtn} onClick={handleApplyDiscount}>
                Aplicar Desconto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sabor Promoção */}
      {showSaborPromoModal && selectedPromoItem && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Escolher sabor para {selectedPromoItem.nome}</h3>
              <button 
                style={styles.closeButton}
                onClick={() => { setShowSaborPromoModal(false); setSelectedPromoItem(null); }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.saboresList}>
              {sabores.map((s) => (
                <label key={s.id} style={styles.saborLabel}>
                  <input
                    type="radio"
                    name={`saborPromo-${selectedPromoItem.cartItemId}`}
                    checked={selectedPromoItem.selectedSabor?.id === s.id}
                    onChange={() =>
                      setSelectedPromoItem({ ...selectedPromoItem, selectedSabor: s })
                    }
                    style={styles.radio}
                  />
                  <span style={styles.saborText}>{s.nome}</span>
                </label>
              ))}
            </div>
            
            <div style={styles.modalButtons}>
              <button 
                style={styles.modalCancelBtn} 
                onClick={() => { setShowSaborPromoModal(false); setSelectedPromoItem(null); }}
              >
                Cancelar
              </button>
              <button style={styles.modalConfirmBtn} onClick={handlePromoSaborApply}>
                Adicionar
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
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#ffffff"
  },
  editButton: {
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    border: "none",
    backgroundColor: "#FBBF24",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  
  header: {
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
    padding: "16px 24px",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
  },
  
  categoriesSection: {
    marginBottom: "20px"
  },
  
  menuTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#f1f5f9"
  },
  
  categoryTabs: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  
  categoryTab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "rgba(51, 65, 85, 0.6)",
    color: "#cbd5e1",
    minWidth: "120px",
    justifyContent: "center"
  },
  
  activeCategoryTab: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
    transform: "translateY(-2px)"
  },
  
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    overflowY: "auto",
    flex: 1,
    padding: "4px"
  },
  
  productCard: {
    background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))",
    border: "1px solid rgba(71, 85, 105, 0.3)",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    minHeight: "100px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
  },
  
  promoCard: {
    background: "linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    minHeight: "100px",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)"
  },
  
  productIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },
  
  promoIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },
  
  productInfo: {
    textAlign: "center",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "4px"
  },
  
  productName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#e2e8f0",
    lineHeight: "1.3"
  },
  
  productPrice: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#10b981"
  },
  
  promoPrice: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#10b981"
  },
  
  selectCategoryPrompt: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    color: "#64748b",
    fontSize: "16px",
    padding: "60px 20px",
    textAlign: "center"
  },
  
  // Modal Styles
  modal: {
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
    backdropFilter: "blur(4px)"
  },
  
  modalContent: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    padding: "24px",
    borderRadius: "16px",
    minWidth: "400px",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(51, 65, 85, 0.5)"
  },
  
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(51, 65, 85, 0.5)"
  },
  
  closeButton: {
    background: "rgba(51, 65, 85, 0.8)",
    border: "none",
    borderRadius: "6px",
    color: "#cbd5e1",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease"
  },
  
  searchContainer: {
    position: "relative",
    marginBottom: "16px"
  },
  
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8"
  },
  
  searchInput: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    borderRadius: "8px",
    border: "1px solid rgba(51, 65, 85, 0.5)",
    background: "rgba(30, 41, 59, 0.8)",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none"
  },
  
  clientsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "300px",
    overflowY: "auto"
  },
  
  clientCard: {
    padding: "16px",
    border: "2px solid rgba(51, 65, 85, 0.5)",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    background: "rgba(30, 41, 59, 0.6)",
    transition: "all 0.3s ease"
  },
  
  selectedClientCard: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.1)"
  },
  
  clientCardName: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#f1f5f9"
  },
  
  clientCardInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#94a3b8"
  },
  
  saboresList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "20px"
  },
  
  saborLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "all 0.2s ease"
  },
  
  saborText: {
    color: "#e2e8f0",
    fontSize: "14px"
  },
  
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#10b981"
  },
  
  radio: {
    width: "16px",
    height: "16px",
    accentColor: "#10b981"
  },
  
  discountTypes: {
    display: "flex",
    gap: "20px",
    marginBottom: "16px"
  },
  
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#e2e8f0"
  },
  
  discountInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(51, 65, 85, 0.5)",
    background: "rgba(30, 41, 59, 0.8)",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    marginBottom: "20px"
  },
  
  modalButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end"
  },
  
  modalCancelBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid rgba(51, 65, 85, 0.5)",
    background: "rgba(51, 65, 85, 0.8)",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  
  modalConfirmBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
  },
  
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: 0
  },
  
  logo: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
  },
  
  systemInfo: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: "500"
  },
  
  mainContent: {
    display: "flex",
    height: "calc(100vh - 72px)"
  },
  
  leftPanel: {
    width: "35%",
    padding: "24px",
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(10px)",
    borderRight: "1px solid rgba(51, 65, 85, 0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  
  rightPanel: {
    width: "65%",
    padding: "24px",
    display: "flex",
    flexDirection: "column"
  },
  
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    color: "#f1f5f9"
  },
  
  clientSection: {
    background: "rgba(30, 41, 59, 0.8)",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid rgba(51, 65, 85, 0.5)"
  },
  
  clientSelector: {
    padding: "12px",
    background: "rgba(51, 65, 85, 0.6)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid rgba(71, 85, 105, 0.3)"
  },
  
  selectedClient: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  
  clientName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#e2e8f0"
  },
  
  clientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#94a3b8"
  },
  
  selectClientPrompt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "14px"
  },
  
  cartSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  
  cartItems: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minHeight: "200px"
  },
  
  emptyCart: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#64748b",
    fontSize: "14px",
    padding: "40px 20px"
  },
  
  cartItem: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(51, 65, 85, 0.5)",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease"
  },
  
  itemDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  
  itemName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#e2e8f0",
    lineHeight: "1.3"
  },
  
  itemPrice: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#10b981"
  },
  
  removeButton: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  
  totalsSection: {
    background: "rgba(30, 41, 59, 0.8)",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid rgba(51, 65, 85, 0.5)"
  },
  
  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#cbd5e1"
  },
  
  finalTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: "bold",
    paddingTop: "8px",
    borderTop: "1px solid rgba(51, 65, 85, 0.5)",
    color: "#f1f5f9"
  },
  
  actionButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px"
  },
  
  discountBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(51, 65, 85, 0.8)",
    color: "#e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  
  cancelBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(51, 65, 85, 0.8)",
    color: "#e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  
  finalizeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
  },
  
  exitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
  },
}