import { useState, useEffect } from 'react';

export function useSabor() {
  const [sabores, setSabores] = useState([]);
  const [saborSelected, setSaborSelected] = useState(null);
  const [loading_sabor, setLoading_sabor] = useState(false);
  const [erro_sabor, setErro_sabor] = useState(null);

  const criaSabor = async (formData) => {
    setLoading_sabor(true);
    try {
      const resultado = await window.ipcRenderer.invoke('cria-sabor', formData);
      setSabores((prev) => [...prev, resultado]);
      setErro_sabor(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao criar Sabor:', err);
      setErro_sabor(err);
    } finally {
      setLoading_sabor(false);
    }
  };

  const editaSabor = async (id, formData) => {
    setLoading_sabor(true);
    try {
      const resultado = await window.ipcRenderer.invoke('edita-sabor', id, formData);
      setSabores((prev) => prev.map((s) => (s.id === resultado.id ? resultado : s)));
      setErro_sabor(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao editar Sabor:', err);
      setErro_sabor(err);
    } finally {
      setLoading_sabor(false);
    }
  };

  const deletaSabor = async (id) => {
    setLoading_sabor(true);
    try {
      const resultado = await window.ipcRenderer.invoke('deleta-sabor', id);
      setSabores((prev) => prev.filter((s) => s.id !== resultado.id));
      setErro_sabor(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao deletar Sabor:', err);
      setErro_sabor(err);
    } finally {
      setLoading_sabor(false);
    }
  };

  const getAllSabores = async () => {
    setLoading_sabor(true);
    try {
      const resultado = await window.ipcRenderer.invoke('get-all-sabores');
      setSabores(resultado);
      setErro_sabor(null);
    } catch (err) {
      console.error('Erro ao buscar Sabores:', err);
      setErro_sabor(err);
    } finally {
      setLoading_sabor(false);
    }
  };

  useEffect(() => {
    getAllSabores();
  }, []);

  return { sabores, saborSelected, setSaborSelected, loading_sabor, erro_sabor, criaSabor, editaSabor, deletaSabor, getAllSabores };
}
