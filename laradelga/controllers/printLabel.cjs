const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const imprimirEtiqueta = (texto, formData) => {
  let conteudo = texto
  console.log("FORM", formData)
conteudo = conteudo.replaceAll(
    '{{tipo}}', formData.produto
  ).replaceAll(
    '{{base}}', formData.base
  ).replaceAll(
    '{{adicao}}', formData.adicao
  ).replaceAll(
    "{{barcode}}", formData.barcode
  ).replaceAll(
    "{{olhoLR}}", formData.olhoLR
  ).replaceAll(
    "{{estilo}}", 'UNC'
  ).replaceAll(
    "{{diametro}}", formData.diametro
  ).replaceAll(
    "{{baseReal}}", formData.baseReal
  ).replaceAll("{{radius}}", formData.curvaReal
  ).replaceAll("{{usuarioId}}", formData.usuarioId
  ).replaceAll("{{lot}}", formData.lot
  ).replaceAll("{{opc}}", formData.opc)
  if (formData.olhoLR === 'R') {
    conteudo = conteudo.replace(
      /\^LRY\^FO\d+,\d+\^GB0,32,18\^FS\^LRN/g,
      ''
    )
    conteudo = conteudo.replaceAll("^LRN","" 
    ).replaceAll("^LRY","" );
  }
  console.log(conteudo)

  const filePath = path.resolve('C:\\Temp\\etiqueta.txt');
  fs.writeFileSync(filePath, conteudo, { encoding: 'ascii' });
  exec('wmic printer where Default="TRUE" get Name', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    const lines = stdout.trim().split('\n');
    const printerName = lines[1]?.trim();
    console.log("IMPRESS", printerName)
    // ENVIA COMO RAW USANDO O PRINT DE WINDOWS
    exec(`print /D:"\\\\localhost\\${printerName}" "${filePath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Erro ao imprimir:', err);
      } else {
        console.log('Etiqueta enviada com sucesso');
      }
    });
  })
};

// imprimirEtiqueta();

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


const texto = `
^XA

^FX Top section with logo, name and address.
^CFb,20
^FO50,50^FDINI^FS
^FO50,260^FDSOLAMAX^FS
^FO230,260^FD3.25^FS
^FO320,260^FD3.00^FS
^LRY
^FO420,260^FDL^FS
^LRY^FO418,255^GB0,32,18^FS^LRN


^CFa,10
^FT450,285^A0N,40,15^FH\^FDUNC^FS
^FT520,285^A0N,40,15^FH\^FD80^FS
^CFb,20
^FX Third section with bar code.
^FO210,310^FD220^FS
^CFb,10
^FO200,340^FDTC:2.98 at1.53 Ri^FS
^FO200,360^FDLOT:LOT12321^FS
^CFA,30

^FO360,310
^GB198,10,10,B,0^FS
^BY2,3,35
^FO360,320^B2^FD5114445447^FS
^CFb,20
^FO50,425^FDSOLAMAX^FS
^FO230,425^FD3.25^FS
^FO320,425^FD3.00^FS
^LRY
^FO420,425^FDL^FS
^LRY^FO418,420^GB0,32,18^FS^LRN
^LRN
^CFa,20
^FT450,450^A0N,40,15^FH\^FDUNC^FS
^FT520,450^A0N,40,15^FH\^FD80^FS
^CFb,20
^FX Third section with bar code.
^FO210,465^FD220^FS
^CFb,10
^FO200,500^FDTC:2.98 at1.53 Ri^FS
^FO200,520^FDRadius:177.9^FS
^FO200,540^FDINDEX:1.498(ND)^FS
^FO200,570^FDGMN:30000351184^FS
^FO200,590^FDLGC:L2052^FS
^FO200,610^FDLOT:LOT12321^FS
^CFA,30

^FO360,470
^GB198,10,10,B,0^FS
^BY2,3,35
^FO360,480^B2^FD5114445447^FS

^FO375,550
^GB165,10,10,B,0^FS
^BY2,3,35

^FO375,560^B2^FD01011109^FS
^CFb,10
^FO400,630^FDMADE IN BRAZIL^FS
^FO60,610^FD01^FS


^XZ
`
const data = {
  id: 35,
  tipoBase: 'SOLAMAX',
  nomeProduto: '_',
  diametro: '80',
  base: '3.25',
  adicao: '3.00',
  curvaReal: '177.9',
  baseReal: '2.98',
  opc: '1.77',
  olhoLR: 'L(Esq.)',
  codigoBarras: '5114445447',
  usuarioId: '01',
  lot: '12312'

}
// imprimirEtiqueta(texto, data)
module.exports = { imprimirEtiqueta, getImpressoraPadrao };
