# 📮 Guia de Testes - Postman

Este guia contém todos os endpoints da API com exemplos de requisições prontos para usar no Postman.

---

## 🔧 Configuração Inicial

**Base URL:** `http://localhost:3000`

---

## 👤 ENDPOINTS - USUÁRIOS

### 1. Criar Usuário
**POST** `/users`

**Headers:**
```
Content-Type: application/json
```

**Body (raw - JSON):**
```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "createdAt": "2025-10-07T10:30:00.000Z"
}
```

**Resposta de Erro - Email Duplicado (409 Conflict):**
```json
{
  "message": "Email já cadastrado",
  "error": "Conflict",
  "statusCode": 409
}
```

---

### 2. Listar Todos os Usuários
**GET** `/users`

**Headers:**
```
Nenhum header específico necessário
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "createdAt": "2025-10-07T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Maria Santos",
    "email": "maria.santos@example.com",
    "createdAt": "2025-10-07T11:00:00.000Z"
  }
]
```

---

### 3. Buscar Usuário por ID
**GET** `/users/:id`

**Exemplo:** `GET /users/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Nenhum header específico necessário
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "createdAt": "2025-10-07T10:30:00.000Z"
}
```

**Resposta de Erro - Não Encontrado (404 Not Found):**
```json
{
  "message": "Usuário não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 4. Atualizar Usuário
**PUT** `/users/:id`

**Exemplo:** `PUT /users/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Content-Type: application/json
```

**Body (raw - JSON):**
```json
{
  "name": "João Pedro Silva"
}
```

**Ou para atualizar email:**
```json
{
  "email": "joao.pedro@example.com"
}
```

**Ou atualizar ambos:**
```json
{
  "name": "João Pedro Silva",
  "email": "joao.pedro@example.com"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Pedro Silva",
  "email": "joao.pedro@example.com",
  "createdAt": "2025-10-07T10:30:00.000Z"
}
```

---

### 5. Deletar Usuário
**DELETE** `/users/:id`

**Exemplo:** `DELETE /users/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Nenhum header específico necessário
```

**Resposta de Sucesso (204 No Content):**
```
Sem corpo de resposta
```

**Resposta de Erro - Não Encontrado (404 Not Found):**
```json
{
  "message": "Usuário não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## ✅ ENDPOINTS - TAREFAS

### 1. Criar Tarefa
**POST** `/tasks`

**Headers:**
```
Content-Type: application/json
```

**Body (raw - JSON):**
```json
{
  "title": "Estudar NestJS",
  "description": "Aprender sobre decorators e módulos",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

**Observação:** O campo `status` é opcional. Se não informado, será `pending` por padrão.

**Body sem status (usa padrão):**
```json
{
  "title": "Estudar TypeORM",
  "description": "Aprender sobre entidades e relacionamentos",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Estudar NestJS",
  "description": "Aprender sobre decorators e módulos",
  "status": "pending",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2025-10-07T12:00:00.000Z"
}
```

**Resposta de Erro - Usuário Não Encontrado (404 Not Found):**
```json
{
  "message": "Usuário não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

**Resposta de Erro - UUID Inválido (400 Bad Request):**
```json
{
  "message": [
    "O userId deve ser um UUID válido"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 2. Listar Todas as Tarefas
**GET** `/tasks`

**Headers:**
```
Nenhum header específico necessário
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "Estudar NestJS",
    "description": "Aprender sobre decorators e módulos",
    "status": "pending",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "João Silva",
    "createdAt": "2025-10-07T12:00:00.000Z"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "title": "Revisar código",
    "description": "Fazer code review do PR #123",
    "status": "done",
    "userId": "660e8400-e29b-41d4-a716-446655440001",
    "userName": "Maria Santos",
    "createdAt": "2025-10-07T13:00:00.000Z"
  }
]
```

---

### 3. Buscar Tarefa por ID
**GET** `/tasks/:id`

**Exemplo:** `GET /tasks/770e8400-e29b-41d4-a716-446655440002`

**Headers:**
```
Nenhum header específico necessário
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Estudar NestJS",
  "description": "Aprender sobre decorators e módulos",
  "status": "pending",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userName": "João Silva",
  "createdAt": "2025-10-07T12:00:00.000Z"
}
```

**Resposta de Erro - Não Encontrado (404 Not Found):**
```json
{
  "message": "Tarefa não encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 4. Atualizar Tarefa
**PUT** `/tasks/:id`

**Exemplo:** `PUT /tasks/770e8400-e29b-41d4-a716-446655440002`

**Headers:**
```
Content-Type: application/json
```

**Body - Atualizar apenas o status:**
```json
{
  "status": "done"
}
```

**Body - Atualizar título e descrição:**
```json
{
  "title": "Estudar NestJS Avançado",
  "description": "Aprender sobre Guards, Interceptors e Pipes"
}
```

**Body - Atualizar todos os campos:**
```json
{
  "title": "Estudar NestJS Completo",
  "description": "Curso completo de NestJS",
  "status": "done"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Estudar NestJS Completo",
  "description": "Curso completo de NestJS",
  "status": "done",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userName": "João Silva",
  "createdAt": "2025-10-07T12:00:00.000Z"
}
```

---

### 5. Deletar Tarefa
**DELETE** `/tasks/:id`

**Exemplo:** `DELETE /tasks/770e8400-e29b-41d4-a716-446655440002`

**Headers:**
```
Nenhum header específico necessário
```

**Resposta de Sucesso (204 No Content):**
```
Sem corpo de resposta
```

**Resposta de Erro - Não Encontrado (404 Not Found):**
```json
{
  "message": "Tarefa não encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 🎯 Cenários de Teste Completos

### Cenário 1: Fluxo Básico de Usuário e Tarefa

**1. Criar um usuário:**
```
POST /users
Body: {"name": "Ana Costa", "email": "ana@example.com"}
```

**2. Anotar o ID do usuário retornado (ex: `abc123...`)**

**3. Criar uma tarefa para este usuário:**
```
POST /tasks
Body: {
  "title": "Minha primeira tarefa",
  "description": "Teste de criação",
  "userId": "abc123..."
}
```

**4. Listar todas as tarefas (verá o nome do usuário):**
```
GET /tasks
```

**5. Atualizar a tarefa para "done":**
```
PUT /tasks/{taskId}
Body: {"status": "done"}
```

---

### Cenário 2: Validações de Erro

**Teste 1 - Email duplicado:**
```
1. POST /users com email "teste@example.com"
2. POST /users novamente com mesmo email
   Resultado esperado: 409 Conflict
```

**Teste 2 - Usuário não encontrado:**
```
GET /users/00000000-0000-0000-0000-000000000000
Resultado esperado: 404 Not Found
```

**Teste 3 - UUID inválido:**
```
POST /tasks
Body: {
  "title": "Teste",
  "description": "Teste",
  "userId": "id-invalido"
}
Resultado esperado: 400 Bad Request
```

**Teste 4 - Campos obrigatórios:**
```
POST /users
Body: {"name": "Teste"}
Resultado esperado: 400 Bad Request (email é obrigatório)
```

**Teste 5 - Status inválido:**
```
POST /tasks
Body: {
  "title": "Teste",
  "description": "Teste",
  "userId": "{userId-válido}",
  "status": "invalid"
}
Resultado esperado: 400 Bad Request
```

---

## 📝 Valores Válidos

### Status de Tarefa
- `pending` (padrão)
- `done`

### Formato de Email
- Deve ser um email válido (ex: `usuario@dominio.com`)

### Formato de UUID
- Formato UUID v4: `550e8400-e29b-41d4-a716-446655440000`

---

## 🚀 Dicas para Testes no Postman

1. **Crie uma Collection** chamada "Teste Técnico - API"

2. **Use Variáveis de Ambiente:**
   - `baseUrl`: `http://localhost:3000`
   - `userId`: Salve o ID após criar um usuário
   - `taskId`: Salve o ID após criar uma tarefa

3. **Exemplo de uso de variável:**
   ```
   {{baseUrl}}/users/{{userId}}
   ```

4. **Salvar ID automaticamente** (na aba Tests da requisição):
   ```javascript
   // Para salvar userId após criar usuário
   pm.environment.set("userId", pm.response.json().id);
   
   // Para salvar taskId após criar tarefa
   pm.environment.set("taskId", pm.response.json().id);
   ```

5. **Ordem sugerida de testes:**
   - Criar Usuário
   - Listar Usuários
   - Buscar Usuário por ID
   - Criar Tarefa
   - Listar Tarefas
   - Buscar Tarefa por ID
   - Atualizar Tarefa
   - Atualizar Usuário
   - Deletar Tarefa
   - Deletar Usuário

---

## 📦 Importar Collection (JSON)

Você pode criar um arquivo JSON no Postman com esta estrutura básica:

```json
{
  "info": {
    "name": "Teste Técnico - API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Criar Usuário",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"João Silva\",\n  \"email\": \"joao.silva@example.com\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users",
              "host": ["{{baseUrl}}"],
              "path": ["users"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## ✅ Checklist de Testes

- [ ] Criar usuário com sucesso
- [ ] Tentar criar usuário com email duplicado (deve falhar)
- [ ] Listar todos os usuários
- [ ] Buscar usuário específico por ID
- [ ] Buscar usuário com ID inexistente (deve falhar)
- [ ] Atualizar nome do usuário
- [ ] Atualizar email do usuário
- [ ] Criar tarefa vinculada a usuário existente
- [ ] Tentar criar tarefa com userId inválido (deve falhar)
- [ ] Listar todas as tarefas (deve mostrar userName)
- [ ] Buscar tarefa específica por ID
- [ ] Atualizar status da tarefa para "done"
- [ ] Atualizar título e descrição da tarefa
- [ ] Deletar tarefa
- [ ] Deletar usuário

---

**Desenvolvido para facilitar os testes da API de Gerenciamento de Usuários e Tarefas** 🚀
