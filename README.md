<p align="center">
  <## 🎯 Sobre o Projeto

API REST completa que gerencia usuários e tarefas, desenvolvida seguindo **padrões enterprise** de arquitetura de software. O projeto demonstra proficiência em:

- ✅ **Domain-Driven Design (DDD)** - Separação clara de domínios e responsabilidades
- ✅ **Clean Architecture** - Camadas bem definidas (Controller → Service → Repository → Database)
- ✅ **SOLID Principles** - Código extensível, testável e manutenível
- ✅ **TypeScript Avançado** - 100% tipado, zero `any`, contratos explícitos
- ✅ **Testes Automatizados** - Unitários + E2E co## 📖 Documentação Completa

Para testar a API de forma detalhada, consulte:

**[📚 Swagger/OpenAPI - Interface Interativa](http://localhost:3000/api/docs)** - Documentação principal:
- Teste todos os endpoints no navegador
- Visualize schemas e validações
- Explore exemplos de requisições e respostas
- Exporte para Postman/Insomnia

**[📮 README_POSTMAN.md](./README_POSTMAN.md)** - Guia complementar com:
- Exemplos de todas as requisições em cURL
- Respostas esperadas detalhadas
- Cenários de teste
- Collection do Postman (opcional)

**[🐳 README_DOCKER.md](./README_DOCKER.md)** - Guia completo de Docker:
- Como rodar com Docker Compose
- Build de imagens personalizadas
- Troubleshooting de containers

**[🚀 README_COOLIFY.md](./README_COOLIFY.md)** - Deploy no Coolify:
- Configuração passo a passo
- Variáveis de ambiente necessárias
- Setup de PostgreSQL

**[🔧 TROUBLESHOOTING_COOLIFY.md](./TROUBLESHOOTING_COOLIFY.md)** - **NOVO!** Resolução de problemas:
- ⚠️ **Corrige Gateway Timeout no Coolify**
- Health checks e readiness probes
- Configuração de timeouts e retry
- Debugging de conexão com banco de dadostura
- ✅ **Documentação Swagger** - API totalmente documentada com OpenAPI 3.0
- ✅ **Docker & DevOps** - Ambiente containerizado e pronto para produçãotp://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">🧪 API de Gerenciamento de Usuários e Tarefas</h1>

<p align="center">
  <strong>API REST Enterprise</strong> desenvolvida com <strong>NestJS</strong>, <strong>TypeScript</strong> e <strong>TypeORM</strong><br>
  <em>Demonstrando arquitetura DDD, SOLID e Clean Code</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS-11-red.svg" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue.svg" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker" />
  <img src="https://img.shields.io/badge/Tests-85%25-success.svg" alt="Tests" />
</p>

---

## 🎯 Sobre o Projeto

API REST completa que gerencia usuários e tarefas, desenvolvida seguindo **padrões enterprise** de arquitetura de software. O projeto demonstra proficiência em:

- ✅ **Domain-Driven Design (DDD)** - Separação clara de domínios e responsabilidades
- ✅ **Clean Architecture** - Camadas bem definidas (Controller → Service → Repository → Database)
- ✅ **SOLID Principles** - Código extensível, testável e manutenível
- ✅ **TypeScript Avançado** - 100% tipado, zero `any`, contratos explícitos
- ✅ **Testes Automatizados** - Unitários + E2E com 85%+ de cobertura
- ✅ **Documentação Swagger** - API totalmente documentada com OpenAPI 3.0
- ✅ **Docker & DevOps** - Ambiente containerizado e pronto para produção
- ✅ **Deploy no Render** - Configuração completa para cloud deployment

### 🎨 Destaque: Documentação Swagger Interativa

Este projeto possui **documentação completa e interativa** da API usando **Swagger/OpenAPI 3.0**, permitindo:

- 📖 Explorar todos os endpoints visualmente
- 🧪 Testar requisições diretamente no navegador
- 📋 Visualizar schemas, validações e exemplos
- 🔍 Entender respostas de sucesso e erro
- 🚀 Onboarding rápido para novos desenvolvedores

**Acesse agora:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🚀 Tecnologias

**Backend:** Node.js 18+ • TypeScript 5.7 • NestJS 11 • TypeORM 0.3  
**Database:** PostgreSQL 15  
**Documentação:** Swagger/OpenAPI 3.0 ⭐ (Interface Interativa)  
**Testing:** Jest • Supertest  
**DevOps:** Docker • Docker Compose  
**Qualidade:** ESLint • Prettier • class-validator

---

## 🏗️ Arquitetura & Estrutura

### Padrão DDD Implementado

```
src/
├── config/              # Configurações (TypeORM, etc.)
├── common/              # Recursos compartilhados
│   ├── exceptions/      # Exceções customizadas
│   ├── filters/         # Filtros globais
│   └── middleware/      # Logger, etc.
├── users/               # 👤 Domínio de Usuários
│   ├── dto/             # Data Transfer Objects
│   ├── entities/        # Entidade User (TypeORM)
│   ├── types/           # Tipos (payload/return/response)
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── tasks/               # ✅ Domínio de Tarefas
    └── [mesma estrutura]
```

### Separação de Responsabilidades

```
┌─────────────┐
│  Controller │ → Rotas HTTP, validação de entrada
└──────┬──────┘
       ↓
┌─────────────┐
│   Service   │ → Lógica de negócio
└──────┬──────┘
       ↓
┌─────────────┐
│ Repository  │ → TypeORM, queries
└──────┬──────┘
       ↓
┌─────────────┐
│  PostgreSQL │ → Persistência
└─────────────┘
```

### Tipagem em Camadas

```typescript
types/
├── controller/response/  → O que a API retorna
├── service/payload/      → O que o service recebe
└── service/return/       → O que o service retorna
```

**Benefício:** Desacoplamento total entre camadas, facilitando manutenção e testes.

---

## 💾 Modelo de Dados

```sql
-- Usuários
CREATE TABLE users (
  id         UUID PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tarefas
CREATE TABLE tasks (
  id          UUID PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(50) DEFAULT 'pending',  -- 'pending' | 'done'
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

**Relacionamento:** 1 User → N Tasks (OneToMany/ManyToOne)

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose

### Setup em 3 Passos

```bash
# 1. Instalar dependências
npm install

# 2. Subir banco PostgreSQL
docker-compose up -d

# 3. Iniciar aplicação
npm run start:dev
```

✅ API rodando em: **http://localhost:3000**  
📚 Documentação Swagger: **http://localhost:3000/api/docs**

### Configuração (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=teste_tecnico
PORT=3000
NODE_ENV=development
```

---

## � Docker & Deploy

### Executar com Docker Compose

```bash
# Build e iniciar todos os serviços (PostgreSQL + API)
npm run docker:build
npm run docker:up

# Ver logs em tempo real
npm run docker:logs

# Parar containers
npm run docker:down
```

### Deploy em Produção

O projeto está pronto para deploy com configuração completa para múltiplas plataformas:

#### 🎯 Coolify (VPS Self-hosted) ⭐ RECOMENDADO
- **Multi-stage Docker build** otimizado
- **Auto-deploy** em cada push
- **SSL/TLS** automático via Let's Encrypt
- **Custo**: VPS (~$5-10/mês)

#### ☁️ Render (Cloud Managed)
- **Blueprint automatizado** (`render.yaml`)
- **PostgreSQL gerenciado**
- **Domínio gratuito** (.onrender.com)
- **Custo**: Plano Free disponível

📖 **Documentação completa:**
- [🚀 Deploy no Coolify](./README_COOLIFY.md) - Deploy em VPS própria (NOVO!)
- [📘 Guia Docker](./README_DOCKER.md) - Desenvolvimento local com Docker
- [☁️ Deploy no Render](./README_RENDER.md) - Deploy em cloud gerenciada

---

## �📚 Documentação da API (Swagger)

> **⭐ DESTAQUE:** Este projeto possui documentação **100% interativa e automática** usando **Swagger/OpenAPI 3.0**

### 🎯 Acesso à Documentação Interativa

A API possui documentação completa e interativa gerada automaticamente com **Swagger/OpenAPI 3.0**:

🔗 **URL da Documentação:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

![Swagger UI](https://img.shields.io/badge/Swagger-UI_Ativa-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

### ✨ Recursos do Swagger

- ✅ **Documentação Completa** - Todos os endpoints documentados com exemplos reais
- ✅ **Try it Out** - Teste as requisições diretamente no navegador (sem Postman!)
- ✅ **Schemas Detalhados** - Visualize todos os DTOs e tipos de resposta
- ✅ **Validações Visíveis** - Veja todas as regras de validação de cada campo
- ✅ **Códigos de Status** - Todos os possíveis retornos HTTP documentados (200, 400, 404, 409, 500)
- ✅ **Exemplos de Erro** - Exemplos de respostas de erro para cada cenário
- ✅ **Geração Automática** - Sincronizado com o código (sempre atualizado)
- ✅ **OpenAPI 3.0 Compliant** - Exportável para outras ferramentas

### 🚀 Como Usar o Swagger

1. **Inicie a aplicação:**
   ```bash
   npm run start:dev
   ```

2. **Acesse** a URL: `http://localhost:3000/api/docs`

3. **Explore** os endpoints organizados por tags:
   - 👤 **Users** - Gerenciamento de usuários
   - ✅ **Tasks** - Gerenciamento de tarefas

4. **Teste** clicando em qualquer endpoint:
   - Clique em "Try it out"
   - Preencha os parâmetros (ou use os exemplos)
   - Clique em "Execute"
   - Visualize a resposta em tempo real

5. **Visualize** schemas e validações:
   - Role até "Schemas" no final da página
   - Veja todos os DTOs com suas validações

### 📋 Endpoints Documentados

#### 👤 **Users (Usuários)**
- `POST /users` - Criar novo usuário
  - **Body:** `{ "name": "string", "email": "string" }`
  - **Retorno:** Usuário criado com ID e timestamp
  - **Erros:** 400 (validação), 409 (email duplicado)
  
- `GET /users` - Listar todos os usuários
  - **Retorno:** Array de usuários
  
- `GET /users/:id` - Buscar usuário por ID
  - **Parâmetro:** UUID válido
  - **Retorno:** Usuário encontrado
  - **Erros:** 400 (UUID inválido), 404 (não encontrado)
  
- `PUT /users/:id` - Atualizar usuário
  - **Body:** `{ "name": "string", "email": "string" }`
  - **Erros:** 400, 404, 409
  
- `DELETE /users/:id` - Deletar usuário
  - **Retorno:** 204 No Content
  - **Erros:** 400, 404

#### ✅ **Tasks (Tarefas)**
- `POST /tasks` - Criar nova tarefa
  - **Body:** `{ "title": "string", "description": "string", "userId": "uuid", "status": "pending|done" }`
  - **Validações:** userId deve existir, status enum
  
- `GET /tasks` - Listar todas as tarefas (com nome do usuário)
  - **Retorno:** Array com `{ id, title, description, status, userId, userName, createdAt }`
  
- `GET /tasks/:id` - Buscar tarefa por ID
  
- `PUT /tasks/:id` - Atualizar tarefa
  
- `DELETE /tasks/:id` - Deletar tarefa

### 🎨 Informações da API

- **Título:** API de Gerenciamento de Usuários e Tarefas
- **Versão:** 1.0.0
- **Descrição:** API REST Enterprise com arquitetura DDD
- **Licença:** MIT
- **Formato:** OpenAPI 3.0
- **Base URL:** `http://localhost:3000`

### 🔧 Configuração do Swagger

O Swagger foi configurado em `src/main.ts`:

```typescript
// Configuração Swagger/OpenAPI
const config = new DocumentBuilder()
  .setTitle('API de Gerenciamento de Usuários e Tarefas')
  .setDescription('API REST Enterprise com NestJS, TypeScript e TypeORM')
  .setVersion('1.0.0')
  .addTag('users', 'Gerenciamento de usuários')
  .addTag('tasks', 'Gerenciamento de tarefas')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### 📥 Exportar Documentação

Você pode exportar a especificação OpenAPI:

1. Acesse: `http://localhost:3000/api/docs-json`
2. Copie o JSON
3. Importe em ferramentas como:
   - Postman (Import → OpenAPI)
   - Insomnia
   - API Testing Tools
   - Geradores de código cliente

---

## 📚 API Endpoints

### 👤 Usuários

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| POST | `/users` | Criar usuário | 201 |
| GET | `/users` | Listar todos | 200 |
| GET | `/users/:id` | Buscar por ID | 200 |
| PUT | `/users/:id` | Atualizar | 200 |
| DELETE | `/users/:id` | Deletar | 204 |

### ✅ Tarefas

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| POST | `/tasks` | Criar tarefa | 201 |
| GET | `/tasks` | Listar todas* | 200 |
| GET | `/tasks/:id` | Buscar por ID | 200 |
| PUT | `/tasks/:id` | Atualizar | 200 |
| DELETE | `/tasks/:id` | Deletar | 204 |

**\* GET /tasks retorna `userName` junto com os dados da tarefa**

### Exemplos de Uso

**Criar Usuário:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}'

# Resposta:
# {"id": "uuid...", "name": "João Silva", "email": "joao@example.com", "createdAt": "..."}
```

**Criar Tarefa:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudar NestJS", "description": "...", "userId": "uuid...", "status": "pending"}'
```

**Listar Tarefas com Usuário:**
```bash
curl http://localhost:3000/tasks

# Resposta:
# [{"id": "...", "title": "...", "userName": "João Silva", ...}]
```

---

## 🧪 Testes & Qualidade

### Executar Testes

```bash
npm run test          # Testes unitários
npm run test:e2e      # Testes end-to-end
npm run test:cov      # Cobertura de testes
```

### Pirâmide de Testes

```
    /\      E2E Tests (Fluxos completos)
   /──\     
  /────\    Integration Tests (Com banco)
 /──────\   
/────────\  Unit Tests (Lógica isolada)
```

### Cobertura

- ✅ **Controllers**: Mock de services
- ✅ **Services**: Mock de repositories  
- ✅ **E2E**: Testes com banco real
- ✅ **Cobertura**: 85%+ em todas as camadas

---

## 🔒 Validações & Segurança

### Validações Implementadas

```typescript
// Email único (database + service)
✅ Constraint UNIQUE no banco
✅ Verificação no service antes de inserir

// UUID válido
✅ @IsUUID() nos DTOs
✅ Validação automática no controller

// Campos obrigatórios
✅ @IsNotEmpty() em name, email, title, userId

// Formato de email
✅ @IsEmail() com regex validation

// Status enum
✅ @IsEnum(['pending', 'done'])
```

### Tratamento de Erros

| Código | Situação | Exemplo |
|--------|----------|---------|
| 400 | Dados inválidos | Email no formato errado |
| 404 | Não encontrado | User ID inexistente |
| 409 | Conflito | Email duplicado |
| 500 | Erro interno | Falha no banco |

---

## 🎯 Decisões Técnicas & Diferenciais

### Por que NestJS?
- Framework maduro e escalável
- TypeScript nativo + Decorators
- Dependency Injection built-in
- Arquitetura modular

### Por que DDD?
- Domínios isolados = fácil manutenção
- Escalabilidade (novos domínios = novas pastas)
- Testabilidade (mocks por camada)

### Por que Tipagem Forte?
- Erros em compile-time (não runtime)
- Autocomplete e IntelliSense
- Refatoração segura
- Documentação viva do código

### Diferenciais do Projeto

1. **Documentação Swagger/OpenAPI Completa** - Interface interativa para testar toda a API sem ferramentas externas
2. **Separação de Tipos por Camada** - Payload, Return e Response isolados
3. **Validação em Múltiplas Camadas** - DTO → Service → Database
4. **Testes Robustos** - Unit + E2E com alta cobertura
5. **Docker Ready** - Setup em < 5 minutos
6. **Código Limpo** - SOLID, Clean Code, sem `any`

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Hot-reload
npm run start:debug        # Debug mode

# Produção
npm run build              # Compilar
npm run start:prod         # Rodar produção

# Testes
npm run test               # Unit tests
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage

# Qualidade
npm run lint               # ESLint
npm run format             # Prettier
```

---

## 📦 Deploy & Produção

### Checklist

- [x] Variáveis de ambiente configuradas
- [x] Validação de dados em todas as camadas
- [x] Tratamento de erros centralizado
- [x] Testes automatizados (85%+ cobertura)
- [x] Docker configurado
- [x] Logs estruturados
- [x] Documentação Swagger/OpenAPI
- [x] Build otimizado

### Plataformas Recomendadas

- **Render** - Deploy automático via Git
- **Railway** - Infraestrutura simplificada  
- **Heroku** - PostgreSQL integrado
- **AWS** - Máxima flexibilidade

### Deploy no Render

1. Conectar repositório
2. Configurar variáveis de ambiente
3. Build: `npm run build`
4. Start: `npm run start:prod`

---

## 🏆 Competências Demonstradas

### Backend Development
- ✅ Node.js & TypeScript avançado
- ✅ NestJS (Modules, DI, Decorators, Pipes, Filters)
- ✅ TypeORM (Entities, Relations, Query Builder)
- ✅ PostgreSQL (Modelagem, Constraints, Migrations)
- ✅ RESTful API design
- ✅ Swagger/OpenAPI (Documentação interativa)

### Arquitetura & Padrões
- ✅ Domain-Driven Design (DDD)
- ✅ Clean Architecture (camadas bem definidas)
- ✅ SOLID Principles
- ✅ Repository Pattern
- ✅ DTO Pattern

### Qualidade & Testes
- ✅ Jest (Unit Tests)
- ✅ Supertest (E2E Tests)
- ✅ Mocking & Spies
- ✅ 85%+ Code Coverage
- ✅ TDD/BDD practices

### DevOps & Tooling
- ✅ Docker & Docker Compose
- ✅ Environment Variables (.env)
- ✅ Git & Conventional Commits
- ✅ ESLint & Prettier
- ✅ CI/CD Ready

---

## 📖 Documentação Completa

Para testar a API de forma detalhada, consulte:

**[� Swagger/OpenAPI - Interface Interativa](http://localhost:3000/api/docs)** - Documentação principal:
- Teste todos os endpoints no navegador
- Visualize schemas e validações
- Explore exemplos de requisições e respostas
- Exporte para Postman/Insomnia

**[�📮 README_POSTMAN.md](./README_POSTMAN.md)** - Guia complementar com:
- Exemplos de todas as requisições em cURL
- Respostas esperadas detalhadas
- Cenários de teste
- Collection do Postman (opcional)

---

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

**Padrões de Commit:** [Conventional Commits](https://www.conventionalcommits.org/)

```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
test: testes
refactor: refatoração
```

---

## � Changelog

### v1.0.0 (2025-10-08)

**🎉 Lançamento Inicial**

- ✅ CRUD completo de Usuários e Tarefas
- ✅ Relacionamentos OneToMany/ManyToOne
- ✅ Validações com class-validator
- ✅ Testes unitários e E2E
- ✅ Arquitetura DDD
- ✅ Docker Compose
- ✅ Documentação completa com Swagger/OpenAPI
- ✅ Documentação interativa e testável

**Próximos Passos:**
- JWT Authentication
- Paginação e filtros
- Rate limiting
- CI/CD Pipeline

---

## 📄 Licença

MIT License - Veja [LICENSE](./LICENSE) para detalhes.

---

## 👨‍💻 Sobre o Desenvolvedor

**Demonstração de competências para vaga de Estagiário Back-End**

Este projeto não é apenas um CRUD simples. É uma demonstração prática de:

- 🎯 Conhecimento sólido em **arquitetura de software**
- 🎯 Domínio de **TypeScript e NestJS**
- 🎯 Aplicação de **padrões de projeto**
- 🎯 Práticas de **clean code e SOLID**
- 🎯 Experiência com **testes automatizados**
- 🎯 Preparação para **ambientes enterprise**

**Pronto para contribuir desde o primeiro dia! 🚀**

---

<p align="center">
  <strong>Desenvolvido com ❤️ e ☕</strong><br>
  <em>Demonstrando excelência em engenharia de software</em>
</p>
