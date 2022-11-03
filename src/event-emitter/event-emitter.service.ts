import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent() {
    console.log('first');
    this.eventEmitter.emit('msg.sent', 'Hello World');
  }

  @OnEvent('msg.sent')
  listentToEvent(msg: string) {
    console.log('second');
  }
}
