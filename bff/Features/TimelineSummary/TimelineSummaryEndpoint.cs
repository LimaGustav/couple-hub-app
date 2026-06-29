using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Threading.Tasks;
using CoupleHub.Bff.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace CoupleHub.Bff.Features.TimelineSummary;

public class TimelineSummaryEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/v1/timeline/summary", async (
            IHttpClientFactory httpClientFactory,
            HttpContext httpContext) =>
        {
            // 1. Extração do ID do Usuário Autenticado
            var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? httpContext.User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            // 2. Criação dos Clientes HTTP injetados via DependencyInjection
            var identityClient = httpClientFactory.CreateClient("IdentityService");
            var tasksClient = httpClientFactory.CreateClient("TasksService");

            /*
             * ESTRUTURA BASE PARA AGREGAR DADOS DE OUTROS SERVIÇOS NO FUTURO:
             * 
             * try
             * {
             *     // Opcional: Propagar o Token JWT original no cabeçalho Authorization das requisições downstream
             *     var authHeader = httpContext.Request.Headers["Authorization"].ToString();
             *     if (!string.IsNullOrEmpty(authHeader))
             *     {
             *         identityClient.DefaultRequestHeaders.Add("Authorization", authHeader);
             *         tasksClient.DefaultRequestHeaders.Add("Authorization", authHeader);
             *     }
             * 
             *     // Executa chamadas assíncronas em paralelo para otimizar a performance do BFF
             *     var partnerTask = identityClient.GetFromJsonAsync<PartnerProfileDto>($"/v1/users/{userId}/partner");
             *     var tasksTask = tasksClient.GetFromJsonAsync<List<TaskSummaryItemDto>>($"/v1/tasks?userId={userId}");
             * 
             *     await Task.WhenAll(partnerTask, tasksTask);
             * 
             *     var summary = new TimelineSummaryDto
             *     {
             *         PartnerName = partnerTask.Result?.Name ?? "Parceiro",
             *         PartnerPhotoUrl = partnerTask.Result?.PhotoUrl ?? string.Empty,
             *         RecentTasks = tasksTask.Result ?? new List<TaskSummaryItemDto>()
             *     };
             * 
             *     return Results.Ok(summary);
             * }
             * catch (Exception ex)
             * {
             *     // Tratar erro de integração e fazer log...
             *     return Results.Problem("Erro ao obter dados consolidados do BFF: " + ex.Message);
             * }
             */

            // Retorno Mockado Temporário (Estrutura Base de Desenvolvimento)
            var mockSummary = new TimelineSummaryDto
            {
                PartnerName = "Beatriz Silva (Mock)",
                PartnerPhotoUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
                RecentTasks = new List<TaskSummaryItemDto>
                {
                    new() 
                    { 
                        Id = Guid.NewGuid(), 
                        Title = "Comprar ingressos para o cinema", 
                        Status = "Pendente", 
                        DueDate = DateTime.UtcNow.AddDays(1) 
                    },
                    new() 
                    { 
                        Id = Guid.NewGuid(), 
                        Title = "Reservar mesa para o jantar de aniversário", 
                        Status = "Pendente", 
                        DueDate = DateTime.UtcNow.AddDays(3) 
                    }
                }
            };

            return await Task.FromResult(Results.Ok(mockSummary));
        })
        .WithName("GetTimelineSummary")
        .WithTags("Timeline")
        .RequireAuthorization() // Exige autenticação
        .RequireRateLimiting(Common.RateLimitPolicies.FixedWindowPolicy); // Exige Rate Limiting
    }
}
