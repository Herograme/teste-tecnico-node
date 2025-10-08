# 🚀 Guia Rápido - Deploy Docker & Render

## ⚡ TL;DR - Início Rápido

### Desenvolvimento Local (Docker)
```bash
npm run docker:build && npm run docker:up
```
✅ API: http://localhost:3000 | Swagger: http://localhost:3000/api/docs

### Deploy no Render
```bash
git add . && git commit -m "Docker deploy" && git push
```
✅ Render Dashboard → New + → Blueprint → Conectar repo

---

## 📦 O Que Foi Criado

### Arquivos Docker
- ✅ `Dockerfile` - Aplicação NestJS (multi-stage)
- ✅ `Dockerfile.postgres` - PostgreSQL para Render
- ✅ `docker-compose.yml` - Orquestração local
- ✅ `.dockerignore` - Otimização

### Configuração Render
- ✅ `render.yaml` - Blueprint automático
- ✅ `start.sh` - Script de inicialização

### Documentação
- ✅ `README_DOCKER.md` - Guia completo Docker
- ✅ `README_RENDER.md` - Guia completo Render
- ✅ `MODIFICACOES_DOCKER.md` - Resumo de mudanças

### Scripts NPM Adicionados
```json
"docker:build"   - Build das imagens
"docker:up"      - Inicia containers
"docker:down"    - Para containers
"docker:logs"    - Ver logs
"docker:restart" - Reinicia
"docker:clean"   - Limpa tudo
```

---

## 🐳 Opção 1: Docker Local

### Passo 1: Configurar ambiente
```bash
# Copiar .env de exemplo
copy .env.example .env
```

### Passo 2: Iniciar
```bash
npm run docker:build
npm run docker:up
```

### Passo 3: Verificar
```bash
npm run docker:logs
```

### Passo 4: Testar
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

### Comandos Úteis
```bash
npm run docker:down      # Parar
npm run docker:restart   # Reiniciar
npm run docker:clean     # Limpar tudo
```

---

## ☁️ Opção 2: Deploy no Render

### Método A: Blueprint (Automático) ⭐ RECOMENDADO

1. **Commit arquivos**
```bash
git add Dockerfile docker-compose.yml render.yaml .dockerignore
git commit -m "Add Docker and Render configuration"
git push
```

2. **Criar Blueprint no Render**
   - Acessar: https://dashboard.render.com
   - Clicar: **New +** → **Blueprint**
   - Conectar repositório Git
   - Selecionar branch (main/master)
   - Clicar: **Apply**

3. **Aguardar deploy** (5-10 min)

4. **Acessar aplicação**
   - URL: `https://teste-tecnico-api.onrender.com`
   - Swagger: `https://teste-tecnico-api.onrender.com/api/docs`

### Método B: Manual

1. **Criar PostgreSQL**
   - New + → PostgreSQL
   - Name: `teste-tecnico-postgres`
   - Database: `teste_tecnico`
   - Plan: Free
   - Copiar Internal Database URL

2. **Criar Web Service**
   - New + → Web Service
   - Conectar repositório
   - Runtime: Docker
   - Dockerfile Path: `./Dockerfile`

3. **Configurar variáveis**
```env
NODE_ENV=production
PORT=3000
DB_HOST=<internal_postgres_host>
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<senha_gerada>
DB_DATABASE=teste_tecnico
```

4. **Deploy**
   - Clicar: Create Web Service
   - Aguardar build completar

---

## 🧪 Testando

### Docker Local
```bash
# Health check
curl http://localhost:3000

# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"João\",\"email\":\"joao@example.com\"}"

# Listar usuários
curl http://localhost:3000/users
```

### Render (após deploy)
```bash
# Substituir pela sua URL
export API_URL="https://seu-app.onrender.com"

# Health check
curl $API_URL

# Criar usuário
curl -X POST $API_URL/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"João\",\"email\":\"joao@example.com\"}"
```

---

## 📊 Estrutura Completa

```
teste-tecnico-node/
├── 🐳 Docker
│   ├── Dockerfile                 # App NestJS
│   ├── Dockerfile.postgres        # PostgreSQL
│   ├── docker-compose.yml         # Orquestração
│   └── .dockerignore              # Otimização
│
├── ☁️ Render
│   ├── render.yaml                # Blueprint
│   └── start.sh                   # Inicialização
│
├── 📚 Documentação
│   ├── README.md                  # Principal (atualizado)
│   ├── README_DOCKER.md           # Guia Docker
│   ├── README_RENDER.md           # Guia Render
│   ├── MODIFICACOES_DOCKER.md     # Resumo mudanças
│   └── QUICK_START_DEPLOY.md      # Este arquivo
│
├── ⚙️ Configuração
│   ├── .env.example               # Template dev
│   └── .env.production.example    # Template prod
│
└── 📦 package.json                # Scripts Docker adicionados
```

---

## ❓ Troubleshooting Rápido

### Docker não inicia
```bash
# Verificar se Docker está rodando
docker --version

# Rebuild forçado
npm run docker:clean
npm run docker:build
npm run docker:up
```

### Erro de conexão com banco
```bash
# Ver logs do PostgreSQL
docker-compose logs postgres

# Verificar se está rodando
docker-compose ps
```

### Porta em uso
```bash
# Windows - Verificar porta 3000
netstat -ano | findstr :3000

# Mudar porta no .env
PORT=3001
```

### Render build falhou
1. Verificar logs no Render Dashboard
2. Testar build localmente:
```bash
docker build -t teste-app .
docker run -p 3000:3000 teste-app
```

---

## 🎯 Checklist de Sucesso

### Docker Local
- [ ] Docker Desktop instalado
- [ ] `npm run docker:up` executado
- [ ] http://localhost:3000 respondendo
- [ ] Swagger acessível
- [ ] Endpoints testados

### Render Deploy
- [ ] Arquivos commitados no Git
- [ ] Blueprint criado no Render
- [ ] Build completado com sucesso
- [ ] URL acessível
- [ ] Variáveis de ambiente configuradas
- [ ] Endpoints testados

---

## 📞 Suporte

### Documentação Completa
- Docker: Ver `README_DOCKER.md`
- Render: Ver `README_RENDER.md`
- Mudanças: Ver `MODIFICACOES_DOCKER.md`

### Links Úteis
- [Docker Docs](https://docs.docker.com)
- [Render Docs](https://render.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

---

## 🎉 Pronto!

Você agora tem:
- ✅ Ambiente Docker local completo
- ✅ Deploy configurado no Render
- ✅ Documentação completa
- ✅ Scripts automatizados

**Próximo passo:** Escolha Docker local OU Render deploy e siga os passos acima! 🚀

---

**Última atualização**: 2025-01-08
