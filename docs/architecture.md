# Couble Hub

## Arquitetura

```mermaid
flowchart TD
  %% Definição de Estilos e Camadas
  subgraph Client_Layer [Camada de Apresentação]
    UI[React / Vite Web App] 
  end

  subgraph Ingress_Layer [Borda & Roteamento]
    LB[Load Balancer: Nginx / Traefik]
    BFF[BFF / API Gateway: C# .NET 10]
  end

  subgraph Core_Services [Malha de Microsserviços C# .NET 10]
    AUTH[Identity & Gateway Service]
    VOTE[Match & Vote Service]
    WAL[Wallet Service]
    TASK[Tasks Service]
    PRIZE[Prize Service]
    TIME[Timeline Service]
  end

  subgraph Event_Cache_Layer [Mensageria & Cache Distribuído]
    KAFKA[[Apache Kafka Cluster]]
    REDIS_VOTE[(Redis: Session & Tiebreaker)]
    REDIS_TIME[(Redis: Cache-Aside)]
  end

  subgraph Database_Layer [Persistência Poliglota Hidratada]
    subgraph SQL_Cluster [Ecossistema SQL Server - ACID]
      SQL_AUTH[(SQL: Identity DB)]
      SQL_WAL_M[(SQL: Wallet Master)]
      SQL_WAL_S[(SQL: Wallet Slave Replica)]
      SQL_TASK[(SQL: Tasks DB)]
      SQL_PRIZE[(SQL: Prizes DB)]
    end
    
    subgraph Mongo_Cluster [Replica Set MongoDB]
      MG_P[(Mongo: Primary)]
      MG_S[(Mongo: Secondary)]
      MG_A[(Mongo: Arbiter)]
    end

    OBJ_STORE[(Object Storage: MinIO / S3)]
  end

  %% --- FLUXOS DE COMUNICAÇÃO ---

  %% Entrada de Dados e Conexões do Cliente
  UI -->|1. API Rest| LB
  UI <-->|2. Persistente WebSocket| LB
  LB --> BFF

  %% Roteamento do BFF para Microsserviços
  BFF -->|HTTP| AUTH
  BFF <-->|WebSocket| VOTE
  BFF -->|HTTP| WAL
  BFF -->|HTTP| TASK
  BFF -->|HTTP| PRIZE
  BFF -->|HTTP| TIME

  %% Comunicação com Banco de Dados e Caches Específicos
  AUTH --> SQL_AUTH
  
  VOTE <-->|Compare and Timeout| REDIS_VOTE

  WAL -->|Write Debit and Credit| SQL_WAL_M
  SQL_WAL_M -->|Async Replication| SQL_WAL_S
  WAL -.->|Read and Extract| SQL_WAL_S

  TASK --> SQL_TASK
  PRIZE --> SQL_PRIZE

  TIME <-->|Feed Cache| REDIS_TIME
  TIME -->|Json and flexible documents| MG_P
  MG_P <-->|Native Replication| MG_S
  MG_A <-->| | MG_P
  TIME -.->|Image/Videos| OBJ_STORE

  %% Espinha Dorsal de Eventos (Apache Kafka)
  TASK -->|Produces: lovesync.tasks.completed| KAFKA
  PRIZE -->|Produces: lovesync.prize.redeem| KAFKA
  

  KAFKA -->|Consume| WAL
```

  ### Matriz de Design Arquitetural dos Microsserviços (.NET 10)

| Microsserviço | Camada de Exposição (Borda) | Arquitetura Interna (Pattern) | Acesso a Dados (Persistência / Cache) | Justificativa de System Design |
| :--- | :--- | :--- | :--- | :--- |
| **BFF / Gateway** | Minimal APIs | **Proxy / Aggregator Pattern** | Sem banco de dados próprio | Centraliza a segurança (validação de JWT), simplifica a comunicação do React eliminando o CORS múltiplo e faz agregação de dados em paralelo para otimizar as requisições da UI. |
| **Identity Service** | Minimal APIs | **Vertical Slices** | EF Core direto no DbContext (SQL Server - Identity DB) | Domínio relacional estável e focado em operações transacionais de cadastro (CRUD), login e geração de tokens, sem complexidade que justifique CQRS. |
| **Tasks Service** | Minimal APIs | **Vertical Slices** | EF Core direto no DbContext (SQL Server - Tasks DB) | Gerencia o ciclo de vida e aprovação das tarefas. As fatias verticais isolam o código de cada funcionalidade (ex: Criar Tarefa, Concluir Tarefa), facilitando a manutenção. |
| **Prize Service** | Minimal APIs | **Vertical Slices** | EF Core direto no DbContext (SQL Server) + **Redis (Redlock)** | Controla a loja de recompensas. O uso do algoritmo Redlock impede *race conditions* perigosas (ex: múltiplos cliques simulando resgates concorrentes do mesmo prêmio). |
| **Match & Vote Service** | Minimal APIs + **SignalR Hubs** | **Vertical Slices (Event-Driven In-Memory)** | **StackExchange.Redis** (Hashes com TTL) \| *Sem banco relacional* | Operação pura em tempo real para a roleta do casal. O SignalR gerencia conexões persistentes WebSockets e o Redis armazena os votos voláteis com expiração automática por TTL. |
| **Wallet Service** | Minimal APIs | **CQRS (com MediatR)** | **EF Core** (Escrita no Master) / **Dapper** (Leitura na Réplica Slave) | Livro-caixa financeiro crítico. Separa comandos complexos de alteração de saldo (Master ACID) de consultas pesadas de extrato histórico de tokens executadas na Réplica de Leitura. |
| **Timeline Service** | Minimal APIs | **CQRS (com MediatR)** | **MongoDB Driver** (Replica Set) + **Redis** (Estratégia Cache-Aside) | O microsserviço mais lido do sistema. Utiliza persistência de documentos JSON flexíveis e um cache de alta performance para entregar o feed em poucos milissegundos sem onerar a base. |


## Features

### Successfull auth
```mermaid
sequenceDiagram
    autonumber
    actor Casal as Usuário (React App)
    participant BFF as BFF / API Gateway (.NET 10)
    participant AUTH as Identity Service (.NET 10)
    participant DB as SQL Server (Identity DB)

    Casal->>+BFF: POST /v1/auth/login { email, password }
    BFF->>+AUTH: POST /v1/auth/login { email, password }
    AUTH->>+DB: Busca usuário pelo Email
    
    alt Caso A: Usuário não existe
        DB-->>AUTH: Retorna Nulo (Não encontrado)
    else Caso B: Senha incorreta
        DB-->>AUTH: Retorna dados, mas a senha não bate
    end
    
    Note over AUTH: Falha na Autenticação!<br/>Gera resposta padronizada (RFC 7807)
    
    AUTH-->>-BFF: Retorna 401 Unauthorized + ProblemDetails JSON
    BFF-->>-Casal: Repassa 401 Unauthorized + ProblemDetails JSON
    
    Note over Casal: Axios captura o erro 401 no bloco .catch()<br/>e exibe "E-mail ou senha inválidos" na tela
```

### Unsuccessfull auth
```mermaid
sequenceDiagram
    autonumber
    actor Casal as Usuário (React App)
    participant BFF as BFF / API Gateway (.NET 10)
    participant AUTH as Identity Service (.NET 10)
    participant DB as SQL Server (Identity DB)

    Casal->>+BFF: POST /v1/auth/login { email, password }
    BFF->>+AUTH: POST /v1/auth/login { email, password }
    AUTH->>+DB: Busca usuário pelo Email
    
    alt Caso A: Usuário não existe
        DB-->>AUTH: Retorna Nulo (Não encontrado)
    else Caso B: Senha incorreta
        DB-->>AUTH: Retorna dados, mas a senha não bate
    end
    
    Note over AUTH: Falha na Autenticação!<br/>Gera resposta padronizada (RFC 7807)
    
    AUTH-->>-BFF: Retorna 401 Unauthorized + ProblemDetails JSON
    BFF-->>-Casal: Repassa 401 Unauthorized + ProblemDetails JSON
    
    Note over Casal: Axios captura o erro 401 no bloco .catch()<br/>e exibe "E-mail ou senha inválidos" na tela
```

### Registration 
'''mermaid
sequenceDiagram
    autonumber
    actor Usuario as Usuário (Tela)
    participant Front as Front-end (React)
    participant BFF as BFF (Orquestrador)
    participant Identity as Identity Service

    Usuario->>Front: Preenche dados e clica em "Cadastrar"
    Front->>BFF: POST /api/auth/register (Uma única requisição)
    
    Note over BFF, Identity: Passo 1: Criação da Conta
    BFF->>Identity: POST /auth/signup (ou endpoint de registo)
    Note over Identity: Cria o utilizador no Banco de Dados.
    Identity-->>BFF: HTTP 201 Created (Utilizador criado)
    
    Note over BFF, Identity: Passo 2: Autenticação Imediata
    BFF->>Identity: POST /auth/login (Chama o login com as mesmas credenciais)
    Note over Identity: Valida as credenciais e gera o JWT.
    Identity-->>BFF: HTTP 200 OK (Retorna o Token JWT)
    
    Note over BFF, Front: Passo 3: Envio dos dados consolidados
    BFF-->>Front: HTTP 201 (Payload: { token, user })
    
    Front->>Front: useAuth.login(token, user) <br/>(Salva o token localmente)
    Front->>Usuario: Redireciona direto para a Home
'''