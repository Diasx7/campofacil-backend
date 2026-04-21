const express = require('express');
const router = express.Router();
const pool = require('../database');
const autenticar = require('../autenticar');

router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM produtividade WHERE usuario_id = $1 ORDER BY safra DESC',
      [req.usuarioId]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao buscar produtividade:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar produtividade' });
  }
});

router.post('/', autenticar, async (req, res) => {
  const { talhao, cultura, safra, area, producao, unidade } = req.body;
  try {
    const resultado = await pool.query(
      'INSERT INTO produtividade (usuario_id, talhao, cultura, safra, area, producao, unidade) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.usuarioId, talhao, cultura, safra, area, producao, unidade]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar produtividade:', err.message);
    res.status(500).json({ erro: 'Erro ao salvar registro' });
  }
});

router.delete('/:id', autenticar, async (req, res) => {
  try {
    await pool.query('DELETE FROM produtividade WHERE id=$1 AND usuario_id=$2', [req.params.id, req.usuarioId]);
    res.json({ mensagem: 'Registro deletado' });
  } catch (err) {
    console.error('Erro ao deletar produtividade:', err.message);
    res.status(500).json({ erro: 'Erro ao deletar registro' });
  }
});

module.exports = router;