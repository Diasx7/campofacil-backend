const { Pool } = require('pg');
require('dotenv').config();

// configuracao da conexao com o banco
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'campofacil',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
});

// testa a conexao quando o servidor iniciar
pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message);
  } else {
    console.log('Conectado ao PostgreSQL!');
  }
});

module.exports = pool;