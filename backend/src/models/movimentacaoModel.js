// Camada de acesso a dados (MODEL) da entidade Movimentacao.

const pool = require('../config/db');

async function listar() {
    const [linhas] = await pool.query(
        `SELECT m.*, p.nome AS produto_nome, u.nome AS usuario_nome
         FROM movimentacoes m
         JOIN produtos p ON p.id = m.produto_id
         JOIN usuarios u ON u.id = m.usuario_id
         ORDER BY m.criado_em DESC`
    );

    return linhas;
}

async function buscarPorId(id) {
    const [linhas] = await pool.query(
        `SELECT m.*, p.nome AS produto_nome, u.nome AS usuario_nome
         FROM movimentacoes m
         JOIN produtos p ON p.id = m.produto_id
         JOIN usuarios u ON u.id = m.usuario_id
         WHERE m.id = ?`,
        [id]
    );

    return linhas[0];
}

async function criar({
    produto_id,
    usuario_id,
    tipo,
    quantidade,
    observacao
}) {
    const [r] = await pool.query(
        `INSERT INTO movimentacoes
         (produto_id, usuario_id, tipo, quantidade, observacao)
         VALUES (?, ?, ?, ?, ?)`,
        [
            produto_id,
            usuario_id,
            tipo,
            quantidade,
            observacao
        ]
    );

    return buscarPorId(r.insertId);
}

async function excluir(id) {
    const [r] = await pool.query(
        'DELETE FROM movimentacoes WHERE id = ?',
        [id]
    );

    return r.affectedRows > 0;
}

// Usada pela dashboard: totais gerais do estoque.
async function resumo() {
    const [[totProdutos]] = await pool.query(
        'SELECT COUNT(*) AS total FROM produtos'
    );

    const [[totCategorias]] = await pool.query(
        'SELECT COUNT(*) AS total FROM categorias'
    );

    const [[itensEstoque]] = await pool.query(
        'SELECT COALESCE(SUM(quantidade), 0) AS total FROM produtos'
    );

    const [[valorEstoque]] = await pool.query(
        'SELECT COALESCE(SUM(preco * quantidade), 0) AS total FROM produtos'
    );

    const [abaixoMinimo] = await pool.query(
        `SELECT id, nome, quantidade, estoque_minimo
         FROM produtos
         WHERE quantidade <= estoque_minimo
         ORDER BY quantidade ASC`
    );

    return {
        total_produtos: totProdutos.total,
        total_categorias: totCategorias.total,
        itens_em_estoque: itensEstoque.total,
        valor_total_estoque: Number(valorEstoque.total),
        produtos_abaixo_minimo: abaixoMinimo
    };
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    excluir,
    resumo
};