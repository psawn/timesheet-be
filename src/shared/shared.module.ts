import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { MailService } from './services/mail.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, MailService],
  exports: [ConfigService, MailService],
})
export class SharedModule {}
