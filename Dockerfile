# Stage 1: Build
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# IMPORTANTE: Força NODE_ENV=development durante o build para instalar devDependencies
# Isso garante que @nestjs/cli, typescript, etc sejam instalados
ENV NODE_ENV=development

# Instala TODAS as dependências (incluindo devDependencies para build)
RUN npm ci && npm cache clean --force

# Verifica se o nest CLI foi instalado
RUN npx nest --version || echo "Nest CLI não encontrado, mas continuando..."

# Copia o código fonte
COPY . .

# Verifica se os arquivos de configuração TypeScript existem
RUN ls -la tsconfig*.json nest-cli.json || echo "Arquivos de configuração não encontrados!"

# Build da aplicação
RUN npm run build

# Verifica se o build gerou o diretório dist
RUN ls -la dist/ || echo "Diretório dist não foi criado!"

# Stage 2: Production
FROM node:20-alpine AS production

# Instala curl para o healthcheck
RUN apk add --no-cache curl

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copia os arquivos buildados do stage anterior
COPY --from=builder /app/dist ./dist

# Expõe a porta da aplicação
EXPOSE 3000

# Define variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck - verifica se a aplicação está respondendo
# Usa o endpoint /health que não depende do banco de dados
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
