const express = require('express');
const router = express.Router();
const pool = require('../database');
const autenticar = require('../autenticar');

// lista estoque do usuario
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM estoque WHERE usuario_id = $1 ORDER BY nome',
      [req.usuarioId]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao buscar estoque:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar estoque' });
  }
});

// cria item no estoque
router.post('/', autenticar, async (req, res) => {
  const { nome, categoria, unidade, quantidade, minimo, preco } = req.body;
  try {
    const resultado = await pool.query(
      'INSERT INTO estoque (usuario_id, nome, categoria, unidade, quantidade, minimo, preco) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.usuarioId, nome, categoria, unidade, quantidade, minimo, preco]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao criar item:', err.message);
    res.status(500).json({ erro: 'Erro ao criar item' });
  }
});

// atualiza quantidade e registra movimentacao
router.put('/:id', autenticar, async (req, res) => {
  const { quantidade, tipo } = req.body;
  try {
    // busca a quantidade atual antes de atualizar
    const itemAtual = await pool.query(
      'SELECT quantidade FROM estoque WHERE id = $1 AND usuario_id = $2',
      [req.params.id, req.usuarioId]
    );

    if (itemAtual.rows.length === 0) {
      return res.status(404).json({ erro: 'Item não encontrado' });
    }

    const quantidadeAnterior = parseFloat(itemAtual.rows[0].quantidade);

    // atualiza a quantidade
    const resultado = await pool.query(
      'UPDATE estoque SET quantidade=$1 WHERE id=$2 AND usuario_id=$3 RETURNING *',
      [quantidade, req.params.id, req.usuarioId]
    );

    // registra a movimentacao no historico
    await pool.query(
      'INSERT INTO estoque_movimentacoes (usuario_id, estoque_id, tipo, quantidade, quantidade_anterior, quantidade_nova) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.usuarioId, req.params.id, tipo || 'atualizacao', Math.abs(quantidade - quantidadeAnterior), quantidadeAnterior, quantidade]
    );

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar item:', err.message);
    res.status(500).json({ erro: 'Erro ao atualizar item' });
  }
});

// busca historico de movimentacoes de um item
router.get('/:id/historico', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM estoque_movimentacoes WHERE estoque_id = $1 AND usuario_id = $2 ORDER BY criado_em DESC LIMIT 20',
      [req.params.id, req.usuarioId]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar histórico' });
  }
});

// deleta item
router.delete('/:id', autenticar, async (req, res) => {
  try {
    await pool.query('DELETE FROM estoque WHERE id=$1 AND usuario_id=$2', [req.params.id, req.usuarioId]);
    res.json({ mensagem: 'Item deletado' });
  } catch (err) {
    console.error('Erro ao deletar item:', err.message);
    res.status(500).json({ erro: 'Erro ao deletar item' });
  }
});

module.exports = router;