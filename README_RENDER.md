# Deploy no Render - Guia Completo

Este guia explica como fazer o deploy da aplicação no Render usando Docker Compose ou Blueprint (render.yaml).

## 📋 Pré-requisitos

- Conta no [Render](https://render.com)
- Repositório Git com o código (GitHub, GitLab ou Bitbucket)
- Docker instalado localmente para testes (opcional)

## 🚀 Opção 1: Deploy com Docker Compose (Recomendado para desenvolvimento local)

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_segura
DB_DATABASE=teste_tecnico

# Application
PORT=3000
NODE_ENV=production
```

### 2. Construir e iniciar os serviços

```bash
# Build das imagens
docker-compose build

# Iniciar os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar os serviços
docker-compose down
```

### 3. Testar a aplicação

- API: http://localhost:3000
- Swagger: http://localhost:3000/api
- Health Check: http://localhost:3000

## 🌐 Opção 2: Deploy no Render com Blueprint (render.yaml)

### 1. Preparar o repositório

1. Faça commit de todos os arquivos:
   - `Dockerfile`
   - `Dockerfile.postgres`
   - `render.yaml`
   - `.dockerignore`

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Criar o Blueprint no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório Git
4. Selecione o branch (geralmente `main` ou `master`)
5. O Render detectará automaticamente o arquivo `render.yaml`
6. Clique em **"Apply"**

### 3. Configurar variáveis de ambiente (opcional)

O Render irá gerar automaticamente a senha do PostgreSQL. Se quiser customizar:

1. Acesse o serviço PostgreSQL criado
2. Vá em **"Environment"**
3. Adicione/edite as variáveis necessárias

### 4. Aguardar o deploy

- O Render irá construir as imagens Docker
- Primeiro o PostgreSQL será iniciado
- Depois a aplicação NestJS
- O processo pode levar 5-10 minutos

## 🌐 Opção 3: Deploy Manual no Render

### 1. Criar o banco de dados PostgreSQL

1. No Dashboard do Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `teste-tecnico-postgres`
   - **Database**: `teste_tecnico`
   - **User**: `postgres`
   - **Region**: `Oregon (US West)` (ou preferência)
   - **Plan**: `Free`
3. Clique em **"Create Database"**
4. Copie a **Internal Database URL** (será algo como `postgres://...`)

### 2. Criar o Web Service

1. Clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório Git
3. Configure:
   - **Name**: `teste-tecnico-api`
   - **Region**: `Oregon (US West)` (mesma do banco)
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Build Context Directory**: `.`
   - **Plan**: `Free`

### 3. Configurar variáveis de ambiente

Na seção **"Environment Variables"**, adicione:

```env
NODE_ENV=production
PORT=3000
DB_HOST=<internal_host_do_postgres>
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<senha_gerada_pelo_render>
DB_DATABASE=teste_tecnico
```

**Dica**: Use a "Internal Database URL" do PostgreSQL e extraia os valores:
- URL: `postgresql://postgres:senha@host:5432/teste_tecnico`
- DB_HOST: `host`
- DB_PASSWORD: `senha`

### 4. Deploy

1. Clique em **"Create Web Service"**
2. O Render irá construir e fazer deploy automaticamente
3. Aguarde o build completar (5-10 minutos)

## ✅ Verificar o Deploy

### Acessar a aplicação

Após o deploy, você receberá uma URL como:
- `https://teste-tecnico-api.onrender.com`

### Testar os endpoints

```bash
# Health check
curl https://teste-tecnico-api.onrender.com

# Swagger UI
# Acesse no navegador: https://teste-tecnico-api.onrender.com/api

# Criar usuário
curl -X POST https://teste-tecnico-api.onrender.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com"}'
```

## 🔧 Configurações Avançadas

### Habilitar Auto-Deploy

1. No Web Service, vá em **"Settings"** → **"Build & Deploy"**
2. Ative **"Auto-Deploy"**
3. Agora, cada push no branch configurado fará deploy automaticamente

### Configurar domínio customizado

1. Vá em **"Settings"** → **"Custom Domain"**
2. Adicione seu domínio
3. Configure os DNS records conforme instruído

### Monitoramento e Logs

- **Logs**: Dashboard → Service → "Logs"
- **Metrics**: Dashboard → Service → "Metrics"
- **Events**: Dashboard → Service → "Events"

### Escalar a aplicação

No plano Free, você tem:
- 512 MB RAM
- 0.1 CPU
- 750 horas/mês

Para mais recursos, upgrade para planos pagos.

## 🐛 Troubleshooting

### Build falhou

1. Verifique os logs de build no Render
2. Teste o build localmente:
   ```bash
   docker build -t teste-app .
   docker run -p 3000:3000 teste-app
   ```

### Aplicação não inicia

1. Verifique as variáveis de ambiente
2. Confirme que o PostgreSQL está rodando
3. Verifique os logs da aplicação

### Erro de conexão com banco de dados

1. Use o **Internal Database URL** (não o External)
2. Verifique se DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD estão corretos
3. Confirme que ambos os serviços estão na mesma região

### Aplicação dorme (plano Free)

No plano Free, serviços ficam inativos após 15 min sem uso:
- Primeira requisição pode levar 30-60s
- Considere usar um serviço de ping (ex: UptimeRobot)
- Ou upgrade para plano pago

## 📚 Recursos Úteis

- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🔐 Segurança

- Nunca commit arquivos `.env` com credenciais reais
- Use senhas fortes para produção
- Habilite SSL/TLS (Render fornece automaticamente)
- Configure CORS adequadamente
- Use rate limiting em produção

## 💡 Dicas

1. **Teste localmente primeiro**: Use `docker-compose up` antes de fazer deploy
2. **Use o Blueprint**: É mais fácil gerenciar múltiplos serviços
3. **Monitore os logs**: Especialmente nas primeiras horas após deploy
4. **Configure health checks**: Ajuda o Render a gerenciar restarts
5. **Use banco de dados interno**: Comunicação mais rápida entre serviços

## 📝 Checklist de Deploy

- [ ] Arquivos Docker criados (`Dockerfile`, `docker-compose.yml`)
- [ ] Arquivo `render.yaml` configurado
- [ ] `.dockerignore` criado
- [ ] Variáveis de ambiente configuradas
- [ ] Código commitado e pushed no Git
- [ ] Banco de dados PostgreSQL criado no Render
- [ ] Web Service criado no Render
- [ ] Variáveis de ambiente configuradas no Render
- [ ] Deploy executado com sucesso
- [ ] Aplicação testada (health check, endpoints)
- [ ] Swagger UI acessível
- [ ] Logs verificados

---

**Última atualização**: 2025-01-08
