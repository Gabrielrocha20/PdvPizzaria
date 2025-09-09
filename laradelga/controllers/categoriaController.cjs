const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Criar categoria
async function criaCategoria(formData) {
  const { nome } = formData;

  if (!nome) throw new Error("O campo 'nome' é obrigatório para criar categoria.");

  const novaCategoria = await prisma.categoria.create({
    data: { nome },
  });

  console.log("✅ Categoria criada com sucesso:", novaCategoria);
  return novaCategoria;
}

// Editar categoria
async function editaCategoria(id, formData) {
  const { nome } = formData;

  if (!id) throw new Error("ID da categoria é obrigatório para edição.");

  const categoriaEditada = await prisma.categoria.update({
    where: { id: parseInt(id) },
    data: { nome },
  });

  console.log("✏️ Categoria editada com sucesso:", categoriaEditada);
  return categoriaEditada;
}

// Deletar categoria
async function deletaCategoria(id) {
  if (!id) throw new Error("ID da categoria é obrigatório para exclusão.");

  const categoriaDeletada = await prisma.categoria.delete({
    where: { id: parseInt(id) },
  });

  console.log("🗑️ Categoria deletada:", categoriaDeletada);
  return categoriaDeletada;
}

// Buscar todas as categorias
async function getAllCategorias() {
  return await prisma.categoria.findMany({
    include: { itens: true }, // cada categoria já retorna os itens
  });
}

// Buscar categoria por ID
async function getCategoriaById(id) {
  if (!id) throw new Error("ID é obrigatório para buscar categoria.");

  return await prisma.categoria.findUnique({
    where: { id: parseInt(id) },
    include: { itens: true }, // retorna a categoria e seus itens
  });
}

module.exports = {
  criaCategoria,
  editaCategoria,
  deletaCategoria,
  getAllCategorias,
  getCategoriaById,
};
