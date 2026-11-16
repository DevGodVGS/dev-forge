import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException 
      ? exception.message 
      : (exception instanceof Error ? exception.message : 'Internal server error');

    response.status(status).json({
      success: false,
      error: {
        code: `ERR_${status}`,
        message,
        timestamp: new Date().toISOString(),
        requestId: (request.headers['x-request-id'] as string) || `req-${Date.now()}`
      }
    });
  }
}
