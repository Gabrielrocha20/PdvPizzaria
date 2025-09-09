const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function criaPromocaoItem(promocaoId, itemId, quantidade = 1) {
  return await prisma.promocaoItem.create({
    data: { promocaoId, itemId, quantidade },
  });
}

async function editaPromocaoItem(id, quantidade) {
  return await prisma.promocaoItem.update({
    where: { id },
    data: { quantidade },
  });
}

async function deletaPromocaoItem(id) {
  return await prisma.promocaoItem.delete({ where: { id } });
}

async function getAllPromocaoItem() {
  return await prisma.promocaoItem.findMany({
    include: { item: true, promocao: true },
  });
}

module.exports = { criaPromocaoItem, editaPromocaoItem, deletaPromocaoItem, getAllPromocaoItem };
