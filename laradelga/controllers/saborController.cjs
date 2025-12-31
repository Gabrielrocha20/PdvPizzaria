const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const DEMO_MODE = process.env.DEMO_MODE === "true";

// Criar sabor
async function criaSabor(formData) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  const { nome } = formData;
  if (!nome) throw new Error("O campo 'nome' é obrigatório.");

  const novoSabor = await prisma.sabor.create({ data: { nome } });
  console.log("✅ Sabor criado:", novoSabor);
  return novoSabor;
}

// Editar sabor
async function editaSabor(id, formData) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  const { nome } = formData;
  const saborEditado = await prisma.sabor.update({
    where: { id: parseInt(id) },
    data: { nome },
  });
  console.log("✏️ Sabor editado:", saborEditado);
  return saborEditado;
}

// Deletar sabor
async function deletaSabor(id) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  const saborDeletado = await prisma.sabor.delete({
    where: { id: parseInt(id) },
  });
  console.log("🗑️ Sabor deletado:", saborDeletado);
  return saborDeletado;
}

// Buscar todos os sabores
async function getAllSabores() {
  return await prisma.sabor.findMany({ include: { itens: true } });
}

// Buscar sabor por ID
async function getSaborById(id) {
  return await prisma.sabor.findUnique({ where: { id: parseInt(id) }, include: { itens: true } });
}

module.exports = { criaSabor, editaSabor, deletaSabor, getAllSabores, getSaborById };
