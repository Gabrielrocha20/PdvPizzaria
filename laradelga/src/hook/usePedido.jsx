import { useState, useEffect } from 'react';

export function usePedidoHook() {
  const [pedidos, setPedidos] = useState([]);
  const [faturamento, setFaturamento] = useState(0);
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

  const getFaturamento = async () => {
    setLoading(true);
    try {
      const res = await window.ipcRenderer.invoke('get-all-pedidos');

      // Data de hoje no formato AAAA-MM-DD
      const hoje = new Date().toISOString().split("T")[0];

      // Filtra os pedidos da data atual
      const pedidosHoje = res.filter(p => 
        new Date(p.data).toISOString().split("T")[0] === hoje
      );

      // Soma os totais
      const totalHoje = pedidosHoje.reduce((acc, p) => acc + p.total, 0);
      console.log(`Faturamento do dia (${hoje}): R$ ${totalHoje.toFixed(2)}`);

      setFaturamento(totalHoje);
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
    await getFaturamento(); // já atualiza faturamento ao criar pedido
  };

  const edita = async (id, formData) => {
    const res = await window.ipcRenderer.invoke('edita-pedido', id, formData);
    setPedidos((prev) => prev.map((p) => (p.id === res.id ? res : p)));
    await getFaturamento();
  };

  const deleta = async (id) => {
    await window.ipcRenderer.invoke('deleta-pedido', id);
    setPedidos((prev) => prev.filter((p) => p.id !== id));
    await getFaturamento();
  };

  useEffect(() => { getAll(); }, []);
  useEffect(() => { getFaturamento(); }, []);

  return { pedidos, faturamento, cria, edita, deleta, getAll, getFaturamento, loading };
}
