function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const mensagem = status === 500
    ? 'Erro interno no servidor.'
    : err.message;
  if (status === 500) console.error(err);
res.status(status).json({ erro: mensagem });
}
 
module.exports = errorHandler;
