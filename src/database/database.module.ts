import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/shared/services/config.service';
import { SharedModule } from 'src/shared/shared.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.db.host,
        port: configService.db.port,
        username: configService.db.username,
        password: configService.db.password,
        database: configService.db.database,
        entities: ['dist/**/*.entity.js'],
        logging: false,
        synchronize: true,
        migrationsRun: false,
        migrationsTransactionMode: 'each',
        migrations: [
          // 'src/database/migrations/*.ts',
          'dist/database/migrations/*{.ts,.js}',
        ],
      }),
    }),
  ],
})
export class DataBaseModule {}
