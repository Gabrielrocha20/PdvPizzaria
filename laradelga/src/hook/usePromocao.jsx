import { useState, useEffect } from 'react';

export function usePromocao() {
  const [promocoes, setPromocoes] = useState([]);
  const [promocaoSelected, setPromocaoSelected] = useState(null);
  const [loading_promocao, setLoading_promocao] = useState(false);
  const [erro_promocao, setErro_promocao] = useState(null);

  const criaPromocao = async (formData) => {
    setLoading_promocao(true);
    try {
      const resultado = await window.ipcRenderer.invoke('cria-promocao', formData);
      setPromocoes((prev) => [...prev, resultado]);
      setErro_promocao(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao criar Promoção:', err);
      setErro_promocao(err);
    } finally {
      setLoading_promocao(false);
    }
  };

  const editaPromocao = async (id, formData) => {
    setLoading_promocao(true);
    try {
      const resultado = await window.ipcRenderer.invoke('edita-promocao', id, formData);
      setPromocoes((prev) => prev.map((p) => (p.id === resultado.id ? resultado : p)));
      setErro_promocao(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao editar Promoção:', err);
      setErro_promocao(err);
    } finally {
      setLoading_promocao(false);
    }
  };

  const deletaPromocao = async (id) => {
    setLoading_promocao(true);
    try {
      const resultado = await window.ipcRenderer.invoke('deleta-promocao', id);
      setPromocoes((prev) => prev.filter((p) => p.id !== resultado.id));
      setErro_promocao(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao deletar Promoção:', err);
      setErro_promocao(err);
    } finally {
      setLoading_promocao(false);
    }
  };

  const getAllPromocoes = async () => {
    setLoading_promocao(true);
    try {
      const resultado = await window.ipcRenderer.invoke('get-all-promocoes');
      setPromocoes(resultado);
      setErro_promocao(null);
    } catch (err) {
      console.error('Erro ao buscar Promoções:', err);
      setErro_promocao(err);
    } finally {
      setLoading_promocao(false);
    }
  };

  useEffect(() => {
    getAllPromocoes();
  }, []);

  return { promocoes, promocaoSelected, setPromocaoSelected, loading_promocao, erro_promocao, criaPromocao, editaPromocao, deletaPromocao, getAllPromocoes };
}
