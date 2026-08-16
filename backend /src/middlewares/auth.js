const jwt = require('jsonwebtoken');
 
function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');
 
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token nao enviado.' });
  }
 
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = dados; // { id, nome, email }
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}
 
module.exports = autenticar;
