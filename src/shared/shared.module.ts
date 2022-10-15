import { Module } from '@nestjs/common';
import { S3Service } from './services/aws.service';
import { ConfigService } from './services/config.service';
import { MailService } from './services/mail.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, MailService, S3Service],
  exports: [ConfigService, MailService, S3Service],
})
export class SharedModule {}
