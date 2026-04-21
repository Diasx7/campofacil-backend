const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database');
const autenticar = require('../autenticar');

// cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha, nome_propriedade, estado, area_total } = req.body;
  try {
    const jaExiste = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (jaExiste.rows.length > 0) {
      return res.status(400).json({ erro: 'E-mail já cadastrado' });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const resultado = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, nome_propriedade, estado, area_total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, nome_propriedade, estado, area_total',
      [nome, email, senhaCriptografada, nome_propriedade, estado, area_total]
    );
    const token = jwt.sign({ id: resultado.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario: resultado.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos' });
    }
    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos' });
    }
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nome_propriedade: usuario.nome_propriedade,
        estado: usuario.estado,
        area_total: usuario.area_total,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// atualizar perfil
router.put('/perfil', autenticar, async (req, res) => {
  const { nome, nome_propriedade, estado, area_total } = req.body;
  try {
    const resultado = await pool.query(
      'UPDATE usuarios SET nome=$1, nome_propriedade=$2, estado=$3, area_total=$4 WHERE id=$5 RETURNING id, nome, email, nome_propriedade, estado, area_total',
      [nome, nome_propriedade, estado, area_total, req.usuarioId]
    );
    res.json({ usuario: resultado.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

// buscar perfil
router.get('/perfil', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nome, email, nome_propriedade, estado, area_total FROM usuarios WHERE id=$1',
      [req.usuarioId]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar perfil' });
  }
});

module.exports = router;