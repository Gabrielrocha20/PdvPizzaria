import { useState, useEffect } from 'react';

export function usePedidoItemHook() {
  const [pedidoItens, setPedidoItens] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = await window.ipcRenderer.invoke('get-all-pedido-item');
      setPedidoItens(res);
    } finally {
      setLoading(false);
    }
  };

  const cria = async (pedidoId, itemId, quantidade) => {
    const res = await window.ipcRenderer.invoke('cria-pedido-item', pedidoId, itemId, quantidade);
    setPedidoItens((prev) => [...prev, res]);
  };

  const edita = async (id, formData) => {
    const res = await window.ipcRenderer.invoke('edita-pedido-item', id, formData);
    setPedidoItens((prev) => prev.map((pi) => (pi.id === res.id ? res : pi)));
  };

  const deleta = async (id) => {
    await window.ipcRenderer.invoke('deleta-pedido-item', id);
    setPedidoItens((prev) => prev.filter((pi) => pi.id !== id));
  };

  useEffect(() => { getAll(); }, []);

  return { pedidoItens, cria, edita, deleta, loading };
}
