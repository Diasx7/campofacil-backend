-- roda esse arquivo no pgAdmin pra criar todas as tabelas

-- tabela de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome_propriedade VARCHAR(150),
  estado VARCHAR(50),
  area_total DECIMAL(10,2),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- tabela de talhoes
CREATE TABLE IF NOT EXISTS talhoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  cultura VARCHAR(100),
  area DECIMAL(10,2),
  cor VARCHAR(20) DEFAULT '#639922',
  status VARCHAR(50) DEFAULT 'Planejando',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- tabela de estoque
CREATE TABLE IF NOT EXISTS estoque (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  unidade VARCHAR(20),
  quantidade DECIMAL(10,2) DEFAULT 0,
  minimo DECIMAL(10,2) DEFAULT 0,
  preco DECIMAL(10,2) DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- tabela do caderno de campo
CREATE TABLE IF NOT EXISTS caderno (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  tipo VARCHAR(50),
  talhao VARCHAR(100),
  descricao TEXT,
  insumos TEXT,
  clima VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- tabela financeira
CREATE TABLE IF NOT EXISTS financeiro (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL, -- 'gasto' ou 'receita'
  data DATE NOT NULL,
  descricao VARCHAR(200),
  categoria VARCHAR(50),
  valor DECIMAL(10,2),
  talhao VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);