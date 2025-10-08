# Stage 1: Build
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies para build)
RUN npm ci && npm cache clean --force

# Copia o código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

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

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
