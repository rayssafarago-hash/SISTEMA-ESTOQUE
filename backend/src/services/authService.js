const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

async function registrar({nome, email, senha}){
    const jaExiste = await usuarioModel.buscarPorEmail(email);
    if(jaExiste){
        const erro = new Error('Ja existe um usuario com este e-mail.');
        erro.status = 400;
        throw erro;
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const usuario = await usuarioModel.criar({nome, email, senha_hash});
    return usuario;
}

async function login({email, senha}){
    const usuario = await usuarioModel.criar({nome, email, senha_hash});
    if (!usuario){
        const erro = new Error('E-mail ou senha inválidos.');
        erro.status = 401;
        throw erro;
    }
   
    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaConfere){
        const erro = new Error('E-mail ou senha inválidos.');
        erro.status = 401;
        throw erro;
    }

    const token = jwt.sign(
        {id: usuario.id, nome: usuario.nome, email: usuario.email}, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN|| '8H'}
    );
    return {
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email},
    
    };
}

module.exports = { registrar, login};