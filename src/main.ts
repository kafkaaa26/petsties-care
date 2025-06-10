import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { HttpExceptionFilter } from '@core/interceptors/http-exception-filter';
import { config } from '@core/config/app.config';

const getMessageError = (errors: ValidationError[]): string => {
  const error = errors[0];
  if (!error) return 'Unknown error';

  if (!error.children.length) {
    return Object.values(error.constraints)[0];
  }

  return getMessageError(error.children);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS with custom options
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix(config.api_prefix);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(getMessageError(validationErrors));
      },
    }),
  );

  await app.listen(config.port);
}
bootstrap();
