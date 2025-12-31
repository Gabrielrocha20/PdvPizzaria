import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require2 = createRequire(import.meta.url);
const { criaCategoria, editaCategoria, deletaCategoria, getAllCategorias, getCategoriaById } = require2("../controllers/categoriaController.cjs");
const { criaSabor, editaSabor, deletaSabor, getAllSabores, getSaborById } = require2("../controllers/saborController.cjs");
const { criaPromocao, editaPromocao, deletaPromocao, getAllPromocoes, getPromocaoById } = require2("../controllers/promocaoController.cjs");
const { criaCliente, editaCliente, deletaCliente, getAllClientes, getClienteById, getPedidosCliente } = require2("../controllers/clienteController.cjs");
const { criaProduto, editaProduto, deletaProduto, getAllProdutos, getProdutoById } = require2("../controllers/produtoController.cjs");
const { imprimirPedido, getImpressoraPadrao } = require2("../controllers/printLabel.cjs");
const { criaItemSabor, deletaItemSabor, getAllItemSabor } = require2("../controllers/itemSaborController.cjs");
const { criaPromocaoItem, deletaPromocaoItem, getAllPromocaoItem, editaPromocaoItem } = require2("../controllers/promocaoItemController.cjs");
const { criaPedido, editaPedido, deletaPedido, getAllPedidos } = require2("../controllers/pedidoController.cjs");
const { criaPedidoItem, editaPedidoItem, deletaPedidoItem, getAllPedidoItem } = require2("../controllers/pedidoItemController.cjs");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
process.env.PRISMA_QUERY_ENGINE_BINARY = path.join(
  process.resourcesPath,
  ".prisma/client/query_engine-windows.dll.node"
);
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win = null;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 1020,
    height: 950,
    minHeight: 600,
    maxHeight: 950,
    minWidth: 800,
    maxWidth: 1020,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("get-all-categorias", () => getAllCategorias());
ipcMain.handle("get-categoria", (_, id) => getCategoriaById(id));
ipcMain.handle("cria-categoria", (_, formData) => criaCategoria(formData));
ipcMain.handle("edita-categoria", (_, id, formData) => editaCategoria(id, formData));
ipcMain.handle("deleta-categoria", (_, id) => deletaCategoria(id));
ipcMain.handle("get-all-sabores", () => getAllSabores());
ipcMain.handle("get-sabor", (_, id) => getSaborById(id));
ipcMain.handle("cria-sabor", (_, formData) => criaSabor(formData));
ipcMain.handle("edita-sabor", (_, id, formData) => editaSabor(id, formData));
ipcMain.handle("deleta-sabor", (_, id) => deletaSabor(id));
ipcMain.handle("get-all-promocoes", () => getAllPromocoes());
ipcMain.handle("get-promocao", (_, id) => getPromocaoById(id));
ipcMain.handle("cria-promocao", (_, formData) => criaPromocao(formData));
ipcMain.handle("edita-promocao", (_, id, formData) => editaPromocao(id, formData));
ipcMain.handle("deleta-promocao", (_, id) => deletaPromocao(id));
ipcMain.handle("get-all-clientes", () => getAllClientes());
ipcMain.handle("get-cliente", (_, id) => getClienteById(id));
ipcMain.handle("cria-cliente", (_, formData) => criaCliente(formData));
ipcMain.handle("edita-cliente", (_, id, formData) => editaCliente(id, formData));
ipcMain.handle("deleta-cliente", (_, id) => deletaCliente(id));
ipcMain.handle("get-pedidos-cliente", (_, clienteId) => getPedidosCliente(clienteId));
ipcMain.handle("get-all-produtos", () => getAllProdutos());
ipcMain.handle("get-produto", (_, id) => getProdutoById(id));
ipcMain.handle("cria-produto", (_, formData) => criaProduto(formData));
ipcMain.handle("edita-produto", (_, id, formData) => editaProduto(id, formData));
ipcMain.handle("deleta-produto", (_, id) => deletaProduto(id));
ipcMain.handle("get-all-item-sabor", () => getAllItemSabor());
ipcMain.handle("cria-item-sabor", (_, itemId, saborId) => criaItemSabor(itemId, saborId));
ipcMain.handle("deleta-item-sabor", (_, id) => deletaItemSabor(id));
ipcMain.handle("get-all-promocao-item", () => getAllPromocaoItem());
ipcMain.handle("cria-promocao-item", (_, promocaoId, itemId, quantidade = 1) => criaPromocaoItem(promocaoId, itemId, quantidade));
ipcMain.handle("edita-promocao-item", (_, id, quantidade) => editaPromocaoItem(id, quantidade));
ipcMain.handle("deleta-promocao-item", (_, id) => deletaPromocaoItem(id));
ipcMain.handle("get-all-pedidos", () => getAllPedidos());
ipcMain.handle("cria-pedido", (_, clienteId, total, itens) => criaPedido(clienteId, total, itens));
ipcMain.handle("edita-pedido", (_, id, formData) => editaPedido(id, formData));
ipcMain.handle("deleta-pedido", (_, id) => deletaPedido(id));
ipcMain.handle("get-all-pedido-item", () => getAllPedidoItem());
ipcMain.handle("cria-pedido-item", (_, pedidoId, itemId, quantidade) => criaPedidoItem(pedidoId, itemId, quantidade));
ipcMain.handle("edita-pedido-item", (_, id, formData) => editaPedidoItem(id, formData));
ipcMain.handle("deleta-pedido-item", (_, id) => deletaPedidoItem(id));
ipcMain.handle("get-impressora-padrao", async () => {
  try {
    const impressora = await getImpressoraPadrao();
    return { sucesso: true, impressora };
  } catch (erro) {
    return { sucesso: false, mensagem: erro instanceof Error ? erro.message : String(erro) };
  }
});
ipcMain.handle("imprime-pedido", (_, orderData) => imprimirPedido(orderData));
app.whenReady().then(() => {
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
