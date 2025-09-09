import { useState, useEffect } from 'react';

export function useImpressoraPadrao() {
  const [impressora, setImpressora] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  useEffect(() => {
    async function fetchImpressora() {
      try {
        setLoading(true);
        const resposta = await window.ipcRenderer.invoke('get-impressora-padrao');
        if (resposta.sucesso) {
          setImpressora(resposta.impressora);
          setErro(null);
        } else {
          setErro(resposta.mensagem);
          setImpressora(null);
        }
      } catch (error) {
        setErro(error.message || String(error));
        setImpressora(null);
      } finally {
        setLoading(false);
      }
    }

    fetchImpressora();
  }, []);

  return { impressora, loading, erro };
}
