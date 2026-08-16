// Regras de negocio de autenticacao: cadastro e login.
// Aqui a senha e criptografada (bcrypt) e o token JWT e gerado.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

// ==========================
// CADASTRAR USUARIO
// ==========================
async function registrar({ nome, email, senha }) {
    const jaExiste = await usuarioModel.buscarPorEmail(email);

    if (jaExiste) {
        const erro = new Error('Ja existe um usuario com este e-mail.');
        erro.status = 400;
        throw erro;
    }

    // Gera o hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Cria o usuario no banco
    const usuario = await usuarioModel.criar({
        nome,
        email,
        senha_hash
    });

    return usuario;
}


// ==========================
// LOGIN
// ==========================
async function login({ email, senha }) {

    // Procura o usuario pelo e-mail
    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario) {
        const erro = new Error('E-mail ou senha invalidos.');
        erro.status = 401;
        throw erro;
    }

    // Compara a senha digitada com o hash salvo no banco
    const senhaConfere = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaConfere) {
        const erro = new Error('E-mail ou senha invalidos.');
        erro.status = 401;
        throw erro;
    }

    // Gera o token JWT
    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '8h'
        }
    );

    // Retorna o token e os dados do usuario
    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    };
}


// Exporta as funcoes
module.exports = { registrar,login};