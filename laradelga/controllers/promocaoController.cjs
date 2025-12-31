const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEMO_MODE = process.env.DEMO_MODE === "true";

// Criar promoção
async function criaPromocao(formData) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  const { nome, descricao, valor, categoriaId } = formData;
  if (!nome || valor === undefined) {
    throw new Error("Os campos 'nome' e 'valor' são obrigatórios.");
  }

  const novaPromocao = await prisma.promocao.create({
    data: {
      nome,
      descricao,
      valor: parseFloat(valor),
      categoriaId: categoriaId || null,
    },
    include: { 
      categoria: true,
      itens: {
        include: {
          item: { select: { id: true, nome: true, preco: true } }
        }
      }
    },
  });

  console.log("✅ Promoção criada:", novaPromocao);
  return novaPromocao;
}

// Editar promoção
async function editaPromocao(id, formData) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  const { nome, descricao, valor, categoriaId } = formData;

  const promocaoEditada = await prisma.promocao.update({
    where: { id: parseInt(id) },
    data: {
      nome,
      descricao,
      valor: valor !== undefined ? parseFloat(valor) : undefined,
      categoriaId: categoriaId !== undefined ? categoriaId : undefined,
    },
    include: { 
      categoria: true,
      itens: {
        include: {
          item: { select: { id: true, nome: true, preco: true } }
        }
      }
    },
  });

  console.log("✏️ Promoção editada:", promocaoEditada);
  return promocaoEditada;
}

// Deletar promoção
async function deletaPromocao(id) {
  if (DEMO_MODE) throw new Error("🚫 Função desativada no modo DEMO.");

  const promocaoDeletada = await prisma.promocao.delete({
    where: { id: parseInt(id) },
    include: { 
      categoria: true,
      itens: {
        include: {
          item: { select: { id: true, nome: true, preco: true } }
        }
      }
    },
  });

  console.log("🗑️ Promoção deletada:", promocaoDeletada);
  return promocaoDeletada;
}

// Buscar todas promoções
async function getAllPromocoes() {
  return await prisma.promocao.findMany({
    include: { 
      categoria: true,
      itens: {
        include: {
          item: { select: { id: true, nome: true, preco: true, temSabor: true } }
        }
      }
    },
  });
}

// Buscar promoção por ID
async function getPromocaoById(id) {
  return await prisma.promocao.findUnique({
    where: { id: parseInt(id) },
    include: { 
      categoria: true,
      itens: {
        include: {
          item: { select: { id: true, nome: true, preco: true, temSabor: true } }
        }
      }
    },
  });
}

module.exports = {
  criaPromocao,
  editaPromocao,
  deletaPromocao,
  getAllPromocoes,
  getPromocaoById,
};
