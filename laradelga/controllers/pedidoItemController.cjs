// controllers/pedidoItemController.cjs
const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const DEMO_MODE = process.env.DEMO_MODE === "true";

async function criaPedidoItem(pedidoId, itemId, quantidade) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  return await prisma.pedidoItem.create({
    data: { pedidoId, itemId, quantidade },
    include: { item: true, pedido: true },
  });
}

async function editaPedidoItem(id, formData) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  return await prisma.pedidoItem.update({
    where: { id },
    data: formData,
  });
}

async function deletaPedidoItem(id) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  return await prisma.pedidoItem.delete({ where: { id } });
}

async function getAllPedidoItem() {
  return await prisma.pedidoItem.findMany({
    include: { item: true, pedido: true },
  });
}

module.exports = { criaPedidoItem, editaPedidoItem, deletaPedidoItem, getAllPedidoItem };
