const express = require('express');
const router = express.Router();
const autenticar = require('../autenticar');

router.post('/', autenticar, async (req, res) => {
  const { imagemBase64, imagemTipo } = req.body;

  if (!imagemBase64) {
    return res.status(400).json({ erro: 'Imagem não fornecida' });
  }

  const prompt = `Você é um agrônomo especialista em diagnóstico de pragas e doenças em culturas brasileiras.

Analise esta imagem de uma planta/lavoura e responda APENAS com um JSON válido, sem texto antes ou depois, sem markdown:

{
  "diagnostico": "nome da praga ou doença identificada",
  "confianca": "Alta / Média / Baixa",
  "descricao": "descrição breve do problema em 2 linhas",
  "sintomas": ["sintoma 1", "sintoma 2", "sintoma 3"],
  "tratamento": ["medida 1", "medida 2", "medida 3"],
  "prevencao": ["dica 1", "dica 2"],
  "urgencia": "Imediata / Moderada / Baixa",
  "culturasAfetadas": ["cultura 1", "cultura 2"]
}

Se não for possível identificar problema, use "Não identificado" no diagnóstico.`;

  try {
    const resposta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [
            { inline_data: { mime_type: imagemTipo || 'image/jpeg', data: imagemBase64 } },
            { text: prompt }
          ]}],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1000 },
        }),
      }
    );

    if (resposta.status === 429) {
      return res.status(429).json({ erro: 'Muitas requisições. Aguarde 1 minuto.' });
    }

    const dados = await resposta.json();
    const texto = dados.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) throw new Error('Resposta vazia');

    const limpo = texto.replace(/```json|```/g, '').trim();
    const json = JSON.parse(limpo);
    res.json(json);
  } catch (err) {
    console.error('Erro no diagnóstico:', err.message);
    res.status(500).json({ erro: 'Erro ao analisar imagem' });
  }
});

module.exports = router;
