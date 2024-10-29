// src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const exceptionResponseObj = exceptionResponse as Record<string, any>;
        message = exceptionResponseObj.message || message;
        errorDetails = exceptionResponseObj.error || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = exception.stack;
    } else {
      message = String(exception);
    }

    console.error('Exception caught by filter:', exception);

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      error: errorDetails,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
