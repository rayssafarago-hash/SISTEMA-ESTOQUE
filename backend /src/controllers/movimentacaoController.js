const service = require('../services/movimentacaoService');
 
async function listar(req, res, next) {
  try { res.json(await service.listar()); }
  catch (e) { next(e); }
}
 
async function criar(req, res, next) {
  try {
    // usuario_id vem do token (req.usuario), definido pelo middleware auth.
    const dados = { ...req.body, usuario_id: req.usuario.id };
    const nova = await service.criar(dados);
    res.status(201).json(nova);
  } catch (e) { next(e); }
}
 
async function excluir(req, res, next) {
  try {
    await service.excluir(req.params.id);
    res.status(204).send();
  } catch (e) { next(e); }
}
 
async function dashboard(req, res, next) {
  try { res.json(await service.resumoDashboard()); }
  catch (e) { next(e); }
}
 
module.exports = { listar, criar, excluir, dashboard };
