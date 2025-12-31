// controllers/pedidoController.cjs
const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


async function criaPedido(clienteId, total, itens) {

  const pedido = await prisma.pedido.create({
    data: {
      clienteId,
      total,
      itens: {
        create: itens.map(i => ({
          itemId: i.itemId,
          quantidade: i.quantidade || 1,
        })),
      },
    },
    include: {
      cliente: true,
      itens: { include: { item: true } },
    },
  });

  console.log("✅ Pedido cadastrado com sucesso:", JSON.stringify(pedido, null, 2));
  return pedido;
}

async function editaPedido(id, formData) {

  return await prisma.pedido.update({
    where: { id },
    data: formData,
  });
}

async function deletaPedido(id) {

  return await prisma.pedido.delete({ where: { id } });
}

async function getAllPedidos() {
  return await prisma.pedido.findMany({
    include: { cliente: true, itens: true },
  });
}

module.exports = { criaPedido, editaPedido, deletaPedido, getAllPedidos };
