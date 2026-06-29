# Estrutura de Pastas e Fluxo de Configuração (BFF)

Aqui está a descrição da arquitetura de pastas implementada e a validação do uso correto das configurações contidas no [appsettings.json](file:///c:/Users/OLIMPIADA2024/Desktop/couple-hub/bff/appsettings.json).

---

## 🌳 Árvore do Projeto e Responsabilidades

```text
bff/
├── 📂 Common/                          # Políticas e regras transversais reutilizáveis
│   ├── CorsPolicies.cs                 # Configura CORS. Consome: "CorsSettings:AllowedOrigins"
│   └── RateLimitPolicies.cs            # Configura Rate Limiter de segurança (IP Rate Limit)
│
├── 📂 Extensions/                      # Extensões do pipeline ASP.NET
│   ├── DependencyInjection.cs          # Registra autenticação e clientes HTTP. Consome: "JwtSettings", "Microservices"
│   └── EndpointExtensions.cs           # Escaneamento reflexivo e mapeamento automático de Minimal APIs
│
├── 📂 Features/                        # Endpoints customizados (agregação/orquestração local)
│   └── 📂 TimelineSummary/             
│       ├── TimelineSummaryDto.cs       # DTO para a resposta consolidada
│       └── TimelineSummaryEndpoint.cs  # Agrega chamadas aos microsserviços. Consome: Clientes HTTP ("IdentityService", "TasksService")
│
├── 📂 Middlewares/                     # Interceptadores globais de requisições
│   └── ClaimsTransformationMiddleware.cs # Valida dados, limpa cabeçalhos e injeta claims decodificadas como Headers
│
├── Program.cs                          # Configuração e orquestração do pipeline ASP.NET e YARP
├── appsettings.json                    # Arquivo de configuração principal
└── bff.csproj                          # Configuração do projeto e dependências NuGet (Yarp, JwtBearer)
```

---

## 🔍 Validação de Consumo do `appsettings.json`

O [appsettings.json](file:///c:/Users/OLIMPIADA2024/Desktop/couple-hub/bff/appsettings.json) está sendo consumido de forma completa e correta pelo BFF:

| Seção / Chave no JSON | Onde é Consumido | O que Faz no Sistema |
| :--- | :--- | :--- |
| `CorsSettings:AllowedOrigins` | [CorsPolicies.cs](file:///c:/Users/OLIMPIADA2024/Desktop/couple-hub/bff/Common/CorsPolicies.cs) | Permite requisições dinâmicas de origens específicas (ex: React Frontend). |
| `JwtSettings` (`Issuer`, `Audience`, `SecretKey`) | [DependencyInjection.cs](file:///c:/Users/OLIMPIADA2024/Desktop/couple-hub/bff/Extensions/DependencyInjection.cs) | Valida a assinatura, tempo de expiração e público-alvo dos tokens JWT enviados pelo client. |
| `Microservices` (`IdentityUrl`, `TasksUrl`, `MatchUrl`) | [DependencyInjection.cs](file:///c:/Users/OLIMPIADA2024/Desktop/couple-hub/bff/Extensions/DependencyInjection.cs) | Define as URLs base usadas pelos `HttpClient` locais em endpoints agregadores de Features. |
| `ReverseProxy` (`Routes` e `Clusters`) | [Program.cs](file:///c:/Users/OLIMPIADA2024/Desktop/couple-hub/bff/Program.cs) | Define o redirecionamento de rotas e clusters do YARP (ex: `/v1/tasks/**` -> `tasks-cluster`). |
| `AuthorizationPolicy` & `RateLimiterPolicy` (Rotas YARP) | [appsettings.json](file:///c:/Users/OLIMPIADA2024/Desktop/couple-hub/bff/appsettings.json) | **[Ajustado]** Informa ao YARP para aplicar a política de validação de token (`Default`) e Rate Limiting (`FixedWindow`) nas rotas do proxy. |
