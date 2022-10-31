import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('GREETING_SERVICE') private client: ClientProxy) {}

  async getHello() {
    return this.client.send({ cmd: 'greeting' }, 'Progressive Coder');
  }

  async getHelloAsync() {
    const message = this.client.send(
      { cmd: 'greeting-async' },
      'Progressive Coder',
    );
    return message;
  }

  async publishEvent() {
    this.client.emit('book-created', {
      bookName: 'The Way Of Kings',
      author: 'Brandon Sanderson',
    });
  }

  async test() {
    return this.client.send({ cmd: 'add-subscriber' }, 'add-test-post1ádadasd');
  }
}
