const movModel = require('../models/movimentacaoModel');
const produtoModel = require('../models/produtoModel');
 
async function listar() {
  return movModel.listar();
}
 
async function resumoDashboard() {
  return movModel.resumo();
}
 
async function criar({ produto_id, usuario_id, tipo, quantidade, observacao }) {
  tipo = String(tipo || '').toUpperCase();
  quantidade = Number(quantidade);
 
  if (!produto_id) lancar('Selecione um produto.');
  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') lancar('Tipo deve ser ENTRADA ou SAIDA.');
  if (!quantidade || quantidade <= 0) lancar('Quantidade deve ser maior que zero.');
 
  const produto = await produtoModel.buscarPorId(produto_id);
  if (!produto) lancar('Produto nao encontrado.', 404);
 
 
  let novoSaldo = produto.quantidade;
  if (tipo === 'ENTRADA') {
    novoSaldo += quantidade;
  } else {
    if (quantidade > produto.quantidade) {
      lancar('Saida maior que o estoque disponivel (' + produto.quantidade + ').');
    }
    novoSaldo -= quantidade;
  }
 
  const mov = await movModel.criar({ produto_id, usuario_id, tipo, quantidade, observacao });
  await produtoModel.atualizarQuantidade(produto_id, novoSaldo);
  return mov;
}
 
async function excluir(id) {
  const mov = await movModel.buscarPorId(id);
  if (!mov) lancar('Movimentacao nao encontrada.', 404);
  return movModel.excluir(id);
}
 
function lancar(msg, status = 400) {
  const erro = new Error(msg);
  erro.status = status;
  throw erro;
}
 
module.exports = { listar, criar, excluir, resumoDashboard };


