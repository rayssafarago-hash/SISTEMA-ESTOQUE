const pool = require('../config/db');

async function listar() {
    const[linhas]= await pool.query(
        `SELECT p.*, c.nome AS categoria_nome
        FROM produtos p
        JOIN categorias c ON c.id = p.categorias_id
        ORDER BY p.nome`
    );
    return linhas;
}

async function buscarPorId(id){
    const [linhas]= await pool.query(
        `SELECT p.*, c.nome AS categoria_nome
        FROM produtos p 
        JOIN categorias c ON c.id = p.categoria_id
        WHERE p.id = ?`,
        [id]
    );
    return linhas[0];
}

async function criar(dados){
    const {nome, descricao, preco, quantidade, estoque_minimo, categoria_id} = dados;
    const[r] = await pool.query(
        `INSERT INTO produtos
        (nome, descricao, preco, quantidade, estoque_minimo, categoria_id)
        VALUES (?,?,?,?,?,?),
        [nome, descricao, preco, quantidade, estoque_minimo, categoria_id]`
    );
    return buscarPorId(r.insertId);
}

async function atualizar(id, dados) {
    const { nome, descricao, preco, quantidade, estoque_minimo, categoria_id} = dados;
    await pool.query(
        `UPDATE produtos SET
        nome =  ?, descricao = ?, preco = ?, quantidade  = ?,
       estoque_minimo = ?, categoria_id = ?
       WHERE id = ? `,
       [nome, descricao, preco, quantidade, estoque_minimo, categoria_id, id]
    );
    return buscarPorId(id); 
}

 async function atualizarQuantidade(id, novaQuantidade){
    await pool.query(
        'UPDATE produtos SET quantidade = ? WHERE id = ?',
        [novaQuantidade, id]
    );
 }

 async function excluir(id){
    const [r] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
    return r.affectedRows > 0;
 }

 module.exports = {
    listar, buscarPorId, criar, atualizar, atualizarQuantidade, excluir
};