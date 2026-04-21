# CampoFácil — Backend

API do app de gestão agrícola CampoFácil. Feita com Node.js, Express e PostgreSQL.

## Como rodar

```bash
npm install
node server.js
```

Roda em `http://localhost:5000`

## Configuração

Cria um arquivo `.env` na raiz com:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campofacil
DB_USER=postgres
DB_PASSWORD=suasenha

JWT_SECRET=seu_segredo_aqui

PORT=5000
```

## Banco de dados

- Instala o PostgreSQL
- Cria um banco chamado `campofacil`
- Roda o arquivo `tabelas.sql` no pgAdmin pra criar todas as tabelas

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/cadastro | Cadastro de usuário |
| POST | /api/auth/login | Login |
| GET | /api/auth/perfil | Busca perfil |
| PUT | /api/auth/perfil | Atualiza perfil |
| GET | /api/talhoes | Lista talhões |
| POST | /api/talhoes | Cria talhão |
| PUT | /api/talhoes/:id | Atualiza talhão |
| DELETE | /api/talhoes/:id | Deleta talhão |
| GET | /api/estoque | Lista estoque |
| POST | /api/estoque | Cria item |
| PUT | /api/estoque/:id | Atualiza quantidade |
| GET | /api/estoque/:id/historico | Histórico de movimentações |
| DELETE | /api/estoque/:id | Deleta item |
| GET | /api/caderno | Lista registros |
| POST | /api/caderno | Cria registro |
| DELETE | /api/caderno/:id | Deleta registro |
| GET | /api/financeiro | Lista transações |
| POST | /api/financeiro | Cria transação |
| DELETE | /api/financeiro/:id | Deleta transação |
| GET | /api/produtividade | Lista colheitas |
| POST | /api/produtividade | Registra colheita |
| DELETE | /api/produtividade/:id | Deleta colheita |

## Status

🚧 Em desenvolvimento