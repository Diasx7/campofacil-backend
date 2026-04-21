const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const authRoutes = require('./routes/authRoute');
const talhoesRoutes = require('./routes/talhoesRoute');
const estoqueRoutes = require('./routes/estoqueRoute');
const cadernoRoutes = require('./routes/cadernoRoute');
const financeiroRoutes = require('./routes/financeiroRoute');
const produtividadeRoutes = require('./routes/produtividadeRoute');

app.use('/api/auth', authRoutes);
app.use('/api/talhoes', talhoesRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/caderno', cadernoRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/produtividade', produtividadeRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'CampoFácil API funcionando!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});