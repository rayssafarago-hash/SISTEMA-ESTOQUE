const produtoModel = require('../models/produtoModel');
const categoriaModel = require('../models/categoriaModel');
 
async function validar(dados) {
  const { nome, preco, quantidade, estoque_minimo, categoria_id } = dados;
 
  if (!nome || nome.trim().length < 2) {
    lancar('O nome do produto e obrigatorio (min. 2 letras).');
  }
  if (preco == null || isNaN(preco) || Number(preco) < 0) {
    lancar('Preco invalido.');
  }
  if (quantidade == null || isNaN(quantidade) || Number(quantidade) < 0) {
    lancar('Quantidade invalida.');
  }
  if (estoque_minimo == null || isNaN(estoque_minimo) || Number(estoque_minimo) < 0) {
    lancar('Estoque minimo invalido.');
  }
  if (!categoria_id) {
    lancar('Selecione uma categoria.');
  }
  const cat = await categoriaModel.buscarPorId(categoria_id);
  if (!cat) {
    lancar('Categoria informada nao existe.');
  }
}
 
function lancar(msg) {
  const erro = new Error(msg);
  erro.status = 400;
  throw erro;
}
 
async function listar() {
  return produtoModel.listar();
}
 
async function buscar(id) {
  const p = await produtoModel.buscarPorId(id);
  if (!p) {
    const erro = new Error('Produto nao encontrado.');
    erro.status = 404;
    throw erro;
  }
  return p;
}
 
async function criar(dados) {
  await validar(dados);
  return produtoModel.criar(dados);
}
 
async function atualizar(id, dados) {
  await buscar(id);
  await validar(dados);
  return produtoModel.atualizar(id, dados);
}
 
async function excluir(id) {
  await buscar(id);
  return produtoModel.excluir(id);
}
 
module.exports = { listar, buscar, criar, atualizar, excluir };
