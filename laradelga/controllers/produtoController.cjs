const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Criar produto
async function criaProduto(formData) {
  const { nome, preco, categoriaId, temSabor } = formData;

  if (!nome || !preco || !categoriaId) {
    throw new Error("Preencha todos os campos obrigatórios: nome, preço e categoria.");
  }

  const novoProduto = await prisma.item.create({
    data: {
      nome,
      preco: parseFloat(preco),
      categoriaId: parseInt(categoriaId),
      temSabor: Boolean(temSabor ?? false),
    },
  });

  console.log("✅ Produto criado com sucesso:", novoProduto);
  return novoProduto;
}

// Editar produto
async function editaProduto(id, formData) {
  const { nome, preco, categoriaId, temSabor } = formData;

  if (!id) throw new Error("ID do produto é obrigatório para edição.");

  const produtoEditado = await prisma.item.update({
    where: { id: parseInt(id) },
    data: {
      nome,
      preco: parseFloat(preco),
      categoriaId: parseInt(categoriaId),
      temSabor: temSabor !== undefined ? Boolean(temSabor) : undefined,
    },
  });

  console.log("✏️ Produto editado com sucesso:", produtoEditado);
  return produtoEditado;
}

// Deletar produto
async function deletaProduto(id) {
  if (!id) throw new Error("ID do produto é obrigatório para exclusão.");

  const produtoDeletado = await prisma.item.delete({
    where: { id: parseInt(id) },
  });

  console.log("🗑️ Produto deletado:", produtoDeletado);
  return produtoDeletado;
}

// Buscar todos os produtos
async function getAllProdutos() {
  return await prisma.item.findMany({
    include: { categoria: true },
  });
}

// Buscar produto por ID
async function getProdutoById(id) {
  if (!id) throw new Error("ID é obrigatório para buscar produto.");
  return await prisma.item.findUnique({
    where: { id: parseInt(id) },
    include: { categoria: true },
  });
}

module.exports = {
  criaProduto,
  editaProduto,
  deletaProduto,
  getAllProdutos,
  getProdutoById,
};
