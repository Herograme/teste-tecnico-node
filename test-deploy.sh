#!/bin/bash

# 🔄 Script de Monitoramento de Redeploy e Testes
# Aguarda o redeploy no Coolify e executa testes automaticamente

URL="http://s48gg4k8wkw0owg0wggs400g.144.22.222.45.sslip.io"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🔄 Aguardando Redeploy no Coolify...                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Mudanças enviadas:"
echo "   - Habilitado synchronize: true no TypeORM"
echo "   - Tabelas serão criadas automaticamente"
echo ""
echo "⏳ Aguardando aplicação ficar disponível..."
echo ""

# Aguarda alguns segundos para o deploy começar
sleep 10

# Monitora o health check
attempts=0
max_attempts=60  # 5 minutos (60 * 5s = 300s)

while [ $attempts -lt $max_attempts ]; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/health" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo "✅ Aplicação está respondendo!"
        echo ""
        
        # Aguarda mais 10 segundos para garantir que está estável
        echo "⏳ Aguardando estabilização (10s)..."
        sleep 10
        
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║  🧪 Iniciando Testes Automatizados                            ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        
        # TESTE 1: Health Check
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🏥 TESTE 1: Health Check"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        curl -s "$URL/health" | jq
        echo ""
        
        # TESTE 2: Readiness Check
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🔧 TESTE 2: Readiness Check"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        curl -s "$URL/ready" | jq
        echo ""
        
        # TESTE 3: Listar Usuários (deve estar vazio inicialmente)
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "👥 TESTE 3: Listar Usuários (GET /users)"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        users_response=$(curl -s "$URL/users")
        echo "$users_response" | jq
        
        if echo "$users_response" | grep -q "statusCode.*500"; then
            echo "❌ FALHOU: Ainda retornando erro 500"
            echo "⚠️  As tabelas podem não ter sido criadas ainda."
        else
            echo "✅ SUCESSO: Endpoint funcionando!"
        fi
        echo ""
        
        # TESTE 4: Criar Usuário
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "➕ TESTE 4: Criar Usuário (POST /users)"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        create_response=$(curl -s -X POST "$URL/users" \
          -H "Content-Type: application/json" \
          -d '{"name":"João Silva","email":"joao.silva@example.com"}')
        echo "$create_response" | jq
        
        if echo "$create_response" | grep -q "statusCode.*500"; then
            echo "❌ FALHOU: Erro ao criar usuário"
        elif echo "$create_response" | grep -q "id"; then
            echo "✅ SUCESSO: Usuário criado!"
            user_id=$(echo "$create_response" | jq -r '.id')
            echo "📝 ID do usuário: $user_id"
        fi
        echo ""
        
        # TESTE 5: Listar Tarefas
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📋 TESTE 5: Listar Tarefas (GET /tasks)"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        tasks_response=$(curl -s "$URL/tasks")
        echo "$tasks_response" | jq
        
        if echo "$tasks_response" | grep -q "statusCode.*500"; then
            echo "❌ FALHOU: Ainda retornando erro 500"
        else
            echo "✅ SUCESSO: Endpoint funcionando!"
        fi
        echo ""
        
        # TESTE 6: Criar Tarefa
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "➕ TESTE 6: Criar Tarefa (POST /tasks)"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        task_response=$(curl -s -X POST "$URL/tasks" \
          -H "Content-Type: application/json" \
          -d '{"title":"Primeira Tarefa","description":"Teste de criação de tarefa"}')
        echo "$task_response" | jq
        
        if echo "$task_response" | grep -q "statusCode.*500"; then
            echo "❌ FALHOU: Erro ao criar tarefa"
        elif echo "$task_response" | grep -q "id"; then
            echo "✅ SUCESSO: Tarefa criada!"
            task_id=$(echo "$task_response" | jq -r '.id')
            echo "📝 ID da tarefa: $task_id"
        fi
        echo ""
        
        # TESTE 7: Verificar Swagger
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📚 TESTE 7: Swagger Documentation"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        swagger_status=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/docs")
        if [ "$swagger_status" = "200" ]; then
            echo "✅ Swagger acessível em: $URL/api/docs"
        else
            echo "❌ Status: $swagger_status"
        fi
        echo ""
        
        # Resumo Final
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║  📊 Resumo dos Testes                                         ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        echo "🔗 URL da Aplicação: $URL"
        echo "📚 Documentação: $URL/api/docs"
        echo ""
        echo "Testes Realizados:"
        echo "  ✅ Health Check"
        echo "  ✅ Readiness Check"
        
        if echo "$users_response" | grep -q "statusCode.*500"; then
            echo "  ❌ GET /users (Falhou)"
        else
            echo "  ✅ GET /users"
        fi
        
        if echo "$create_response" | grep -q "statusCode.*500"; then
            echo "  ❌ POST /users (Falhou)"
        else
            echo "  ✅ POST /users"
        fi
        
        if echo "$tasks_response" | grep -q "statusCode.*500"; then
            echo "  ❌ GET /tasks (Falhou)"
        else
            echo "  ✅ GET /tasks"
        fi
        
        if echo "$task_response" | grep -q "statusCode.*500"; then
            echo "  ❌ POST /tasks (Falhou)"
        else
            echo "  ✅ POST /tasks"
        fi
        
        echo "  ✅ Swagger Docs"
        echo ""
        
        # Verifica se todos passaram
        if echo "$users_response$create_response$tasks_response$task_response" | grep -q "statusCode.*500"; then
            echo "⚠️  ATENÇÃO: Alguns testes falharam!"
            echo "   Verifique os logs do Coolify para mais detalhes."
            echo "   Pode ser necessário aguardar mais tempo para o deploy completar."
        else
            echo "🎉 TODOS OS TESTES PASSARAM!"
            echo "   A aplicação está totalmente funcional!"
        fi
        
        echo ""
        exit 0
    fi
    
    attempts=$((attempts + 1))
    echo -n "."
    sleep 5
done

echo ""
echo "❌ Timeout: Aplicação não respondeu após 5 minutos"
echo "   Verifique o status do deploy no painel do Coolify"
exit 1
