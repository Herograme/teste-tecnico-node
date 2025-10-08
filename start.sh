#!/bin/sh

# Script de inicialização para o Render
echo "🚀 Iniciando aplicação..."

# Aguarda o banco de dados estar pronto
echo "⏳ Aguardando PostgreSQL..."
until nc -z $DB_HOST $DB_PORT; do
  echo "PostgreSQL não está pronto - aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Inicia a aplicação
echo "🎯 Iniciando servidor NestJS..."
node dist/main
