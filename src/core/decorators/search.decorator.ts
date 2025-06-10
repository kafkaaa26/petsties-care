import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

function getMessage(errors: ValidationError[]): string {
  const error = errors[0];
  if (!error) return 'Unknown error';

  if (!error.children.length) {
    return Object.values(error.constraints)[0];
  }

  return getMessage(error.children);
}

export const Search = createParamDecorator(
  async (T: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const transformed = plainToInstance(T, request.query);
    const errors = await validate(transformed);
    if (errors.length) {
      throw new BadRequestException(getMessage(errors));
    }

    const query = new T();
    return Object.assign(query, transformed);
  },
);
