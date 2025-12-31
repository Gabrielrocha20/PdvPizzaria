// controllers/itemSaborController.cjs
const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const DEMO_MODE = process.env.DEMO_MODE === "true";

async function criaItemSabor(itemId, saborId) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  return await prisma.itemSabor.create({
    data: { itemId, saborId },
  });
}

async function deletaItemSabor(id) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  return await prisma.itemSabor.delete({ where: { id } });
}

async function getAllItemSabor() {
  return await prisma.itemSabor.findMany({
    include: { item: true, sabor: true },
  });
}

module.exports = { criaItemSabor, deletaItemSabor, getAllItemSabor };
