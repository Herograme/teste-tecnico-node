# 🔥 Solução para "exit code: 127" no Coolify

## 🎯 Problema
```
RUN npm run build
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127
```

**Exit code 127** = "comando não encontrado" (normalmente `nest` CLI não encontrado)

---

## ✅ Solução: Limpar Cache do Docker no Coolify

### Opção 1: Rebuild sem Cache (RECOMENDADO)

No Coolify, ao fazer o deploy:

1. Vá para a configuração da sua aplicação
2. Procure por opções de build
3. **Ative a opção "No Cache" ou "Clean Build"**
4. Faça o redeploy

**OU** adicione esta linha no Dockerfile (temporariamente):

```dockerfile
# Força rebuild sem cache
ARG CACHEBUST=1
```

### Opção 2: Reconstruir a Aplicação

1. No painel do Coolify, **DELETE a aplicação** (não se preocupe, seus dados do Git estão seguros)
2. **Recrie a aplicação** do zero
3. Configure as variáveis de ambiente novamente
4. Faça o deploy

### Opção 3: Forçar Commit Novo

```bash
# Faça um pequeno commit para forçar rebuild completo
git commit --allow-empty -m "chore: force rebuild"
git push origin master
```

---

## 🔍 Por que isso acontece?

O Coolify pode estar usando **cache antigo** do Docker que contém:
- Node modules antigos sem o Nest CLI
- Arquivos de configuração faltando (tsconfig.json estava no .dockerignore antes)
- Build incompleto anterior

---

## ✅ Verificações Importantes

### 1. Certifique-se que `.dockerignore` NÃO tem estas linhas:

❌ **REMOVER** (se existir):
```
tsconfig.json
tsconfig.build.json
nest-cli.json
```

✅ **Correto** (não deve excluir esses arquivos):
```
node_modules
npm-debug.log
dist
coverage
.git
test
*.spec.ts
```

### 2. Verifique que `package.json` tem devDependencies:

```json
{
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "typescript": "^5.7.3",
    ...
  }
}
```

### 3. Dockerfile correto com debug:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies)
RUN npm ci && npm cache clean --force

# Verifica se nest CLI foi instalado
RUN npx nest --version || echo "Nest CLI não encontrado!"

# Copia código fonte
COPY . .

# Verifica arquivos de config
RUN ls -la tsconfig*.json nest-cli.json || echo "Config não encontrado!"

# Build
RUN npm run build

# Verifica se dist foi criado
RUN ls -la dist/ || echo "Dist não criado!"

# ... resto do Dockerfile
```

---

## 🧪 Teste Local Primeiro

Antes de fazer o deploy no Coolify, teste localmente:

```bash
# Limpa tudo e testa do zero
docker system prune -a --volumes -f
docker build --no-cache -t test-build .
docker run --rm test-build ls -la dist/
```

**Se funcionar localmente mas falhar no Coolify = problema de cache do Coolify**

---

## 🚀 Checklist de Deploy

- [ ] ✅ Commit e push do código atualizado
- [ ] ✅ `.dockerignore` NÃO exclui tsconfig.json e nest-cli.json
- [ ] ✅ `package.json` tem `@nestjs/cli` em devDependencies
- [ ] ✅ Dockerfile tem os comandos de verificação (opcional, para debug)
- [ ] ✅ No Coolify: Ativar "No Cache" ou "Clean Build"
- [ ] ✅ Fazer redeploy no Coolify
- [ ] ✅ Verificar logs do build no Coolify
- [ ] ✅ Testar endpoints: `/health`, `/ready`, `/users`

---

## 📊 Logs Esperados no Build

✅ **Sucesso:**
```
#10 [builder 5/9] RUN npx nest --version
#10 1.755 11.0.10
#10 DONE 1.8s

#12 [builder 7/9] RUN ls -la tsconfig*.json nest-cli.json
#12 0.181 -rw-rw-r-- 1 root root 179 Oct 8 16:06 nest-cli.json
#12 0.181 -rw-rw-r-- 1 root root 101 Oct 8 16:06 tsconfig.build.json
#12 0.181 -rw-rw-r-- 1 root root 702 Oct 8 16:06 tsconfig.json
#12 DONE 0.2s

#13 [builder 8/9] RUN npm run build
#13 0.490 > nest build
#13 DONE 7.5s
```

❌ **Erro:**
```
RUN npm run build
sh: nest: not found
exit code: 127
```

---

## 💡 Dica Extra: Variáveis de Ambiente

No Coolify, certifique-se de que estas variáveis estão configuradas:

```env
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=seu_banco
```

E configure o **Health Check** para:
- Path: `/health`
- Port: `3000`

---

## 📞 Ainda não funciona?

Se após limpar o cache ainda não funcionar:

1. Verifique se o Coolify tem espaço em disco suficiente
2. Verifique se não há limites de build time no Coolify
3. Tente usar uma imagem base diferente: `FROM node:20` (sem alpine)
4. Verifique os logs completos do Coolify para mais detalhes

---

**Última atualização**: 2025-10-08  
**Status**: Build local ✅ OK | Coolify ⚠️ Requer limpeza de cache
