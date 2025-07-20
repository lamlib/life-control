import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { IS_SKIP_TRANSFORM } from '../constants/transform.constants';

interface StardardResponse<T> {
  data: T;
  status: string;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StardardResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StardardResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status = response.statusCode;

    const isSkipTranform = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_TRANSFORM,
      [context.getHandler(), context.getClass()],
    );

    if (isSkipTranform) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const responseData = data ?? {};
        const message = this.getDefaultMessage(status);
        const finalMessage = responseData.message ?? message;
        const finalStatus = responseData.status ?? status;

        if (responseData) {
          delete responseData.message;
          delete responseData.status;
        }

        return {
          data: responseData,
          status: finalStatus,
          message: finalMessage,
        };
      }),
    );
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case HttpStatus.OK:
        return 'Request was successful';
      case HttpStatus.CREATED:
        return 'Resource created successfully';
      case HttpStatus.NO_CONTENT:
        return 'No content';
      case HttpStatus.BAD_REQUEST:
        return 'Bad request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not found';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal server error';
      default:
        return 'Request processed successfully';
    }
  }
}
