import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// https://blog.stackademic.com/standardizing-api-responses-in-nestjs-with-interceptors-and-exception-filters-cf65efd27d04
@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exception as any).message || exception.message;

      if (Array.isArray(message)) {
        message = message[0];
      }
    }

    response.status(status).json({
      data: null,
      status,
      message,
    });
  }
}
