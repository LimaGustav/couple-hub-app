using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace identity_service.Common.Errors;

public static class ProblemDetailsExtensions
{
    public static IResult ToProblemResult(this Exception exception, int statusCode = StatusCodes.Status500InternalServerError, string title = "An error occurred")
    {
        return Results.Problem(
            detail: exception.Message,
            statusCode: statusCode,
            title: title
        );
    }

    public static IResult ToBadRequestProblem(string detail, string title = "Bad Request")
    {
        return Results.Problem(
            detail: detail,
            statusCode: StatusCodes.Status400BadRequest,
            title: title
        );
    }
    
    public static IResult ToNotFoundProblem(string detail, string title = "Not Found")
    {
        return Results.Problem(
            detail: detail,
            statusCode: StatusCodes.Status404NotFound,
            title: title
        );
    }
}
