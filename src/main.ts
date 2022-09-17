import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.select(SharedModule).get(ConfigService);

  app.enableCors();
  setupSwagger(app);
  await app.listen(3000);
  logger.log(`Application listening on port ${configService.port}`);
}
bootstrap();
