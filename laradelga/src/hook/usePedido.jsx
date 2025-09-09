import { useState, useEffect } from 'react';

export function usePedidoHook() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = await window.ipcRenderer.invoke('get-all-pedidos');
      setPedidos(res);
    } finally {
      setLoading(false);
    }
  };

  const cria = async (clienteId, total, itens) => {
    const res = await window.ipcRenderer.invoke(
      "cria-pedido",
      clienteId,
      total,
      itens
    );
    setPedidos((prev) => [...prev, res]);
  };

  const edita = async (id, formData) => {
    const res = await window.ipcRenderer.invoke('edita-pedido', id, formData);
    setPedidos((prev) => prev.map((p) => (p.id === res.id ? res : p)));
  };

  const deleta = async (id) => {
    await window.ipcRenderer.invoke('deleta-pedido', id);
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => { getAll(); }, []);

  return { pedidos, cria, edita, deleta, loading };
}
