
# 🔗 LinkVault

> **Gerenciador inteligente de links com IA local** — salve qualquer link e deixe a IA categorizar, gerar tags e resumir automaticamente. 100% gratuito, open-source e roda na sua máquina.
>## ScreenShot 
> <img width="1920" height="899" alt="screenshot png" src="https://github.com/user-attachments/assets/d75ed931-6c5e-4d84-9df2-da7b64536f26" />



![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![Ollama](https://img.shields.io/badge/IA-Ollama%20%2B%20Llama3.2-black?style=flat-square)
![License](https://img.shields.io/badge/licença-MIT-green?style=flat-square)

---

## ✨ O que é o LinkVault?

Todo mundo salva links para "ler depois" — e nunca mais encontra quando precisa.

O LinkVault resolve isso. Você cola uma URL e o sistema:

1. **Acessa o site automaticamente** e extrai título, descrição e imagem de capa
2. **IA local (Llama 3.2)** lê o conteúdo e define a categoria
3. **Gera tags relevantes** automaticamente
4. **Escreve um resumo em 1 frase** sobre o que é aquele link

Tudo isso **sem você digitar nada** além da URL. Sem APIs pagas, sem assinaturas, sem dados saindo da sua máquina.

---

## 🚀 Funcionalidades

- 🤖 **IA local** — categorização com Ollama + Llama 3.2, roda 100% offline
- 🖼️ **Metadados automáticos** — título, descrição e imagem de qualquer URL
- 📁 **Coleções** — organize links em pastas temáticas
- ❤️ **Favoritos** — marque e filtre os links mais importantes
- 🔍 **Busca inteligente** — busca por título, tags ou resumo gerado pela IA
- 🖱️ **Contagem de cliques** — veja quantas vezes você acessou cada link
- 🔐 **Autenticação segura** — JWT + bcrypt com hash de senha
- 🐳 **Docker pronto** — sobe tudo com um único comando
- 🛡️ **Rate limiting** — proteção contra abuso da API
- ✅ **Validação de dados** — Zod em todos os endpoints

---

## 🧱 Arquitetura do projeto

```
LinkVault/
│
├── 🔵 Backend (Node.js + Express) — porta 3000
│   ├── src/
│   │   ├── app.js                      → servidor Express + middlewares
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      → registro e login
│   │   │   ├── link.controller.js      → CRUD + clique + favorito
│   │   │   └── collection.controller.js → gerenciar coleções
│   │   ├── services/
│   │   │   ├── scraper.service.js      → extrai dados dos sites (Cheerio)
│   │   │   ├── ai.service.js           → chama o Ollama, retorna categoria/tags/resumo
│   │   │   └── prisma.service.js       → conexão com banco de dados
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      → verificação do token JWT
│   │   │   ├── validate.middleware.js  → validação com Zod
│   │   │   └── error.middleware.js     → tratamento global de erros
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── link.routes.js
│   │   │   └── collection.routes.js
│   │   └── validators/
│   │       ├── auth.validator.js       → regras de email e senha
│   │       └── link.validator.js       → validação de URL
│   └── prisma/
│       ├── schema.prisma               → modelos User, Link, Collection
│       └── dev.db                      → banco SQLite local
│
└── 🟢 Frontend (React + Tailwind) — porta 80
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx           → UI principal com sidebar, grid e modal
        ├── services/
        │   └── api.js                  → Axios com interceptor JWT
        └── context/
            └── AuthContext.jsx         → estado global de autenticação
```

---

## 🔄 Fluxo de uma requisição

```
Usuário cola uma URL
        ↓
React envia POST /links para o backend
        ↓
Scraper (Cheerio) acessa o site
e extrai título, descrição e imagem
        ↓
Serviço de IA envia título + descrição
para o Ollama (modelo Llama 3.2 local)
        ↓
IA retorna JSON:
{ category, tags, summary }
        ↓
Prisma salva tudo no banco SQLite
        ↓
Frontend recebe e exibe o card
com imagem, tags, resumo e categoria
```

---

## 🛠️ Stack de tecnologias

| Camada | Tecnologia | Para que serve |
|---|---|---|
| Backend | Node.js + Express | Servidor da API REST |
| Banco de dados | SQLite + Prisma ORM | Persistência dos dados |
| IA | Ollama + Llama 3.2 | Modelo de linguagem local |
| Scraping | Axios + Cheerio | Extração de metadados |
| Autenticação | JWT + Bcrypt | Sistema de login seguro |
| Validação | Zod | Validação de esquemas |
| Rate Limiting | express-rate-limit | Proteção da API |
| Frontend | React 18 + Vite | Interface do usuário |
| Estilização | Tailwind CSS 3 | UI dark mode |
| Roteamento | React Router v6 | Navegação SPA |
| HTTP Client | Axios | Chamadas à API |
| Containers | Docker + Nginx | Deploy em produção |

---

## ⚡ Início rápido com Docker

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Ollama](https://ollama.com/download) instalado e rodando

### 1. Baixe o modelo de IA
```bash
ollama pull llama3.2
```

### 2. Clone e rode
```bash
git clone https://github.com/arcspots/linkvault.git
cd linkvault
docker-compose up --build
```

### 3. Acesse no navegador
- **App:** http://localhost
- **API:** http://localhost:3000

Pronto! Crie uma conta e comece a salvar links! 🎉

---

## 🔧 Rodando manualmente (desenvolvimento)

### Backend
```bash
cd LinkVault
npm install
npx prisma@5.22.0 migrate dev --name init
npm run dev
```

### Frontend
```bash
cd linkvault-frontend
npm install
npm run dev
```

Certifique-se de que o Ollama está rodando com `ollama serve` antes de iniciar.

---

## 📡 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| POST | /auth/register | Criar conta |
| POST | /auth/login | Login, retorna JWT |

### Links
| Método | Endpoint | Descrição |
|---|---|---|
| POST | /links | Adicionar link (IA roda aqui) |
| GET | /links | Listar links (?search= ?category= ?favorite=true) |
| PATCH | /links/:id/favorite | Alternar favorito |
| PATCH | /links/:id/click | Registrar clique |
| DELETE | /links/:id | Deletar link |

### Coleções
| Método | Endpoint | Descrição |
|---|---|---|
| POST | /collections | Criar coleção |
| GET | /collections | Listar coleções |
| DELETE | /collections/:id | Deletar coleção |

---

## 🔐 Segurança

- Senhas com hash **bcrypt** (fator de custo 12)
- Rotas protegidas com **JWT Bearer tokens** (validade de 7 dias)
- Entradas validadas com **Zod** antes de chegar nos controllers
- **Rate limiting** — 100 requisições por 15 minutos por IP
- **Middleware de erros** global que evita vazamento de stack traces

---

## 🗄️ Schema do banco de dados

```prisma
model User {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  password    String
  createdAt   DateTime     @default(now())
  links       Link[]
  collections Collection[]
}

model Link {
  id           Int         @id @default(autoincrement())
  url          String
  title        String?
  description  String?
  image        String?
  category     String?
  tags         String?
  summary      String?     ← gerado pela IA
  favorite     Boolean     @default(false)
  clicks       Int         @default(0)
  collectionId Int?
  userId       Int
  createdAt    DateTime    @default(now())
}

model Collection {
  id        Int    @id @default(autoincrement())
  name      String
  userId    Int
  links     Link[]
}
```

---

## 🤖 Como a IA funciona

O LinkVault usa o **Ollama** para rodar o **Llama 3.2** completamente na sua máquina.

Quando você salva um link, o backend envia este prompt para a IA:

```
Com base no título e descrição deste link, retorne um JSON com:
- category: uma das categorias (Technology, Finance, Design, Health, Education, Entertainment, News, Other)
- tags: array com no máximo 3 palavras-chave relevantes
- summary: uma frase descrevendo o que é esse link

Title: {título extraído}
Description: {descrição extraída}
```

A IA responde com JSON estruturado que é salvo direto no banco. **Sem OpenAI, sem chave de API, sem custo.**

---

## 🐳 Detalhes do Docker

```yaml
services:
  backend:   API Node.js na porta 3000
  frontend:  React servido pelo Nginx na porta 80
```

Os dois serviços compartilham uma rede interna. O banco SQLite é persistido via volume para sobreviver reinicializações do container.

---

## 📋 Próximos passos

- [ ] Extensão para Chrome — salvar links com 1 clique
- [ ] Suporte a PostgreSQL para produção
- [ ] Importar favoritos do navegador
- [ ] App mobile (React Native)
- [ ] Resumos em múltiplos idiomas

---

## 🧑‍💻 Autor

Desenvolvido com Node.js, React e IA local.
Sinta-se livre para abrir issues, sugerir funcionalidades ou contribuir!

---

## 📄 Licença

MIT — livre para usar, modificar e distribuir.
