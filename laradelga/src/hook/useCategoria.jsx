import { useState, useEffect } from 'react';

export function useCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelected, setCategoriaSelected] = useState(null);
  const [loading_categoria, setLoading_categoria] = useState(false);
  const [erro_categoria, setErro_categoria] = useState(null);

  const criaCategoria = async (formData) => {
    setLoading_categoria(true);
    try {
      const resultado = await window.ipcRenderer.invoke('cria-categoria', formData);
      setCategorias((prev) => [...prev, resultado]);
      setErro_categoria(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao criar Categoria:', err);
      setErro_categoria(err);
    } finally {
      setLoading_categoria(false);
    }
  };

  const editaCategoria = async (id, formData) => {
    setLoading_categoria(true);
    try {
      const resultado = await window.ipcRenderer.invoke('edita-categoria', id, formData);
      setCategorias((prev) => prev.map((c) => (c.id === resultado.id ? resultado : c)));
      setErro_categoria(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao editar Categoria:', err);
      setErro_categoria(err);
    } finally {
      setLoading_categoria(false);
    }
  };

  const deletaCategoria = async (id) => {
    setLoading_categoria(true);
    try {
      const resultado = await window.ipcRenderer.invoke('deleta-categoria', id);
      setCategorias((prev) => prev.filter((c) => c.id !== resultado.id));
      setErro_categoria(null);
      return resultado;
    } catch (err) {
      console.error('Erro ao deletar Categoria:', err);
      setErro_categoria(err);
    } finally {
      setLoading_categoria(false);
    }
  };

  const getAllCategorias = async () => {
    setLoading_categoria(true);
    try {
      const resultado = await window.ipcRenderer.invoke('get-all-categorias');
      setCategorias(resultado);
      setErro_categoria(null);
    } catch (err) {
      console.error('Erro ao buscar Categorias:', err);
      setErro_categoria(err);
    } finally {
      setLoading_categoria(false);
    }
  };

  useEffect(() => {
    getAllCategorias();
  }, []);

  return { categorias, categoriaSelected, setCategoriaSelected, loading_categoria, erro_categoria, criaCategoria, editaCategoria, deletaCategoria, getAllCategorias };
}
