const express = require('express');
const router = express.Router();
const pool = require('../database');
const autenticar = require('../autenticar');

// lista transacoes do usuario
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM financeiro WHERE usuario_id = $1 ORDER BY data DESC',
      [req.usuarioId]
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar financeiro' });
  }
});

// cria transacao
router.post('/', autenticar, async (req, res) => {
  const { tipo, data, descricao, categoria, valor, talhao } = req.body;
  try {
    const resultado = await pool.query(
      'INSERT INTO financeiro (usuario_id, tipo, data, descricao, categoria, valor, talhao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.usuarioId, tipo, data, descricao, categoria, valor, talhao]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar transação' });
  }
});

// deleta transacao
router.delete('/:id', autenticar, async (req, res) => {
  try {
    await pool.query('DELETE FROM financeiro WHERE id=$1 AND usuario_id=$2', [req.params.id, req.usuarioId]);
    res.json({ mensagem: 'Transação deletada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar transação' });
  }
});

module.exports = router;