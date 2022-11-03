import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmitterService } from './event-emitter.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EmitterService],
  exports: [EmitterService],
})
export class EmitterModule {}
