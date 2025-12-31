const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function imprimirPedido(pedido) {
  const { cliente, itens, total } = pedido;

  // Pega a impressora padrão
  const getImpressora = await getImpressoraPadrao(); // retorna { nome: "POS-80", conectada: true }

  // Cria o conteúdo do pedido como string
  const linhas = [];

  const lineSeparator = "-".repeat(48);

  linhas.push(centerText("==== PEDIDO ===="));
  linhas.push(centerText(lineSeparator));

  linhas.push(leftText("Cliente:"));
  linhas.push(leftText(cliente.nome));
  linhas.push(leftText(`Telefone: ${cliente.telefone}`));
  linhas.push(leftText(`Endereco: ${cliente.endereco}`));
  linhas.push(leftText(lineSeparator));

  itens.forEach(item => {
    const nomeLimpo = item.nome.replace(/\s*\(.*?\)/g, "");
    linhas.push(formatItem(nomeLimpo, item.preco));

    if (item.sabores && item.sabores.length > 0) {
      item.sabores.forEach(sabor => {
        linhas.push(leftText(`  -> ${sabor.nome}`));
      });
    }
  });

  linhas.push(leftText(lineSeparator));
  linhas.push(formatItem("TOTAL", total, true));
  linhas.push(leftText(lineSeparator));
  linhas.push(centerText("Obrigado pela preferência!"));
  linhas.push("\n\n\n"); // espaço extra no final para cortar

  // Salva em arquivo temporário
  const arquivo = path.resolve(__dirname, "pedido.txt");
  fs.writeFileSync(arquivo, linhas.join("\n"), "ascii");

  // Envia para impressora compartilhada
  const printerPath = `\\\\127.0.0.1\\${getImpressora.nome}`;
  exec(`print /D:"${printerPath}" "${arquivo}"`, (err, stdout, stderr) => {
    if (err) console.error("Erro ao imprimir:", err);
    else console.log("Pedido enviado com sucesso para", printerPath);
  });

  // Funções auxiliares
  function leftText(text) {
    return text;
  }

  function centerText(text) {
    const max = 48;
    if (text.length >= max) return text;
    const pad = Math.floor((max - text.length) / 2);
    return " ".repeat(pad) + text;
  }

  function formatItem(nome, preco, bold = false) {
    // nome à esquerda, preço à direita
    const precoStr = `R$ ${preco.toFixed(2)}`;
    const totalLen = 48;
    const space = totalLen - nome.length - precoStr.length;
    const linha = nome + " ".repeat(space > 0 ? space : 1) + precoStr;
    return linha;
  }
}
function getImpressoraPadrao() {
  return new Promise((resolve, reject) => {
    exec('wmic printer where Default="TRUE" get Name,WorkOffline,PrinterStatus', (error, stdout, stderr) => {
      if (error) return reject(`Erro: ${error.message}`);
      if (stderr) return reject(`Stderr: ${stderr}`);

      const lines = stdout.trim().split('\n');

      if (lines.length < 2) return reject('Nenhuma impressora padrão encontrada.');

      const [_, ...dataLines] = lines;
      const data = dataLines[0].split(',');
      const printerName = data[0]?.split(' ')[0];
      let isOffline = lines[1]?.split(' ')?.length - 1;
      isOffline = lines[1]?.split(' ')[isOffline] === 'TRUE'

      resolve({
        nome: printerName,
        conectada: isOffline === false
      });
    });
  });
}

// imprimirEtiqueta(texto, data)
module.exports = { imprimirPedido, getImpressoraPadrao };
