const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Criar cliente
async function criaCliente(formData) {
  const { nome, telefone, endereco, taxaEntrega } = formData;

  if (!nome || !telefone) {
    throw new Error("Os campos 'nome' e 'telefone' são obrigatórios.");
  }

  const novoCliente = await prisma.cliente.create({
    data: {
      nome,
      telefone,
      endereco,
      taxaEntrega: taxaEntrega ? parseFloat(taxaEntrega) : 0,
    },
  });

  console.log("✅ Cliente criado:", novoCliente);
  return novoCliente;
}

// Editar cliente
async function editaCliente(id, formData) {
  const { nome, telefone, endereco, taxaEntrega } = formData;

  const clienteEditado = await prisma.cliente.update({
    where: { id: parseInt(id) },
    data: {
      nome,
      telefone,
      endereco,
      taxaEntrega: taxaEntrega ? parseFloat(taxaEntrega) : undefined,
    },
  });

  console.log("✏️ Cliente editado:", clienteEditado);
  return clienteEditado;
}

// Deletar cliente
async function deletaCliente(id) {
  const clienteDeletado = await prisma.cliente.delete({
    where: { id: parseInt(id) },
  });

  console.log("🗑️ Cliente deletado:", clienteDeletado);
  return clienteDeletado;
}

// Buscar todos clientes
async function getAllClientes() {
  return await prisma.cliente.findMany({
    include: { pedidos: true },
  });
}

// Buscar cliente por ID
async function getClienteById(id) {
  return await prisma.cliente.findUnique({
    where: { id: parseInt(id) },
    include: { pedidos: true },
  });
}

// Buscar pedidos e total gasto de um cliente
async function getPedidosCliente(clienteId) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: parseInt(clienteId) },
    include: {
      pedidos: {
        include: {
          itens: {
            include: {
              item: true, // Para pegar o preço do item
            },
          },
        },
      },
    },
  });

  if (!cliente) return { pedidos: [], totalGasto: 0 };

  // Calcula o total gasto
  const totalGasto = cliente.pedidos.reduce((acc, pedido) => {
    const subtotal = pedido.itens.reduce((sum, pi) => sum + pi.item.preco * pi.quantidade, 0);
    return acc + subtotal;
  }, 0);

  return { pedidos: cliente.pedidos, totalGasto };
}

module.exports = {
  criaCliente,
  editaCliente,
  deletaCliente,
  getAllClientes,
  getClienteById,
  getPedidosCliente
};
