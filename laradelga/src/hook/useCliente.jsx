import { useState, useEffect } from 'react';

export function useCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelected, setClienteSelected] = useState(null);
  const [loading_cliente, setLoading_cliente] = useState(false);
  const [erro_cliente, setErro_cliente] = useState(null);

  const criaCliente = async (formData) => {
    setLoading_cliente(true);
    try {
      const resultado = await window.ipcRenderer.invoke('cria-cliente', formData);
      setClientes((prev) => [...prev, resultado]);
      setErro_cliente(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao criar Cliente:', err);
      setErro_cliente(err);
    } finally {
      setLoading_cliente(false);
    }
  };

  const editaCliente = async (id, formData) => {
    setLoading_cliente(true);
    try {
      const resultado = await window.ipcRenderer.invoke('edita-cliente', id, formData);
      setClientes((prev) => prev.map((c) => (c.id === resultado.id ? resultado : c)));
      setErro_cliente(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao editar Cliente:', err);
      setErro_cliente(err);
    } finally {
      setLoading_cliente(false);
    }
  };

  const deletaCliente = async (id) => {
    setLoading_cliente(true);
    try {
      const resultado = await window.ipcRenderer.invoke('deleta-cliente', id);
      setClientes((prev) => prev.filter((c) => c.id !== resultado.id));
      setErro_cliente(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao deletar Cliente:', err);
      setErro_cliente(err);
    } finally {
      setLoading_cliente(false);
    }
  };

  const getAllClientes = async () => {
    setLoading_cliente(true);
    try {
      const resultado = await window.ipcRenderer.invoke('get-all-clientes');
      setClientes(resultado);
      setErro_cliente(null);
    } catch (err) {
      console.error('Erro ao buscar Clientes:', err);
      setErro_cliente(err);
    } finally {
      setLoading_cliente(false);
    }
  };

  // NOVO: Buscar pedidos de um cliente específico
  const buscaPedidosCliente = async (clienteId) => {
    setLoading_cliente(true);
    try {
      const resultado = await window.ipcRenderer.invoke('get-pedidos-cliente', clienteId);
      setErro_cliente(null);
      return resultado; // retorna array de pedidos
    } catch (err) {
      console.error('Erro ao buscar pedidos do cliente:', err);
      setErro_cliente(err);
      return [];
    } finally {
      setLoading_cliente(false);
    }
  };

  useEffect(() => {
    getAllClientes();
  }, []);

  return {
    clientes,
    clienteSelected,
    setClienteSelected,
    loading_cliente,
    erro_cliente,
    criaCliente,
    editaCliente,
    deletaCliente,
    getAllClientes,
    buscaPedidosCliente, // exportando a função
  };
}
