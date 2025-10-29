import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export const serializer = (
  dto: any,
  data: any,
  options?: ClassTransformOptions,
) => {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
    ...options,
  });
};

export const Serialize = (dto: any) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(public dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return serializer(this.dto, data);
      }),
    );
  }
}
