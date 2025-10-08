# 🐳 Docker & Deploy - Teste Técnico Node

Este documento fornece informações sobre como usar Docker para desenvolvimento local e fazer deploy no Render.

## 📋 Estrutura de Arquivos Docker

- `Dockerfile` - Imagem Docker da aplicação NestJS (multi-stage build)
- `Dockerfile.postgres` - Imagem Docker do PostgreSQL (para Render)
- `docker-compose.yml` - Orquestração de containers (app + PostgreSQL)
- `.dockerignore` - Arquivos ignorados no build Docker
- `render.yaml` - Configuração Blueprint para deploy no Render
- `start.sh` - Script de inicialização com health check

## 🚀 Início Rápido com Docker Compose

### 1. Pré-requisitos

- Docker Desktop instalado ([Download](https://www.docker.com/products/docker-desktop))
- Git configurado

### 2. Clonar e configurar

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd teste-tecnico-node

# Copiar arquivo de ambiente
copy .env.example .env
```

### 3. Executar com Docker Compose

```bash
# Build e start dos containers
npm run docker:build
npm run docker:up

# Ou usar docker-compose diretamente
docker-compose up -d

# Verificar logs
npm run docker:logs

# Parar containers
npm run docker:down
```

### 4. Acessar a aplicação

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs
- **PostgreSQL**: localhost:5432
  - Usuário: `postgres`
  - Senha: `postgres`
  - Database: `teste_tecnico`

## 🛠️ Comandos Úteis

### NPM Scripts

```bash
# Docker Compose
npm run docker:build     # Build das imagens
npm run docker:up        # Inicia containers em background
npm run docker:down      # Para containers
npm run docker:logs      # Exibe logs em tempo real
npm run docker:restart   # Reinicia containers
npm run docker:clean     # Remove containers e volumes
```

### Docker Compose Direto

```bash
# Ver status dos containers
docker-compose ps

# Executar comandos no container da aplicação
docker-compose exec app sh

# Executar comandos no PostgreSQL
docker-compose exec postgres psql -U postgres -d teste_tecnico

# Rebuild sem cache
docker-compose build --no-cache

# Limpar tudo (containers, volumes, imagens)
docker-compose down -v --rmi all
```

### Docker Direto

```bash
# Listar containers
docker ps

# Ver logs de um container
docker logs teste-tecnico-app -f

# Entrar no shell do container
docker exec -it teste-tecnico-app sh

# Inspecionar container
docker inspect teste-tecnico-app

# Ver uso de recursos
docker stats
```

## 📦 Detalhes das Imagens Docker

### Aplicação NestJS (Multi-stage Build)

**Stage 1 - Builder**:
- Base: `node:20-alpine`
- Instala dependências
- Compila TypeScript
- Gera dist/

**Stage 2 - Production**:
- Base: `node:20-alpine`
- Copia apenas dependências de produção
- Copia build da Stage 1
- Imagem final ~150MB

### PostgreSQL

- Base: `postgres:15-alpine`
- Configurações otimizadas
- Volume persistente
- Health check integrado

## 🌍 Deploy no Render

Consulte o arquivo `README_RENDER.md` para instruções detalhadas de deploy.

### Opções de Deploy

1. **Blueprint (render.yaml)** - Recomendado
   - Deploy automatizado
   - Múltiplos serviços configurados
   - Variáveis de ambiente gerenciadas

2. **Manual**
   - Criar banco de dados PostgreSQL
   - Criar Web Service
   - Configurar variáveis manualmente

### Início Rápido Render

```bash
# 1. Commit arquivos Docker
git add Dockerfile docker-compose.yml render.yaml .dockerignore
git commit -m "Add Docker configuration"
git push

# 2. No Render Dashboard
# - New + → Blueprint
# - Conectar repositório
# - Aplicar configuração

# 3. Aguardar deploy (5-10 min)
```

## 🔧 Configuração de Variáveis de Ambiente

### Desenvolvimento Local (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=teste_tecnico
PORT=3000
NODE_ENV=development
```

### Docker Compose (.env)

```env
DB_HOST=postgres  # Nome do serviço no docker-compose
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=teste_tecnico
PORT=3000
NODE_ENV=production
```

### Render (Configurar no painel)

```env
NODE_ENV=production
PORT=3000
DB_HOST=<internal_postgres_host>
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<senha_gerada>
DB_DATABASE=teste_tecnico
```

## 🧪 Testando a Aplicação Docker

### 1. Health Check

```bash
# Via curl
curl http://localhost:3000

# Via navegador
# Abrir: http://localhost:3000
```

### 2. Testar Endpoints

```bash
# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com"}'

# Listar usuários
curl http://localhost:3000/users

# Criar tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha tarefa","description":"Descrição","userId":1}'
```

### 3. Acessar Swagger

Abra no navegador: http://localhost:3000/api/docs

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs app

# Verificar se a porta está em uso
netstat -ano | findstr :3000

# Rebuild forçado
docker-compose build --no-cache
docker-compose up -d
```

### Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps

# Ver logs do PostgreSQL
docker-compose logs postgres

# Testar conexão manualmente
docker-compose exec postgres psql -U postgres -d teste_tecnico
```

### Permissões no Linux

```bash
# Dar permissão ao script
chmod +x start.sh

# Executar como usuário correto
docker-compose up --build
```

### Limpar tudo e recomeçar

```bash
# Parar e remover tudo
docker-compose down -v --rmi all

# Rebuild do zero
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Monitoramento

### Logs em tempo real

```bash
# Todos os serviços
docker-compose logs -f

# Apenas app
docker-compose logs -f app

# Apenas PostgreSQL
docker-compose logs -f postgres

# Últimas 100 linhas
docker-compose logs --tail=100 app
```

### Recursos e Performance

```bash
# Ver uso de CPU e memória
docker stats

# Ver processos rodando
docker-compose top
```

## 🔐 Segurança

### Produção

- ✅ Use senhas fortes em produção
- ✅ Nunca commite arquivos `.env`
- ✅ Use variáveis de ambiente do Render
- ✅ Mantenha imagens atualizadas
- ✅ Limite exposição de portas

### Desenvolvimento

- ⚠️ `.env` está no `.gitignore`
- ⚠️ Senhas padrão apenas para dev local
- ⚠️ PostgreSQL não exposto publicamente

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Render Documentation](https://render.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

## 🎯 Próximos Passos

1. ✅ Docker Compose funcionando localmente
2. ✅ Deploy no Render configurado
3. 🔄 CI/CD com GitHub Actions
4. 🔄 Testes automatizados no Docker
5. 🔄 Monitoramento e alertas

---

**Última atualização**: 2025-01-08
