import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function customDecorators() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad request.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}
