import { useState, useEffect } from 'react';

export function useProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelected, setProdutoSelected] = useState(null);
  const [loading_produto, setLoading_produto] = useState(false);
  const [erro_produto, setErro_produto] = useState(null);

  const criaProduto = async (formData) => {
    setLoading_produto(true);
    try {
      const resultado = await window.ipcRenderer.invoke('cria-produto', formData);
      setProdutos((prev) => [...prev, resultado]);
      setErro_produto(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao criar Produto:', err);
      setErro_produto(err);
    } finally {
      setLoading_produto(false);
    }
  };

  const editaProduto = async (id, formData) => {
    setLoading_produto(true);
    try {
      const resultado = await window.ipcRenderer.invoke('edita-produto', id, formData);
      setProdutos((prev) => prev.map((p) => (p.id === resultado.id ? resultado : p)));
      setErro_produto(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao editar Produto:', err);
      setErro_produto(err);
    } finally {
      setLoading_produto(false);
    }
  };

  const deletaProduto = async (id) => {
    setLoading_produto(true);
    try {
      const resultado = await window.ipcRenderer.invoke('deleta-produto', id);
      setProdutos((prev) => prev.filter((p) => p.id !== resultado.id));
      setErro_produto(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao deletar Produto:', err);
      setErro_produto(err);
    } finally {
      setLoading_produto(false);
    }
  };

  const getAllProdutos = async () => {
    setLoading_produto(true);
    try {
      const resultado = await window.ipcRenderer.invoke('get-all-produtos');
      setProdutos(resultado);
      setErro_produto(null);
    } catch (err) {
      console.error('Erro ao buscar Produtos:', err);
      setErro_produto(err);
    } finally {
      setLoading_produto(false);
    }
  };

  useEffect(() => {
    getAllProdutos();
  }, []);

  return { 
    produtos, 
    produtoSelected, 
    setProdutoSelected, 
    loading_produto, 
    erro_produto, 
    criaProduto, 
    editaProduto, 
    deletaProduto, 
    getAllProdutos 
  };
}
