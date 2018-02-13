export class Response {
    public static SendHtmlResponse(res, statusCode: number, body: string) {
        const headers = {
            "Content-Type": "text/html",
        };
        res.writeHead(statusCode, headers);
        res.write(body);
        res.end();
    }

    public static SendJsonResponse(res, object: any) {
        const headers = {
            "Content-Type": "application/json",
        };
        res.writeHead(200, headers);
        res.write(JSON.stringify(object));
        res.end();
    }

    public static SendErrorResponse(res, errorCode: number, errorMessage: string, errorDetails: any) {
        // Error code:
        // 200 - OK
        // 400 - Bad Request, e.g.: required parameter has not been provided, or the value supplied is invalid.
        // 401 - Unauthorized, e.g.: user is not authenticated, or user is not authorized to access.
        // 500 - Internal Server Error, e.g.: backend error, or an unexpected error occurred while processing the request.
        // Error message: This message is passed on to the user.
        // Error details: Verbose, plain language description of the problem for the app developer with hints about how to fix it.
        const headers = {
            "Content-Type": "application/json",
        };
        res.writeHead(errorCode, headers);
        const data = {
            "code": errorCode,
            "message": errorMessage,
            "details": errorDetails,
        };
        res.write(JSON.stringify(data));
        res.end();
    }
}
