# 🏥 Docker HEALTHCHECK Configurado

## ✅ O Que Foi Adicionado

Adicionei um **HEALTHCHECK** diretamente no Dockerfile, seguindo as [boas práticas do Coolify](https://coolify.io/docs/knowledge-base/health-checks).

### 📝 Configuração no Dockerfile

```dockerfile
# Stage 2: Production
FROM node:20-alpine AS production

# Instala curl para o healthcheck
RUN apk add --no-cache curl

# ... resto da configuração ...

# Healthcheck - verifica se a aplicação está respondendo
# Usa o endpoint /health que não depende do banco de dados
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
```

---

## 🎯 Parâmetros do HEALTHCHECK

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `--interval` | `10s` | Verifica a cada 10 segundos |
| `--timeout` | `5s` | Timeout de 5 segundos por verificação |
| `--start-period` | `30s` | Aguarda 30s antes de começar (tempo para app iniciar) |
| `--retries` | `3` | Falha após 3 tentativas consecutivas |

### 📊 Como Funciona

```
Container inicia
↓
Aguarda 30 segundos (start-period)
↓
A cada 10 segundos (interval):
  ├─ Executa: curl -f http://localhost:3000/health
  ├─ Timeout: 5 segundos
  ├─ Se falhar: conta como 1 falha
  └─ Se 3 falhas consecutivas (retries): marca container como unhealthy
```

---

## 🔍 Por Que Usar `/health`?

O endpoint `/health` foi criado especificamente para não depender do banco de dados:

```typescript
// src/app.controller.ts
@Get('health')
healthCheck(): object {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };
}
```

**Vantagens:**
- ✅ Responde SEMPRE, mesmo se o banco estiver offline
- ✅ Resposta rápida (não faz queries)
- ✅ Mostra que a aplicação Node.js está funcionando

---

## 🚀 Como Funciona no Coolify

### Antes (Sem HEALTHCHECK no Dockerfile)

Coolify precisava configurar manualmente:
- Health Check Path: `/health`
- Health Check Port: `3000`
- Health Check Interval: etc...

**Problema:** Se configurado errado, mostrava "Degraded"

### Agora (Com HEALTHCHECK no Dockerfile)

O Docker **automaticamente** verifica a saúde:
- ✅ Container marca status como `healthy` ou `unhealthy`
- ✅ Coolify lê o status do Docker
- ✅ Menos configuração manual

---

## 🧪 Como Testar Localmente

### 1. Build da Imagem

```bash
docker build -t test-app .
```

### 2. Executar Container

```bash
docker run -d --name test-container \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  test-app
```

### 3. Verificar Status do Healthcheck

```bash
# Ver status do healthcheck
docker ps

# Saída esperada:
# STATUS: Up 2 minutes (healthy)
```

### 4. Ver Detalhes do Healthcheck

```bash
docker inspect test-container --format='{{json .State.Health}}' | jq
```

**Saída esperada:**
```json
{
  "Status": "healthy",
  "FailingStreak": 0,
  "Log": [
    {
      "Start": "2025-10-08T17:00:00Z",
      "End": "2025-10-08T17:00:01Z",
      "ExitCode": 0,
      "Output": "..."
    }
  ]
}
```

### 5. Testar Manualmente

```bash
# Deve retornar HTTP 200
curl -f http://localhost:3000/health

# Saída esperada:
# {"status":"ok","timestamp":"2025-10-08T17:00:00.000Z","uptime":123.45,"environment":"production"}
```

---

## 🎯 Estados do Healthcheck

| Estado | Significado | Ação do Coolify |
|--------|-------------|-----------------|
| **starting** | Container iniciando, aguardando start-period | Aguarda |
| **healthy** | Healthcheck passou | Status: Running ✅ |
| **unhealthy** | Healthcheck falhou 3x consecutivas | Status: Degraded ⚠️ |
| **none** | Sem healthcheck configurado | Usa health check externo |

---

## 🔧 Troubleshooting

### Problema: Container fica "unhealthy"

**Causa:** Aplicação não está respondendo em `/health`

**Debug:**
```bash
# Ver logs do healthcheck
docker inspect <container> --format='{{range .State.Health.Log}}{{.Output}}{{end}}'

# Ver logs da aplicação
docker logs <container>
```

**Soluções:**
1. Verificar se aplicação iniciou (`docker logs`)
2. Verificar se porta 3000 está aberta
3. Testar endpoint manualmente: `docker exec <container> curl http://localhost:3000/health`

### Problema: "curl: not found"

**Causa:** curl não foi instalado no container

**Solução:** Já está no Dockerfile!
```dockerfile
RUN apk add --no-cache curl
```

### Problema: Start period muito curto

**Sintoma:** Container marca unhealthy antes da app iniciar completamente

**Solução:** Aumentar `--start-period`:
```dockerfile
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

---

## 📊 Comparação: Antes vs Depois

### ❌ Antes (Sem HEALTHCHECK)

```
Coolify tenta acessar externamente
↓
404 Not Found (problema de proxy/rede)
↓
Status: Degraded
```

### ✅ Agora (Com HEALTHCHECK)

```
Docker verifica internamente (dentro do container)
↓
curl http://localhost:3000/health
↓
200 OK
↓
Status: healthy
↓
Coolify vê: Running ✅
```

---

## 🚀 Deploy no Coolify

### 1. Commit e Push

```bash
git add Dockerfile
git commit -m "feat: adiciona HEALTHCHECK interno no Dockerfile"
git push origin master
```

### 2. Redeploy no Coolify

O Coolify vai automaticamente:
1. Detectar o HEALTHCHECK no Dockerfile
2. Usar o healthcheck interno do Docker
3. Mostrar status correto (healthy/unhealthy)

### 3. Verificar Status

No Coolify, você verá:
- **Running** ✅ se healthcheck passar
- **Degraded** ⚠️ se healthcheck falhar

---

## 💡 Próximos Passos

Após o deploy:

1. **Verificar logs** no Coolify
2. **Confirmar status "healthy"** no container
3. **Testar endpoint** manualmente:
   ```bash
   curl http://sua-app.coolify.app/health
   ```

---

## 📚 Referências

- [Coolify Health Checks Documentation](https://coolify.io/docs/knowledge-base/health-checks)
- [Docker HEALTHCHECK Reference](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Best Practices for Healthchecks](https://docs.docker.com/compose/compose-file/compose-file-v3/#healthcheck)

---

**Última atualização**: 2025-10-08  
**Status**: ✅ HEALTHCHECK Configurado
