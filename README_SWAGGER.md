# 📚 Documentação da API com Swagger

## 🎯 Acesso à Documentação Interativa

A API possui documentação completa e interativa gerada automaticamente com **Swagger/OpenAPI 3.0**:

🔗 **URL da Documentação:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## ✨ Recursos do Swagger

- ✅ **Documentação Completa** - Todos os endpoints documentados com exemplos detalhados
- ✅ **Try it Out** - Teste as requisições diretamente no navegador sem precisar de ferramentas externas
- ✅ **Schemas Detalhados** - Visualize todos os DTOs, entidades e tipos de resposta
- ✅ **Validações Explícitas** - Veja todas as regras de validação de cada campo
- ✅ **Códigos de Status HTTP** - Todos os possíveis retornos HTTP documentados (200, 201, 400, 404, 409, etc.)
- ✅ **Exemplos de Erro** - Exemplos de respostas de erro para cada cenário possível
- ✅ **Tipos TypeScript** - Documentação gerada automaticamente dos tipos do código

## 🚀 Como Usar o Swagger

### Passo a Passo

1. **Inicie a aplicação:**
   ```bash
   npm run start:dev
   ```

2. **Acesse** a URL da documentação:
   ```
   http://localhost:3000/api/docs
   ```

3. **Explore** os endpoints organizados por tags:
   - **users** - Gerenciamento de usuários
   - **tasks** - Gerenciamento de tarefas

4. **Visualize** detalhes de cada endpoint:
   - Clique em qualquer rota para expandir
   - Veja parâmetros, corpo da requisição e respostas possíveis

5. **Teste** as requisições:
   - Clique em **"Try it out"**
   - Preencha os campos necessários
   - Clique em **"Execute"**
   - Visualize a resposta em tempo real

## 📋 Endpoints Documentados

### 👤 Users (Usuários)

#### POST /users
- **Descrição:** Criar novo usuário
- **Body:** `CreateUserDto`
  ```json
  {
    "name": "João Silva",
    "email": "joao.silva@example.com"
  }
  ```
- **Respostas:**
  - `201` - Usuário criado com sucesso
  - `400` - Dados inválidos
  - `409` - Email já cadastrado

#### GET /users
- **Descrição:** Listar todos os usuários
- **Respostas:**
  - `200` - Lista de usuários retornada

#### GET /users/:id
- **Descrição:** Buscar usuário por UUID
- **Parâmetros:** `id` (UUID do usuário)
- **Respostas:**
  - `200` - Usuário encontrado
  - `404` - Usuário não encontrado

#### PUT /users/:id
- **Descrição:** Atualizar dados do usuário
- **Parâmetros:** `id` (UUID do usuário)
- **Body:** `UpdateUserDto` (todos os campos opcionais)
- **Respostas:**
  - `200` - Usuário atualizado
  - `404` - Usuário não encontrado
  - `409` - Email já em uso por outro usuário

#### DELETE /users/:id
- **Descrição:** Deletar usuário (deleta tarefas em cascata)
- **Parâmetros:** `id` (UUID do usuário)
- **Respostas:**
  - `204` - Usuário deletado
  - `404` - Usuário não encontrado

### ✅ Tasks (Tarefas)

#### POST /tasks
- **Descrição:** Criar nova tarefa
- **Body:** `CreateTaskDto`
  ```json
  {
    "title": "Estudar NestJS",
    "description": "Estudar conceitos fundamentais do NestJS",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "pending"
  }
  ```
- **Respostas:**
  - `201` - Tarefa criada
  - `400` - Dados inválidos
  - `404` - Usuário não encontrado

#### GET /tasks
- **Descrição:** Listar todas as tarefas (inclui nome do usuário)
- **Respostas:**
  - `200` - Lista de tarefas com userName

#### GET /tasks/:id
- **Descrição:** Buscar tarefa por UUID
- **Parâmetros:** `id` (UUID da tarefa)
- **Respostas:**
  - `200` - Tarefa encontrada
  - `404` - Tarefa não encontrada

#### PUT /tasks/:id
- **Descrição:** Atualizar dados da tarefa
- **Parâmetros:** `id` (UUID da tarefa)
- **Body:** `UpdateTaskDto` (todos os campos opcionais)
- **Respostas:**
  - `200` - Tarefa atualizada
  - `404` - Tarefa não encontrada

#### DELETE /tasks/:id
- **Descrição:** Deletar tarefa
- **Parâmetros:** `id` (UUID da tarefa)
- **Respostas:**
  - `204` - Tarefa deletada
  - `404` - Tarefa não encontrada

## 🎨 Interface do Swagger

A interface do Swagger é limpa e intuitiva, com:

- **Seções por Tag** - Endpoints agrupados logicamente
- **Expandir/Colapsar** - Navegação fácil entre rotas
- **Schemas Interativos** - Clique para ver estrutura completa dos objetos
- **Códigos de Exemplo** - Exemplos de requisição e resposta em JSON
- **Autorização** - Preparado para futuras implementações de autenticação

## 🔧 Configuração Técnica

### Pacotes Utilizados

```json
{
  "@nestjs/swagger": "^latest",
  "@fastify/static": "^latest"
}
```

### Configuração no main.ts

A documentação é configurada automaticamente no bootstrap da aplicação:

```typescript
const config = new DocumentBuilder()
  .setTitle('API de Gerenciamento de Usuários e Tarefas')
  .setDescription('API REST Enterprise desenvolvida com NestJS...')
  .setVersion('1.0.0')
  .addTag('users', 'Endpoints para gerenciamento de usuários')
  .addTag('tasks', 'Endpoints para gerenciamento de tarefas')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### Decoradores Utilizados

Todos os endpoints estão documentados com:

- `@ApiTags()` - Agrupa endpoints por recurso
- `@ApiOperation()` - Descreve a operação
- `@ApiResponse()` - Define respostas possíveis
- `@ApiParam()` - Documenta parâmetros de rota
- `@ApiBody()` - Documenta corpo da requisição
- `@ApiProperty()` - Documenta propriedades dos DTOs
- `@ApiPropertyOptional()` - Documenta propriedades opcionais

## 🎯 Benefícios da Documentação Swagger

1. **Para Desenvolvedores:**
   - Teste rápido de endpoints sem Postman/Insomnia
   - Visualização clara de contratos de API
   - Exemplos prontos para usar

2. **Para Equipe:**
   - Documentação sempre atualizada (gerada do código)
   - Facilita onboarding de novos membros
   - Reduz dúvidas sobre a API

3. **Para Clientes:**
   - Interface amigável para explorar a API
   - Testes sem necessidade de ferramentas técnicas
   - Documentação visual e interativa

## 📖 Documentação Adicional

Para mais informações sobre como usar a API, consulte:

- **[README.md](./README.md)** - Documentação completa do projeto
- **[README_POSTMAN.md](./README_POSTMAN.md)** - Guia com exemplos no Postman

---

<p align="center">
  <strong>Desenvolvido com ❤️ usando NestJS e Swagger</strong>
</p>
