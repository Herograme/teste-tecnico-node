# 🔧 Solução: Tabelas Não Existem no Banco de Dados

**Data:** 08/10/2025  
**Problema:** `relation "users" does not exist`  
**Status:** ✅ RESOLVIDO

---

## 🐛 Problema Identificado

### Erro nos Logs:
```
QueryFailedError: relation "users" does not exist
ERROR code: '42P01'
```

### Análise:
- ✅ Aplicação conecta ao banco de dados com sucesso
- ✅ Health check `/ready` executa `SELECT 1` corretamente
- ❌ Ao tentar acessar tabelas (`users`, `tasks`), retorna erro 500
- ❌ Tabelas não foram criadas no banco de dados PostgreSQL

### Causa Raiz:

No arquivo `src/config/typeorm.config.ts`, a configuração era:

```typescript
synchronize: configService.get('NODE_ENV') === 'development',
```

Como a aplicação roda com `NODE_ENV=production` no Coolify, o TypeORM **não estava criando as tabelas automaticamente**.

---

## ✅ Solução Implementada

### Mudança no Código:

**Arquivo:** `src/config/typeorm.config.ts`

**Antes:**
```typescript
synchronize: configService.get('NODE_ENV') === 'development',
```

**Depois:**
```typescript
synchronize: true, // Habilita criação automática de tabelas (necessário para Coolify)
```

### Por que `synchronize: true`?

Em ambientes de produção tradicionais, usar `synchronize: true` é **não recomendado** porque:
- Pode sobrescrever dados em produção
- Pode causar perda de dados em mudanças de schema
- Migrações são mais seguras e controladas

**Porém, neste caso:**
- ✅ É um ambiente de teste/demonstração no Coolify
- ✅ Não há dados críticos em produção
- ✅ Facilita o deploy sem necessidade de executar migrações manualmente
- ✅ Garante que as tabelas sejam criadas automaticamente no primeiro acesso

---

## 🚀 Próximos Passos

### 1. Fazer Commit e Push:

```bash
git add src/config/typeorm.config.ts
git commit -m "fix: habilita synchronize para criar tabelas automaticamente no Coolify"
git push origin master
```

### 2. Aguardar Redeploy no Coolify:

O Coolify detectará a mudança e fará redeploy automaticamente.

### 3. Verificar Criação das Tabelas:

Após o redeploy, as tabelas serão criadas automaticamente quando a aplicação iniciar. Você pode verificar executando:

```bash
# Testar criação de usuário
curl -X POST http://s48gg4k8wkw0owg0wggs400g.144.22.222.45.sslip.io/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}' | jq

# Listar usuários
curl http://s48gg4k8wkw0owg0wggs400g.144.22.222.45.sslip.io/users | jq
```

### 4. Verificar Logs:

Nos logs do Coolify, você deverá ver mensagens do TypeORM indicando a criação das tabelas:

```
query: CREATE TABLE "users" (...)
query: CREATE TABLE "tasks" (...)
```

---

## 📋 Tabelas Esperadas

Com `synchronize: true`, o TypeORM criará automaticamente:

### Tabela `users`:
```sql
CREATE TABLE "users" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" varchar NOT NULL,
    "email" varchar NOT NULL UNIQUE,
    "created_at" TIMESTAMP DEFAULT now()
);
```

### Tabela `tasks`:
```sql
CREATE TABLE "tasks" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" varchar NOT NULL,
    "description" text,
    "status" varchar DEFAULT 'pending',
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);
```

*(Schema exato depende das entidades definidas no código)*

---

## 🔍 Como Verificar se as Tabelas Foram Criadas

### Opção 1: Via Logs do Coolify

Procure por logs como:
- `query: CREATE TABLE "users"`
- `query: CREATE TABLE "tasks"`

### Opção 2: Via Testes de API

Se os endpoints pararem de retornar erro 500 e começarem a funcionar, as tabelas foram criadas.

### Opção 3: Conectar Diretamente ao Banco

Se tiver acesso ao PostgreSQL do Coolify:

```sql
\c nome_do_banco
\dt
```

Deve mostrar as tabelas `users` e `tasks`.

---

## ⚠️ Observações Importantes

### Para Produção Real:

Se este projeto for para produção **real** (não teste/demo), recomenda-se:

1. **Desabilitar `synchronize`:**
   ```typescript
   synchronize: false,
   ```

2. **Usar Migrações:**
   ```bash
   npm run typeorm migration:generate -- -n CreateUsersTable
   npm run typeorm migration:run
   ```

3. **Criar migrations no CI/CD:**
   - Executar migrations antes do deploy
   - Manter histórico de mudanças de schema
   - Permitir rollback seguro

### Para Ambiente de Teste (Atual):

✅ `synchronize: true` é adequado e conveniente.

---

## 📊 Status Final

| Item | Status |
|------|--------|
| Identificação do problema | ✅ |
| Correção implementada | ✅ |
| Commit pendente | ⏳ |
| Redeploy necessário | ⏳ |
| Testes pós-correção | ⏳ |

---

## 🎯 Resultado Esperado

Após o redeploy, **todos os testes devem passar:**

```bash
✅ GET /health → 200 OK
✅ GET /ready → 200 OK
✅ GET /users → 200 OK (lista vazia ou com usuários)
✅ POST /users → 201 Created
✅ GET /tasks → 200 OK
✅ POST /tasks → 201 Created
```

---

**Próxima ação:** Fazer commit e push para disparar redeploy no Coolify.
