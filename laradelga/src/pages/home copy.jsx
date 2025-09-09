import React, { useState } from 'react';
import { Search, Plus, Printer, X, Edit, Trash2 } from 'lucide-react';

export default function PizzaOrderSystem() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showClientRegisterModal, setShowClientRegisterModal] = useState(false);
  const [showPizzaModal, setShowPizzaModal] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [pizzaSearch, setPizzaSearch] = useState('');
  
  // Estados para cadastro de cliente
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: ''
  });
  
  // Estados para cadastro de pizza
  const [newPizza, setNewPizza] = useState({
    name: '',
    price: '',
    description: ''
  });
  
  // Mock data - simula dados vindos de uma API
  const [clients] = useState([
    { id: 1, name: 'João Silva', phone: '(11) 99999-9999', address: 'Rua A, 123', neighborhood: 'Centro', city: 'São Paulo' },
    { id: 2, name: 'Maria Santos', phone: '(11) 88888-8888', address: 'Rua B, 456', neighborhood: 'Vila Nova', city: 'São Paulo' },
    { id: 3, name: 'Pedro Costa', phone: '(11) 77777-7777', address: 'Rua C, 789', neighborhood: 'Jardim', city: 'São Paulo' }
  ]);
  
  const [pizzas] = useState([
    { id: 1, name: 'Margherita', price: 35.00, description: 'Molho de tomate, mussarela, manjericão' },
    { id: 2, name: 'Pepperoni', price: 42.00, description: 'Molho de tomate, mussarela, pepperoni' },
    { id: 3, name: 'Calabresa', price: 38.00, description: 'Molho de tomate, mussarela, calabresa, cebola' },
    { id: 4, name: 'Portuguesa', price: 45.00, description: 'Molho de tomate, mussarela, presunto, ovos, cebola, azeitona' }
  ]);
  
  // Filtrar clientes baseado na pesquisa
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone.includes(clientSearch)
  );
  
  // Filtrar pizzas baseado na pesquisa
  const filteredPizzas = pizzas.filter(pizza => 
    pizza.name.toLowerCase().includes(pizzaSearch.toLowerCase())
  );
  
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setShowClientModal(false);
    setClientSearch('');
  };
  
  const handleAddPizza = (pizza, quantity = 1, size = 'Grande') => {
    const orderItem = {
      id: Date.now(),
      pizza,
      quantity,
      size,
      price: pizza.price * quantity
    };
    setOrderItems([...orderItems, orderItem]);
    setShowPizzaModal(false);
    setPizzaSearch('');
  };
  
  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };
  
  const handleRegisterClient = () => {
    if (newClient.name && newClient.phone) {
      console.log('Cadastrar cliente:', newClient);
      setNewClient({ name: '', phone: '', address: '', neighborhood: '', city: '' });
      setShowClientRegisterModal(false);
      // Aqui você integraria com sua API
      alert('Cliente cadastrado com sucesso!');
    }
  };
  
  const handleRegisterPizza = () => {
    if (newPizza.name && newPizza.price) {
      console.log('Cadastrar pizza:', newPizza);
      setNewPizza({ name: '', price: '', description: '' });
      setShowPizzaModal(false);
      // Aqui você integraria com sua API
      alert('Pizza cadastrada com sucesso!');
    }
  };
  
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price, 0);
  };
  
  const handlePrint = () => {
    if (!selectedClient || orderItems.length === 0) {
      alert('Selecione um cliente e adicione pelo menos um item ao pedido!');
      return;
    }
    
    // Aqui você implementaria a lógica de impressão
    const orderData = {
      client: selectedClient,
      items: orderItems,
      total: calculateTotal(),
      date: new Date().toLocaleString()
    };
    
    console.log('Dados do pedido para impressão:', orderData);
    alert('Pedido enviado para impressão!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainWrapper}>
        <h1 style={styles.title}>
          Sistema de Pedidos - Pizzaria
        </h1>
        
        {/* Seção Cliente */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Cliente</h2>
          
          {selectedClient ? (
            <div style={styles.clientCard}>
              <div style={styles.clientCardHeader}>
                <div>
                  <h3 style={styles.clientName}>{selectedClient.name}</h3>
                  <p style={styles.clientInfo}>{selectedClient.phone}</p>
                  <p style={styles.clientInfo}>{selectedClient.address}</p>
                  <p style={styles.clientInfo}>{selectedClient.neighborhood}, {selectedClient.city}</p>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  style={styles.iconButton}
                  onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.buttonRow}>
              <button
                onClick={() => setShowClientModal(true)}
                style={styles.primaryButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                <Search size={20} />
                Selecionar Cliente
              </button>
              <button
                onClick={() => setShowClientRegisterModal(true)}
                style={styles.greenButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                <Plus size={20} />
              </button>
            </div>
          )}
        </div>
        
        {/* Seção Itens do Pedido */}
        <div style={styles.card}>
          <div style={styles.orderHeader}>
            <h2 style={styles.sectionTitle}>Itens do Pedido</h2>
            <button
              onClick={() => setShowPizzaModal(true)}
              style={styles.orangeButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
            >
              <Plus size={20} />
              Adicionar Pizza
            </button>
          </div>
          
          {orderItems.length === 0 ? (
            <p style={styles.emptyMessage}>Nenhum item adicionado ao pedido</p>
          ) : (
            <div style={styles.orderItemsContainer}>
              {orderItems.map((item) => (
                <div key={item.id} style={styles.orderItem}>
                  <div style={styles.orderItemContent}>
                    <h4 style={styles.orderItemTitle}>{item.pizza.name} - {item.size}</h4>
                    <p style={styles.orderItemDescription}>{item.pizza.description}</p>
                    <p style={styles.orderItemPrice}>
                      Quantidade: {item.quantity} × R$ {item.pizza.price.toFixed(2)} = R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={styles.deleteButton}
                    onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              <div style={styles.totalSection}>
                <div style={styles.totalRow}>
                  <span>Total:</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Botão Imprimir */}
        <div style={styles.centerContainer}>
          <button
            onClick={handlePrint}
            style={styles.purpleButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#9333ea'}
          >
            <Printer size={24} />
            Imprimir Pedido
          </button>
        </div>
      </div>
      
      {/* Modal Selecionar Cliente */}
      {showClientModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Selecionar Cliente</h3>
              <button
                onClick={() => setShowClientModal(false)}
                style={styles.iconButton}
                onMouseEnter={(e) => e.target.style.color = '#374151'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                <X size={24} />
              </button>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Pesquisar por nome ou telefone..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            
            <div style={styles.listContainer}>
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  style={styles.listItem}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#dbeafe'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <h4 style={{ fontWeight: '600' }}>{client.name}</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{client.phone}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{client.address}, {client.neighborhood}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Cadastrar Cliente */}
      {showClientRegisterModal && (
        <div style={styles.modal}>
          <div style={styles.modalContentSmall}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Cadastrar Cliente</h3>
              <button
                onClick={() => setShowClientRegisterModal(false)}
                style={styles.iconButton}
                onMouseEnter={(e) => e.target.style.color = '#374151'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={styles.formContainer}>
              <input
                type="text"
                placeholder="Nome *"
                value={newClient.name}
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Telefone *"
                value={newClient.phone}
                onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Endereço"
                value={newClient.address}
                onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Bairro"
                value={newClient.neighborhood}
                onChange={(e) => setNewClient({...newClient, neighborhood: e.target.value})}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Cidade"
                value={newClient.city}
                onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                style={styles.input}
              />
              
              <button
                onClick={handleRegisterClient}
                style={{...styles.input, backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                Cadastrar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Pizzas */}
      {showPizzaModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Selecionar Pizza</h3>
              <button
                onClick={() => setShowPizzaModal(false)}
                style={styles.iconButton}
                onMouseEnter={(e) => e.target.style.color = '#374151'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={styles.searchRow}>
              <input
                type="text"
                placeholder="Pesquisar pizza..."
                value={pizzaSearch}
                onChange={(e) => setPizzaSearch(e.target.value)}
                style={styles.searchInputFlex}
              />
              <button
                onClick={() => {
                  setNewPizza({ name: '', price: '', description: '' });
                }}
                style={{...styles.smallButton, backgroundColor: '#10b981', color: 'white'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                title="Cadastrar nova pizza"
              >
                <Plus size={20} />
              </button>
            </div>
            
            {/* Form para cadastrar nova pizza */}
            {newPizza.name !== undefined && (
              <div style={styles.newPizzaForm}>
                <h4 style={styles.newPizzaTitle}>Cadastrar Nova Pizza</h4>
                <div style={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Nome da pizza *"
                    value={newPizza.name}
                    onChange={(e) => setNewPizza({...newPizza, name: e.target.value})}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço *"
                    value={newPizza.price}
                    onChange={(e) => setNewPizza({...newPizza, price: e.target.value})}
                    style={styles.input}
                  />
                  <textarea
                    placeholder="Descrição"
                    value={newPizza.description}
                    onChange={(e) => setNewPizza({...newPizza, description: e.target.value})}
                    style={styles.textarea}
                  />
                  <div style={styles.buttonRow2}>
                    <button
                      onClick={handleRegisterPizza}
                      style={{...styles.smallButton, backgroundColor: '#10b981', color: 'white'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                      Cadastrar
                    </button>
                    <button
                      onClick={() => setNewPizza({ name: undefined, price: '', description: '' })}
                      style={{...styles.smallButton, backgroundColor: '#6b7280', color: 'white'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div style={styles.listContainer}>
              {filteredPizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  style={styles.pizzaItem}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fed7aa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <div style={styles.pizzaItemContent}>
                    <div style={styles.pizzaItemInfo}>
                      <h4 style={styles.pizzaName}>{pizza.name}</h4>
                      <p style={styles.pizzaDescription}>{pizza.description}</p>
                      <p style={styles.pizzaPrice}>R$ {pizza.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleAddPizza(pizza)}
                      style={styles.addButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    },
    mainWrapper: {
      maxWidth: '1024px',
      margin: '0 auto'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '32px',
      textAlign: 'center'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '16px'
    },
    clientCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#f9fafb'
    },
    clientCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    clientName: {
      fontWeight: '600',
      fontSize: '1.125rem'
    },
    clientInfo: {
      color: '#6b7280'
    },
    buttonRow: {
      display: 'flex',
      gap: '8px'
    },
    primaryButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    greenButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    orangeButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f97316',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    purpleButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#9333ea',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '1.125rem',
      fontWeight: '600',
      margin: '0 auto'
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    emptyMessage: {
      color: '#6b7280',
      textAlign: 'center',
      padding: '32px 0'
    },
    orderItemsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px'
    },
    orderItemContent: {
      flex: 1
    },
    orderItemTitle: {
      fontWeight: '600'
    },
    orderItemDescription: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    orderItemPrice: {
      color: '#1f2937',
      fontWeight: '500'
    },
    totalSection: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '16px'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '1.25rem',
      fontWeight: 'bold'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
      maxWidth: '672px',
      maxHeight: '384px',
      overflowY: 'auto'
    },
    modalContentSmall: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
      maxWidth: '448px'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: '600'
    },
    searchInput: {
      width: '100%',
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      marginBottom: '16px',
      outline: 'none'
    },
    searchInputFocused: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    input: {
      width: '100%',
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none'
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    listItem: {
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    pizzaItem: {
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      transition: 'background-color 0.2s'
    },
    pizzaItemContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    pizzaItemInfo: {
      flex: 1
    },
    pizzaName: {
      fontWeight: '600'
    },
    pizzaDescription: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    pizzaPrice: {
      color: '#f97316',
      fontWeight: '500'
    },
    addButton: {
      backgroundColor: '#f97316',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginLeft: '16px'
    },
    newPizzaForm: {
      marginBottom: '24px',
      padding: '16px',
      border: '1px solid #d1fae5',
      borderRadius: '8px',
      backgroundColor: '#f0fdf4'
    },
    newPizzaTitle: {
      fontWeight: '600',
      marginBottom: '12px'
    },
    formRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      height: '80px',
      resize: 'none',
      outline: 'none'
    },
    buttonRow2: {
      display: 'flex',
      gap: '8px'
    },
    smallButton: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    searchRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px'
    },
    searchInputFlex: {
      flex: 1,
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none'
    },
    iconButton: {
      color: '#6b7280',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    deleteButton: {
      color: '#ef4444',
      cursor: 'pointer',
      transition: 'color 0.2s',
      marginLeft: '16px'
    },
    centerContainer: {
      textAlign: 'center'
    }
  };