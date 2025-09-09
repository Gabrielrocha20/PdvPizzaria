// controllers/pedidoItemController.cjs
const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function criaPedidoItem(pedidoId, itemId, quantidade) {
  return await prisma.pedidoItem.create({
    data: { pedidoId, itemId, quantidade },
    include: { item: true, pedido: true },
  });
}

async function editaPedidoItem(id, formData) {
  return await prisma.pedidoItem.update({
    where: { id },
    data: formData,
  });
}

async function deletaPedidoItem(id) {
  return await prisma.pedidoItem.delete({ where: { id } });
}

async function getAllPedidoItem() {
  return await prisma.pedidoItem.findMany({
    include: { item: true, pedido: true },
  });
}

module.exports = { criaPedidoItem, editaPedidoItem, deletaPedidoItem, getAllPedidoItem };
