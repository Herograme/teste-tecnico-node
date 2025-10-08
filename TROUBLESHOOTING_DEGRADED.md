# 🔧 Troubleshooting: Status "Degraded" no Coolify

## 🚨 Problema

Status: **Degraded**
Erro: **404 Not Found** em todas as rotas

```
GET /health → 404 Not Found
GET / → 404 Not Found
```

---

## 🔍 Diagnóstico

O **404** significa que o proxy do Coolify não está conseguindo se comunicar com a aplicação NestJS.

### Possíveis Causas

1. ❌ **Porta incorreta** - Aplicação rodando em porta diferente
2. ❌ **Container crashou** - Aplicação iniciou mas parou por erro do DB
3. ❌ **Health check incorreto** - Coolify verificando endpoint errado
4. ❌ **Network issue** - Containers não estão na mesma rede

---

## ✅ Soluções

### 1️⃣ **Verificar Logs da Aplicação no Coolify**

No painel do Coolify:

1. Vá para a aplicação
2. Clique em **"Logs"**
3. Procure por:

**✅ Sucesso (aplicação iniciou):**
```
🎉 Aplicação iniciada com sucesso!
🌐 Servidor rodando em: http://localhost:3000
```

**❌ Erro (aplicação crashou):**
```
ERROR password authentication failed for user "postgres"
[ExceptionHandler] error: password authentication failed
```

**❌ Erro (porta errada):**
```
EADDRINUSE: address already in use
Error: listen EADDRINUSE: address already in use :::3000
```

---

### 2️⃣ **Verificar Configuração de Porta no Coolify**

No painel do Coolify, verifique:

**Configurações → Ports & Domains:**

- **Container Port**: Deve ser `3000` (porta interna do container)
- **Public Port**: Geralmente `80` ou vazio (Coolify gerencia)
- **Protocol**: `HTTP`

**Se estiver diferente de 3000, corrija para 3000!**

---

### 3️⃣ **Verificar Health Check Configuration**

No painel do Coolify:

**Health Check Settings:**

| Configuração | Valor Correto |
|--------------|---------------|
| **Health Check Enabled** | ✅ Yes |
| **Health Check Path** | `/health` |
| **Health Check Port** | `3000` |
| **Health Check Scheme** | `http` |
| **Health Check Interval** | `10s` |
| **Health Check Timeout** | `5s` |
| **Health Check Retries** | `3` |

**⚠️ IMPORTANTE:** O Coolify pode estar verificando a porta errada ou usando HTTPS ao invés de HTTP.

---

### 4️⃣ **Configurar "Ignore Health Check"** (Temporário)

Para debug, você pode desabilitar o health check temporariamente:

1. No Coolify, vá para configurações da aplicação
2. Procure por "Health Check"
3. **Desabilite** ou configure para **"Ignore Health Check Failures"**
4. Redeploy

Isso vai permitir que a aplicação fique "Running" mesmo com o health check falhando, facilitando o debug.

---

### 5️⃣ **Verificar Variáveis de Ambiente**

Certifique-se que `PORT` está configurado:

```env
PORT=3000
NODE_ENV=production
```

Se `PORT` não estiver definido, a aplicação pode estar usando porta padrão diferente.

---

### 6️⃣ **Modificar main.ts para Aceitar Falha do DB** (Solução Temporária)

Se o problema é que a aplicação está crashando por causa do banco, vamos modificar para ela **não crashar** e continuar rodando:

**Arquivo: `src/main.ts`**

O código atual já tem um `try-catch`, mas vamos garantir que ele **não mate o processo**:

```typescript
async function bootstrap() {
  console.log('🚀 Iniciando aplicação...');
  
  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      { logger: ['error', 'warn', 'log', 'debug', 'verbose'] },
    );

    // ... configurações ...

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    
    console.log('🎉 Aplicação iniciada com sucesso!');
    console.log(`🌐 Servidor: http://localhost:${port}`);
    
  } catch (error) {
    console.error('❌ Erro ao iniciar:', error);
    
    // IMPORTANTE: NÃO fazer process.exit() aqui!
    // A aplicação deve continuar rodando para responder health checks
  }
}
```

**⚠️ O código atual JÁ está correto!** Ele captura o erro mas não mata o processo.

---

### 7️⃣ **Verificar Network do Docker**

No Coolify, certifique-se que:

1. Aplicação e PostgreSQL estão na **mesma network** (`coolify`)
2. O nome do serviço PostgreSQL está correto em `DB_HOST`

**Configuração correta:**
```env
DB_HOST=postgres  # Nome do serviço, não IP
```

---

## 🎯 **Checklist de Debug**

Execute nesta ordem:

- [ ] 1. Verificar logs da aplicação no Coolify
  - Procure por "Aplicação iniciada com sucesso"
  - Procure por erros de porta ou DB
  
- [ ] 2. Verificar se PORT=3000 está configurado
  - Environment Variables → PORT=3000

- [ ] 3. Verificar Container Port no Coolify
  - Deve ser 3000

- [ ] 4. Verificar Health Check Path
  - Deve ser `/health` (com a barra)

- [ ] 5. Verificar Health Check Port
  - Deve ser `3000`

- [ ] 6. Tentar desabilitar Health Check temporariamente
  - Para ver se a aplicação fica "Running"

- [ ] 7. Verificar senha do PostgreSQL
  - Se logs mostram erro de autenticação

---

## 🔧 **Soluções Rápidas**

### Solução 1: Desabilitar Health Check (Debug)

1. Coolify → Aplicação → Settings
2. Health Check → **Disable**
3. Redeploy
4. Verificar se status muda para "Running"
5. Testar endpoints manualmente

### Solução 2: Configurar Porta Corretamente

1. Coolify → Aplicação → Ports & Domains
2. **Container Port**: `3000`
3. Salvar e Redeploy

### Solução 3: Health Check Correto

```
Path: /health
Port: 3000
Scheme: http
Interval: 10s
Timeout: 5s
Retries: 3
```

### Solução 4: Ignorar Falhas do Health Check

1. Coolify → Settings → Health Check
2. Ative "Ignore Health Check Failures" ou "Start Anyway"
3. Redeploy

---

## 📊 **Status Esperados no Coolify**

| Status | Significado | Ação |
|--------|-------------|------|
| **Running** ✅ | Tudo funcionando | Nenhuma |
| **Degraded** ⚠️ | App rodando mas health check falhando | Corrigir health check ou porta |
| **Stopped** ❌ | Container parado | Ver logs e reiniciar |
| **Building** 🔨 | Em processo de build | Aguardar |
| **Crashed** 💥 | Aplicação crashou | Ver logs de erro |

---

## 🆘 **Se Nada Funcionar**

### Última Tentativa: Recriar Aplicação

1. **Não delete** - apenas pause
2. Vá para Settings → **Advanced**
3. Procure por "Recreate" ou "Force Recreate"
4. Ou: Delete e recrie do zero com as configurações corretas

### Configurações Essenciais na Recriação

```
Name: teste-tecnico-node
Repository: herograme/teste-tecnico-node
Branch: master
Build Type: Dockerfile
Container Port: 3000

Environment Variables:
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<senha-correta>
DB_DATABASE=teste_tecnico

Health Check:
Enabled: Yes
Path: /health
Port: 3000
Scheme: http
```

---

## 💡 **Dica: Teste Local do Container**

Para testar se o container funciona localmente:

```bash
# Build local
docker build -t test-coolify .

# Run local (sem DB)
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  test-coolify

# Testar health check
curl http://localhost:3000/health
```

Se funcionar localmente mas não no Coolify, o problema é de configuração do Coolify.

---

**Última atualização**: 2025-10-08  
**Status**: Investigando estado "Degraded"
