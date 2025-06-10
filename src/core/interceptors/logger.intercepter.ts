import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerIntercepter implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { url, method, params, query, body } = req;
    const logger = new Logger();
    logger.log(
      {
        url,
        method,
        params,
        query,
        body,
      },
      'Request',
    );

    return next.handle().pipe(
      tap((data) =>
        logger.log(
          {
            statusCode: data.statusCode,
            message: data.message,
            // ...data,
          },
          'Response',
        ),
      ),
    );
  }
}
