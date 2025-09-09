// controllers/itemSaborController.cjs
const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function criaItemSabor(itemId, saborId) {
  return await prisma.itemSabor.create({
    data: { itemId, saborId },
  });
}

async function deletaItemSabor(id) {
  return await prisma.itemSabor.delete({ where: { id } });
}

async function getAllItemSabor() {
  return await prisma.itemSabor.findMany({
    include: { item: true, sabor: true },
  });
}

module.exports = { criaItemSabor, deletaItemSabor, getAllItemSabor };
