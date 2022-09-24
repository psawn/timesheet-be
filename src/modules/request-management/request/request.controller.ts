import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { RequestService } from './request.service';

@Auth()
@ApiTags('Request')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
}
