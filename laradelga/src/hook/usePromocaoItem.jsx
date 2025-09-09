import { useState, useEffect } from 'react';

export function usePromocaoItemHook() {
  const [promocaoItens, setPromocaoItens] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = await window.ipcRenderer.invoke('get-all-promocao-item');
      setPromocaoItens(res);
    } finally {
      setLoading(false);
    }
  };

  const cria = async (promocaoId, itemId, quantidade = 1) => {
    const res = await window.ipcRenderer.invoke('cria-promocao-item', promocaoId, itemId, quantidade);
    setPromocaoItens((prev) => [...prev, res]);
  };

  const edita = async (id, quantidade) => {
    const res = await window.ipcRenderer.invoke('edita-promocao-item', id, quantidade);
    setPromocaoItens((prev) => prev.map(p => p.id === id ? res : p));
  };

  const deleta = async (id) => {
    await window.ipcRenderer.invoke('deleta-promocao-item', id);
    setPromocaoItens((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => { getAll(); }, []);

  return { promocaoItens, cria, deleta, edita, loading };
}
