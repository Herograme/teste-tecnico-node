# 🔧 Troubleshooting - Coolify Deploy

## 🚨 Problemas Comuns no Coolify

### 1. ❌ Build Error: "exit code: 127"

**Erro completo:**
```
RUN npm run build
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127
```

**Causa:** Cache antigo do Docker no Coolify ou arquivos de configuração TypeScript faltando.

**Solução:** Veja o guia completo em **[SOLUCAO_EXIT_127.md](./SOLUCAO_EXIT_127.md)**

**Solução Rápida:**
1. No Coolify, ative **"No Cache"** ou **"Clean Build"** nas opções de build
2. Faça o redeploy
3. Se não funcionar, delete a aplicação e recrie do zero

---

### 2. 🚨 Gateway Timeout no Coolify

Se você está recebendo **Gateway Timeout** ao fazer requisições para a API no Coolify, siga este guia.

### 📋 Causas Comuns

1. **Banco de dados não conectado** - A aplicação tenta conectar ao PostgreSQL e timeout ocorre
2. **Variáveis de ambiente não configuradas** - Falta configurar as credenciais do banco
3. **Health check apontando para endpoint errado** - Coolify verifica endpoint que depende do DB

---

## ✅ Soluções Aplicadas

### 1. **Timeouts e Retry Configurados**

O TypeORM agora tem timeouts configurados para evitar travamentos:

- **Timeout de conexão**: 10 segundos
- **Timeout de query**: 5 segundos  
- **Retry automático**: 3 tentativas com 3 segundos de intervalo
- **Pool de conexões**: 2-10 conexões com timeout de idle

📄 Arquivo: `src/config/typeorm.config.ts`

### 2. **Health Check Endpoints**

Criamos endpoints específicos para verificar o status da aplicação:

#### `/health` - Sempre responde OK
- **Não depende do banco de dados**
- Use este endpoint para o health check do Coolify
- Retorna status da aplicação, uptime e ambiente

```bash
curl https://sua-app.coolify.app/health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2025-10-08T16:10:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

#### `/ready` - Verifica conexão com DB
- Verifica se o banco de dados está conectado
- Use para troubleshooting
- Retorna status do banco

```bash
curl https://sua-app.coolify.app/ready
```

Resposta (DB conectado):
```json
{
  "status": "ready",
  "timestamp": "2025-10-08T16:10:00.000Z",
  "database": "connected"
}
```

Resposta (DB não conectado):
```json
{
  "status": "not_ready",
  "timestamp": "2025-10-08T16:10:00.000Z",
  "database": "disconnected"
}
```

### 3. **Logging Melhorado**

A aplicação agora mostra logs detalhados na inicialização:

```
🚀 Iniciando aplicação...
📝 NODE_ENV: production
📝 PORT: 3000
📝 DB_HOST: postgres
📝 DB_PORT: 5432
📝 DB_DATABASE: myapp
✅ Aplicação NestJS criada com sucesso
✅ Pipes de validação configurados
✅ Swagger configurado
🎉 Aplicação iniciada com sucesso!
```

---

## ⚙️ Configuração no Coolify

### 1. **Variáveis de Ambiente Obrigatórias**

Configure estas variáveis no painel do Coolify:

```env
# Ambiente
NODE_ENV=production
PORT=3000

# Banco de Dados PostgreSQL
DB_HOST=postgres              # Nome do serviço PostgreSQL no Coolify
DB_PORT=5432
DB_USERNAME=seu_usuario       # Usuário do PostgreSQL
DB_PASSWORD=sua_senha_segura  # Senha do PostgreSQL
DB_DATABASE=nome_do_banco     # Nome do banco de dados
```

### 2. **Health Check Configuration**

No Coolify, configure o health check para usar o endpoint `/health`:

- **Health Check Path**: `/health`
- **Health Check Port**: `3000` (ou a porta que você configurou)
- **Health Check Interval**: `10s`
- **Health Check Timeout**: `5s`
- **Health Check Retries**: `3`

### 3. **Ordem de Inicialização**

Se você estiver usando PostgreSQL no mesmo projeto Coolify:

1. Certifique-se que o PostgreSQL está rodando **antes** da aplicação
2. Configure a dependência no Coolify (se disponível)
3. Use o nome do serviço PostgreSQL como `DB_HOST`

---

## 🐛 Debugging

### Verificar Logs da Aplicação

No Coolify, acesse os logs da aplicação e procure por:

✅ **Sucesso:**
```
🎉 Aplicação iniciada com sucesso!
🌐 Servidor rodando em: http://localhost:3000
```

❌ **Erro de conexão:**
```
❌ Erro ao iniciar aplicação: ...
💡 Verifique as variáveis de ambiente e a conexão com o banco de dados
⚠️  Aplicação iniciada em modo degradado (sem banco de dados)
```

### Testar Endpoints Manualmente

```bash
# 1. Health check (sempre deve funcionar)
curl https://sua-app.coolify.app/health

# 2. Readiness check (verifica DB)
curl https://sua-app.coolify.app/ready

# 3. Swagger (documentação)
curl https://sua-app.coolify.app/api/docs

# 4. Listar usuários (requer DB)
curl https://sua-app.coolify.app/users
```

### Verificar Conexão com PostgreSQL

Se o `/ready` retornar `"database": "disconnected"`, verifique:

1. ✅ PostgreSQL está rodando?
2. ✅ Variáveis de ambiente estão corretas?
3. ✅ `DB_HOST` aponta para o serviço correto?
4. ✅ Rede entre os containers está configurada?
5. ✅ Credenciais (`DB_USERNAME`, `DB_PASSWORD`) estão corretas?

---

## 🚀 Rebuild e Deploy

Depois de fazer as configurações:

```bash
# 1. Commit as mudanças
git add .
git commit -m "fix: adiciona timeouts e health checks para Coolify"
git push origin master

# 2. No Coolify, faça o redeploy da aplicação
# Ou configure deploy automático no push
```

---

## 📊 Monitoramento

### Endpoints Úteis

| Endpoint | Propósito | Depende do DB |
|----------|-----------|---------------|
| `/health` | Health check básico | ❌ Não |
| `/ready` | Readiness check | ✅ Sim |
| `/` | Welcome message | ❌ Não |
| `/api/docs` | Swagger docs | ❌ Não |
| `/users` | API de usuários | ✅ Sim |
| `/tasks` | API de tarefas | ✅ Sim |

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Coolify
- [ ] PostgreSQL rodando e acessível
- [ ] Health check apontando para `/health`
- [ ] Build do Docker bem-sucedido
- [ ] Aplicação responde em `/health`
- [ ] `/ready` retorna `"database": "connected"`
- [ ] Endpoints `/users` e `/tasks` funcionando

---

## 💡 Dicas Extras

1. **Use `/health` para o health check do Coolify** - Nunca use endpoints que dependem do DB
2. **Monitore os logs** - Os emojis facilitam identificar problemas rapidamente
3. **Teste localmente primeiro** - Use `docker-compose up` para testar antes do deploy
4. **Versionamento** - Use tags Git para controlar deploys no Coolify

---

## 🆘 Ainda com problemas?

Se após seguir este guia você ainda tiver problemas:

1. Verifique os logs completos no Coolify
2. Teste a conexão do PostgreSQL manualmente
3. Verifique se o firewall/security groups permitem a comunicação
4. Confira se os recursos (CPU/RAM) são suficientes

---

**Última atualização**: 2025-10-08
