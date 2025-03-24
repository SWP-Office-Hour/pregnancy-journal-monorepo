import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { fromEvent, Observable, takeUntil } from 'rxjs';

@Injectable()
export class UnsubscribeOnCloseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    const close$ = fromEvent(request.socket, 'close');
    return next.handle().pipe(takeUntil(close$));
  }
}
