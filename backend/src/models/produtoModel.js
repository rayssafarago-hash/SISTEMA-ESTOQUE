const pool = require('../config/db');

async function listar() {
    const [linhas] = await pool.query(`
        SELECT
            p.*,
            c.nome AS categoria_nome
        FROM produtos p
        JOIN categorias c
            ON c.id = p.categoria_id
        ORDER BY p.nome
    `);

    return linhas;
}

async function buscarPorId(id) {
    const [linhas] = await pool.query(`
        SELECT
            p.*,
            c.nome AS categoria_nome
        FROM produtos p
        JOIN categorias c
            ON c.id = p.categoria_id
        WHERE p.id = ?
    `, [id]);

    return linhas[0];
}

async function criar({
    nome,
    descricao,
    preco,
    quantidade,
    estoque_minimo,
    categoria_id
}) {
    const [resultado] = await pool.query(
        `INSERT INTO produtos
        (nome, descricao, preco, quantidade, estoque_minimo, categoria_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            nome,
            descricao,
            preco,
            quantidade,
            estoque_minimo,
            categoria_id
        ]
    );

    return {
        id: resultado.insertId,
        nome,
        descricao,
        preco,
        quantidade,
        estoque_minimo,
        categoria_id
    };
}

async function atualizar(
    id,
    {
        nome,
        descricao,
        preco,
        quantidade,
        estoque_minimo,
        categoria_id
    }
) {
    await pool.query(
        `UPDATE produtos
        SET
            nome = ?,
            descricao = ?,
            preco = ?,
            quantidade = ?,
            estoque_minimo = ?,
            categoria_id = ?
        WHERE id = ?`,
        [
            nome,
            descricao,
            preco,
            quantidade,
            estoque_minimo,
            categoria_id,
            id
        ]
    );

    return buscarPorId(id);
}

async function excluir(id) {
    const [resultado] = await pool.query(
        'DELETE FROM produtos WHERE id = ?',
        [id]
    );

    return resultado.affectedRows > 0;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir
};