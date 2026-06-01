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
  poligono JSONB DEFAULT '[]',
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

-- tabela de movimentacoes de estoque
CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  estoque_id INTEGER REFERENCES estoque(id) ON DELETE CASCADE,
  tipo VARCHAR(20),
  quantidade DECIMAL(10,2),
  quantidade_anterior DECIMAL(10,2),
  quantidade_nova DECIMAL(10,2),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- tabela de plantios
CREATE TABLE IF NOT EXISTS plantios (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  talhao_id INTEGER,
  talhao_nome VARCHAR(100),
  cultura VARCHAR(100),
  area DECIMAL(10,2),
  custo_total DECIMAL(10,2),
  insumos JSONB,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- tabela de produtividade
CREATE TABLE IF NOT EXISTS produtividade (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  talhao VARCHAR(100),
  cultura VARCHAR(100),
  safra VARCHAR(20),
  area DECIMAL(10,2),
  producao DECIMAL(10,2),
  unidade VARCHAR(20),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- garante coluna poligono em talhoes caso tabela ja exista
ALTER TABLE talhoes ADD COLUMN IF NOT EXISTS poligono JSONB DEFAULT '[]';