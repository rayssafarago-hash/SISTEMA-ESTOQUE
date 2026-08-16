const pool = require('../config/db');
 
async function listar() {
  const [linhas] = await pool.query(
    'SELECT * FROM categorias ORDER BY nome'
  );
  return linhas;
}
 
async function buscarPorId(id) {
  const [linhas] = await pool.query(
    'SELECT * FROM categorias WHERE id = ?',
    [id]
  );
  return linhas[0];
}
 
async function criar({ nome, descricao }) {
  const [r] = await pool.query(
    'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
    [nome, descricao]
  );
  return { id: r.insertId, nome, descricao };
}
 
async function atualizar(id, { nome, descricao }) {
  await pool.query(
    'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
    [nome, descricao, id]
  );
  return buscarPorId(id);
}
 
async function excluir(id) {
  const [r] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
 
module.exports = { listar, buscarPorId, criar, atualizar, excluir };
