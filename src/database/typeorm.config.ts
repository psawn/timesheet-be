import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/shared/services/config.service';

const configService = new ConfigService();

export const typeOrmConfig: TypeOrmModule = {
  type: configService.db.type,
  host: configService.db.host,
  port: configService.db.port,
  username: configService.db.username,
  password: configService.db.password,
  database: configService.db.database,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
