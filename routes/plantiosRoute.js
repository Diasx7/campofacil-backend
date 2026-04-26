const express = require('express');
const router = express.Router();
const pool = require('../database');
const autenticar = require('../autenticar');

// lista plantios do usuario
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM plantios WHERE usuario_id = $1 ORDER BY criado_em DESC',
      [req.usuarioId]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao buscar plantios:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar plantios' });
  }
});

// salva um plantio
router.post('/', autenticar, async (req, res) => {
  const { talhao_id, talhao_nome, cultura, area, custo_total, insumos } = req.body;
  try {
    const resultado = await pool.query(
      'INSERT INTO plantios (usuario_id, talhao_id, talhao_nome, cultura, area, custo_total, insumos) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.usuarioId, talhao_id, talhao_nome, cultura, area, custo_total, JSON.stringify(insumos || [])]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar plantio:', err.message);
    res.status(500).json({ erro: 'Erro ao salvar plantio' });
  }
});

// deleta plantio
router.delete('/:id', autenticar, async (req, res) => {
  try {
    await pool.query('DELETE FROM plantios WHERE id=$1 AND usuario_id=$2', [req.params.id, req.usuarioId]);
    res.json({ mensagem: 'Plantio deletado' });
  } catch (err) {
    console.error('Erro ao deletar plantio:', err.message);
    res.status(500).json({ erro: 'Erro ao deletar plantio' });
  }
});

module.exports = router;