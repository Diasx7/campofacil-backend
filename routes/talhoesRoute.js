const express = require('express');
const router = express.Router();
const pool = require('../database');
const autenticar = require('../autenticar');

// lista todos os talhoes do usuario
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM talhoes WHERE usuario_id = $1 ORDER BY criado_em DESC',
      [req.usuarioId]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao buscar talhões:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar talhões' });
  }
});

// cria um novo talhao com poligono
router.post('/', autenticar, async (req, res) => {
  const { nome, cultura, area, cor, status, poligono } = req.body;
  try {
    const resultado = await pool.query(
      'INSERT INTO talhoes (usuario_id, nome, cultura, area, cor, status, poligono) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.usuarioId, nome, cultura, area, cor || '#639922', status || 'Planejando', JSON.stringify(poligono || [])]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao criar talhão:', err.message);
    res.status(500).json({ erro: 'Erro ao criar talhão' });
  }
});

// atualiza um talhao
router.put('/:id', autenticar, async (req, res) => {
  const { nome, cultura, area, cor, status, poligono } = req.body;
  try {
    const resultado = await pool.query(
      'UPDATE talhoes SET nome=$1, cultura=$2, area=$3, cor=$4, status=$5, poligono=$6 WHERE id=$7 AND usuario_id=$8 RETURNING *',
      [nome, cultura, area, cor, status, JSON.stringify(poligono || []), req.params.id, req.usuarioId]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar talhão:', err.message);
    res.status(500).json({ erro: 'Erro ao atualizar talhão' });
  }
});

// deleta um talhao
router.delete('/:id', autenticar, async (req, res) => {
  try {
    await pool.query('DELETE FROM talhoes WHERE id=$1 AND usuario_id=$2', [req.params.id, req.usuarioId]);
    res.json({ mensagem: 'Talhão deletado' });
  } catch (err) {
    console.error('Erro ao deletar talhão:', err.message);
    res.status(500).json({ erro: 'Erro ao deletar talhão' });
  }
});

module.exports = router;