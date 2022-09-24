import { Injectable } from '@nestjs/common';
import { RequestRepository } from './request.repository';

@Injectable()
export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}
}
