import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { SocketIoAdaptor } from './socket/socker-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new I18nValidationPipe({ whitelist: true }));
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const adapter = new SocketIoAdaptor(app);
  app.useWebSocketAdapter(adapter);

  await app.listen(3000);
}
bootstrap();
