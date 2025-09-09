import { useState, useEffect } from 'react';

export function useItemSaborHook() {
  const [itemSabores, setItemSabores] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = await window.ipcRenderer.invoke('get-all-item-sabor');
      setItemSabores(res);
    } finally {
      setLoading(false);
    }
  };

  const cria = async (itemId, saborId) => {
    const res = await window.ipcRenderer.invoke('cria-item-sabor', itemId, saborId);
    setItemSabores((prev) => [...prev, res]);
  };

  const deleta = async (id) => {
    await window.ipcRenderer.invoke('deleta-item-sabor', id);
    setItemSabores((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => { getAll(); }, []);

  return { itemSabores, cria, deleta, loading };
}
