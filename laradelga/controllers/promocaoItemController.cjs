const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const DEMO_MODE = process.env.DEMO_MODE === "true";

async function criaPromocaoItem(promocaoId, itemId, quantidade = 1) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");
  
  return await prisma.promocaoItem.create({
    data: { promocaoId, itemId, quantidade },
  });
}

async function editaPromocaoItem(id, quantidade) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");
  
  return await prisma.promocaoItem.update({
    where: { id },
    data: { quantidade },
  });
}

async function deletaPromocaoItem(id) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");
  
  return await prisma.promocaoItem.delete({ where: { id } });
}

async function getAllPromocaoItem() {
  return await prisma.promocaoItem.findMany({
    include: { item: true, promocao: true },
  });
}

module.exports = { criaPromocaoItem, editaPromocaoItem, deletaPromocaoItem, getAllPromocaoItem };
