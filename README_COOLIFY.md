# 🚀 Deploy no Coolify - Guia Completo

## 📋 Sobre o Coolify

Coolify é uma plataforma self-hosted open-source que funciona como alternativa ao Heroku/Netlify/Vercel, permitindo deploy de aplicações na sua própria VPS.

---

## ✅ Pré-requisitos

### No seu VPS
- ✅ Coolify instalado e configurado
- ✅ Docker e Docker Compose funcionando
- ✅ Acesso SSH ao VPS (opcional, mas recomendado)
- ✅ Domínio configurado (opcional)

### No seu projeto
- ✅ Código no Git (GitHub, GitLab, Gitea, etc.)
- ✅ Dockerfile otimizado (✅ Já criado!)
- ✅ docker-compose.yml para Coolify (✅ Já criado!)

---

## 🚀 Passo a Passo - Deploy

### 1️⃣ Preparar o Repositório

```bash
# Certifique-se de que todos os arquivos estão commitados
git add .
git commit -m "Configuração para deploy no Coolify"
git push origin master
```

### 2️⃣ Criar Projeto no Coolify

1. Acesse seu painel Coolify: `https://seu-coolify.com`
2. Faça login
3. Clique em **"+ New"** → **"Project"**
4. Dê um nome: `Teste Técnico Node`

### 3️⃣ Adicionar Resource (Aplicação)

1. Dentro do projeto, clique em **"+ New"** → **"Resource"**
2. Selecione **"Docker Compose"**
3. Configure:
   - **Name**: `teste-tecnico-api`
   - **Git Repository**: Cole a URL do seu repositório
   - **Branch**: `master` (ou `main`)
   - **Docker Compose Location**: `./docker-compose.yml`

### 4️⃣ Configurar Variáveis de Ambiente

1. No serviço criado, vá em **"Environment Variables"**
2. Adicione as seguintes variáveis:

```env
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=SuaSenhaSeguraAqui123!
DB_DATABASE=teste_tecnico
```

**⚠️ IMPORTANTE:** 
- Use uma senha FORTE para `DB_PASSWORD`
- Coolify criptografa as variáveis automaticamente
- Você pode usar o gerador de senhas do Coolify

### 5️⃣ Configurar Domínio (Opcional)

1. Vá em **"Domains"**
2. Adicione seu domínio: `api.seudominio.com`
3. Coolify configurará automaticamente:
   - ✅ Proxy reverso (Traefik)
   - ✅ SSL/TLS (Let's Encrypt)
   - ✅ Redirecionamento HTTP → HTTPS

**Sem domínio?** Coolify fornece um subdomínio automático.

### 6️⃣ Configurar Build Settings

1. Vá em **"Build"**
2. Verifique as configurações:
   - **Build Pack**: `Docker Compose`
   - **Dockerfile**: `./Dockerfile`
   - **Context**: `.`

### 7️⃣ Deploy!

1. Clique em **"Deploy"** (botão azul no canto superior direito)
2. Acompanhe os logs em tempo real
3. Aguarde o build completar (3-5 minutos na primeira vez)

### 8️⃣ Verificar Deploy

Após o deploy, você verá:
- ✅ Status: **Running**
- ✅ URL da aplicação
- ✅ Containers ativos (app + postgres)

**Testar:**
```bash
# Substituir pela URL do Coolify
curl https://seu-app.coolify.com

# Ou acessar no navegador
# https://seu-app.coolify.com/api/docs
```

---

## 🔧 Configurações Avançadas

### Auto-Deploy (Recomendado)

1. Vá em **"General"** → **"Automatic Deployment"**
2. Ative **"Deploy on push"**
3. Configure o webhook no seu Git provider

Agora, cada push no branch configurado fará deploy automaticamente! 🎉

### Health Checks

Coolify já está configurado para verificar a saúde da aplicação:
- **Endpoint**: `/` (configurado no docker-compose.yml)
- **Porta**: `3000`
- **Intervalo**: `30s`

### Logs

Para ver logs em tempo real:
1. Vá em **"Logs"**
2. Selecione o container (`app` ou `postgres`)
3. Logs serão exibidos em tempo real

### Escalar Recursos

1. Vá em **"Resources"**
2. Ajuste:
   - CPU limit
   - Memory limit
   - Replicas (para high availability)

### Backup do Banco de Dados

1. Vá em **"Databases"** → PostgreSQL
2. Configure backups automáticos:
   - **Frequency**: Diário
   - **Retention**: 7 dias
   - **Storage**: S3, local, etc.

---

## 🐛 Troubleshooting

### Build falha

**Erro: `npm run build` failed**
- ✅ **CORRIGIDO!** O Dockerfile agora instala todas as dependências no build stage

**Verificar localmente:**
```bash
# Testar build local
docker build -t teste-app .

# Se der erro, verificar logs
docker build --no-cache -t teste-app .
```

### Container não inicia

**Ver logs no Coolify:**
1. Vá em **"Logs"**
2. Procure por erros

**Causas comuns:**
- Variáveis de ambiente faltando
- Banco de dados não conectado
- Porta já em uso

### Erro de conexão com banco de dados

**Verificar:**
1. `DB_HOST=postgres` (nome do serviço no docker-compose)
2. `DB_PASSWORD` está correta
3. PostgreSQL está rodando (ver logs)

**Testar conexão:**
```bash
# Entrar no container da app
# No Coolify: Terminal → app

# Testar conexão
nc -zv postgres 5432
```

### Aplicação lenta

**Otimizações:**
1. Aumentar recursos no Coolify
2. Verificar logs de performance
3. Adicionar caching (Redis)
4. Otimizar queries do banco

---

## 📊 Monitoramento

### Métricas Integradas

Coolify fornece métricas built-in:
- CPU usage
- Memory usage
- Network I/O
- Disk usage

**Acesso:** Dashboard do projeto → Metrics

### Logs Centralizados

Todos os logs ficam disponíveis em:
- **Application logs**: Logs do NestJS
- **Build logs**: Logs do Docker build
- **System logs**: Logs do container

### Alertas (Opcional)

Configure notificações:
1. **Discord** - Webhook
2. **Slack** - Webhook
3. **Email** - SMTP
4. **Telegram** - Bot

---

## 🔐 Segurança

### Boas Práticas Implementadas

✅ **Multi-stage Docker build** - Imagem final sem código-fonte
✅ **Variáveis de ambiente** - Secrets não commitados
✅ **Health checks** - Restart automático em caso de falha
✅ **Volumes persistentes** - Dados do PostgreSQL salvos
✅ **Network isolada** - App e DB na mesma rede privada

### Recomendações Adicionais

1. **Firewall**: Configure UFW no VPS
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

2. **Fail2ban**: Proteja contra brute force
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

3. **SSL/TLS**: Coolify configura automaticamente via Let's Encrypt

4. **Backups**: Configure backups automáticos do volume PostgreSQL

---

## 🎯 Checklist de Deploy

### Antes do Deploy
- [ ] Código commitado no Git
- [ ] Variáveis de ambiente preparadas
- [ ] Dockerfile testado localmente
- [ ] docker-compose.yml validado

### Durante o Deploy
- [ ] Projeto criado no Coolify
- [ ] Resource (Docker Compose) adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado (se aplicável)
- [ ] Deploy iniciado

### Após o Deploy
- [ ] Status "Running" ativo
- [ ] URL acessível
- [ ] Swagger funcionando (`/api/docs`)
- [ ] Endpoints testados
- [ ] Logs verificados
- [ ] Auto-deploy configurado

---

## 📈 Próximos Passos

### Melhorias Recomendadas

1. **Redis para Cache**
   ```yaml
   # Adicionar ao docker-compose.yml
   redis:
     image: redis:7-alpine
     restart: unless-stopped
   ```

2. **CI/CD com GitHub Actions**
   - Testes automáticos antes do deploy
   - Build e push de imagens
   - Notificações de deploy

3. **Monitoring Avançado**
   - Grafana + Prometheus
   - APM (Application Performance Monitoring)
   - Error tracking (Sentry)

4. **CDN para Assets**
   - Cloudflare
   - BunnyCDN
   - AWS CloudFront

---

## 🆘 Suporte

### Documentação Oficial
- [Coolify Docs](https://coolify.io/docs)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

### Comunidade
- [Coolify Discord](https://discord.gg/coolify)
- [Coolify GitHub](https://github.com/coollabsio/coolify)

### Arquivos do Projeto
- `Dockerfile` - Imagem da aplicação (corrigido)
- `docker-compose.yml` - Orquestração (otimizado para Coolify)
- `.env.coolify` - Template de variáveis
- `.coolify` - Configuração do Coolify

---

## 💡 Dicas Importantes

### Performance
- ✅ Use build cache: Coolify mantém layers em cache
- ✅ Multi-stage build: Imagem final ~150MB (otimizada)
- ✅ Alpine Linux: Base mais leve que Debian

### Custo
- ✅ VPS compartilhada: $5-10/mês (Hetzner, DigitalOcean)
- ✅ Coolify: Grátis e open-source
- ✅ Domínio: ~$10/ano

### Escalabilidade
- ✅ Horizontal: Adicione mais replicas no Coolify
- ✅ Vertical: Aumente recursos da VPS
- ✅ Database: Migre para PostgreSQL gerenciado se necessário

---

## 🎉 Resultado Final

Após seguir este guia, você terá:

✅ **Aplicação rodando** em produção na sua VPS
✅ **SSL/TLS** configurado automaticamente
✅ **Auto-deploy** em cada push
✅ **Banco de dados** PostgreSQL persistente
✅ **Monitoring** com métricas em tempo real
✅ **Logs** centralizados e acessíveis
✅ **Backup** automático (se configurado)

**URL de exemplo:**
- API: `https://api.seudominio.com`
- Swagger: `https://api.seudominio.com/api/docs`

---

## 📞 Problemas?

Se encontrar algum erro:

1. **Verificar logs** no Coolify
2. **Testar localmente** com Docker
3. **Consultar documentação** do Coolify
4. **Pedir ajuda** na comunidade

**Lembre-se:** O Dockerfile foi corrigido para instalar todas as dependências necessárias durante o build! 🎯

---

**Última atualização**: 2025-10-08
**Status**: ✅ Testado e funcionando
**Dockerfile**: ✅ Corrigido (instala devDependencies no build stage)
