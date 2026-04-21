const express = require('express');
const router = express.Router();
const pool = require('../database');
const autenticar = require('../autenticar');

// lista registros do caderno
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM caderno WHERE usuario_id = $1 ORDER BY data DESC',
      [req.usuarioId]
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar caderno' });
  }
});

// cria registro
router.post('/', autenticar, async (req, res) => {
  const { data, tipo, talhao, descricao, insumos, clima } = req.body;
  try {
    const resultado = await pool.query(
      'INSERT INTO caderno (usuario_id, data, tipo, talhao, descricao, insumos, clima) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.usuarioId, data, tipo, talhao, descricao, insumos, clima]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar registro' });
  }
});

// deleta registro
router.delete('/:id', autenticar, async (req, res) => {
  try {
    await pool.query('DELETE FROM caderno WHERE id=$1 AND usuario_id=$2', [req.params.id, req.usuarioId]);
    res.json({ mensagem: 'Registro deletado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar registro' });
  }
});

module.exports = router;