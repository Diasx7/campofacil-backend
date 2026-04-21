const jwt = require('jsonwebtoken');

// verifica se o usuario ta logado antes de acessar as rotas
function autenticar(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = dados.id;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

module.exports = autenticar;