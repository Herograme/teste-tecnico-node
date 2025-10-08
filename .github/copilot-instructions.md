# Copilot Instructions for Solvion-Backend

## Visão Geral da Arquitetura

- Projeto backend em [NestJS](https://nestjs.com/) com TypeScript, estruturado por domínios.
- Cada domínio (ex: `users/`) segue o padrão DDD (Domain-Driven Design) modular, isolando lógica, tipos e contratos.
- O bootstrap da aplicação está em `src/main.ts`, que instancia o `AppModule` (`src/app.module.ts`).
- Exceções, middlewares e utilitários globais ficam em `src/common/`.
- O projeto prioriza tipagem forte e contratos explícitos para comunicação entre camadas.

## Estrutura de Diretórios

- `src/`
  - `app.module.ts` – Módulo raiz, importa e conecta todos os módulos de domínio.
  - `main.ts` – Ponto de entrada da aplicação.
  - `common/`
    - `exception-filters/` – Filtros globais de exceção, incluindo tratamento customizado de erros HTTP.
    - `exceptions/` – Exceções customizadas, base para erros de domínio.
    - `middleware/` – Middlewares globais, como logger.
    - `test/` – Utilitários para testes, como módulos de banco de dados fake.
    - `types/` – Tipos utilitários globais.
  - `[domínio]/` (ex: `users/`)
    - `controller.ts` – Define rotas e orquestra chamadas de serviço.
    - `service.ts` – Lógica de negócio e integração com entidades/repos.
    - `module.ts` – Declara dependências e providers do domínio.
    - `dto/` – Data Transfer Objects para entrada/saída.
    - `entities/` – Entidades de domínio.
    - `types/`
      - `controller/response/` – Tipos de resposta das rotas.
      - `service/payload/` – Tipos de payload para métodos de serviço.
      - `service/return/` – Tipos de retorno dos métodos de serviço.

## Fluxos de Desenvolvimento

- **Instalação:**  
  `npm install`
- **Build e execução:**
  - Desenvolvimento: `npm run start:dev`
  - Produção: `npm run start:prod`
- **Testes:**
  - Unitários: `npm run test`
  - Integração: `npm run test:e2e`
  - Cobertura: `npm run test:cov`
- **Debug:**
  - Use breakpoints no VSCode ou `console.log` para inspecionar fluxos.
  - Para testes, utilize mocks/fakes em `common/test/` para isolar dependências.

## Padrões e Convenções Específicas

- **DTOs e Tipos:**
  - Todos os dados de entrada e saída são validados e tipados via DTOs e tipos explícitos.
  - Exemplo: `users/dto/create-user.dto.ts` define o contrato de criação de usuário.
  - Tipos de payload e retorno de serviços ficam em `types/service/payload` e `types/service/return`.
  - Tipos de resposta de controller ficam em `types/controller/response`.
- **Exceções:**
  - Use exceções customizadas derivadas de `custom.exception.ts` para erros de domínio.
  - Filtros globais em `exception-filters/http-exception/` padronizam respostas de erro.
- **Middlewares:**
  - Logger global em `common/middleware/logger.middleware.ts` para rastreamento de requisições.
- **Testes:**
  - Testes unitários e de integração ficam próximos ao código (`*.spec.ts`).
  - Use `test-database.module.ts` para cenários que exigem banco de dados fake/memória.
- **Organização de Tipos:**
  - Sempre crie tipos específicos para cada camada (controller/service) para garantir isolamento e clareza.
  - Exemplo:
    - `find-user-by-id-payload.type.ts` (entrada do serviço)
    - `find-user-by-id-return.type.ts` (retorno do serviço)
    - `find-user-by-id-response.type.ts` (resposta do controller)

## Integrações e Dependências

- **NestJS**: Framework principal, utilize decorators e injeção de dependências padrão.
- **Validação**: Use decorators de validação nos DTOs (`class-validator`/`class-transformer`).
- **Banco de Dados**: o bando de dados de teste é postegrees, existe uma instancia em um docker somente para testes , de preferencia para mocks em memoria, mas caso o teste não permita pode usar o banco de dados conectado ao projeto.
- **Extensibilidade**: Novos domínios devem seguir o padrão de estrutura do módulo `users/`.

## Exemplos Práticos

- **Novo domínio:**
  1. Crie pasta `src/[domínio]/` com subpastas `dto/`, `entities/`, `types/`.
  2. Implemente `controller.ts`, `service.ts`, `module.ts`.
  3. Defina tipos de payload/retorno em `types/service/` e respostas em `types/controller/response/`.
- **Novo endpoint:**
  1. Adicione método no controller.
  2. Crie DTO para entrada.
  3. Defina tipo de resposta.
  4. Implemente lógica no service, usando tipos de payload/retorno.
  5. Adicione teste unitário e/ou integração.

- **Tratamento de erro customizado:**
  1. Crie exceção em `common/exceptions/custom/`.
  2. Atualize filtro em `exception-filters/http-exception/` se necessário.

## Dicas para Agentes de IA

- Sempre busque exemplos no módulo `users/` antes de criar novos padrões.
- Priorize reutilização de tipos e DTOs existentes.
- Siga a separação clara entre camadas (controller, service, entity, types).
- Para testes, use mocks/fakes de dependências para isolar lógica.
- Consulte `tsconfig.json` e `eslint.config.mjs` para regras de lint e build.

## Arquivos e Diretórios-Chave

- `src/app.module.ts` – Módulo raiz.
- `src/main.ts` – Bootstrap.
- `src/common/` – Utilitários, middlewares, exceções globais.
- `src/users/` – Exemplo completo de módulo de domínio.
- `src/common/test/test-database.module.ts` – Utilitário para testes com banco fake.

## Observações Finais

- Mantenha a estrutura modular e a tipagem forte.
- Documente endpoints e contratos de dados via tipos e DTOs.
- Prefira criar tipos explícitos a usar `any` ou tipos genéricos.
- Testes são obrigatórios para novos fluxos e devem cobrir casos de sucesso e erro.
