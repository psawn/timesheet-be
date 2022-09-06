import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

export function Auth() {
  return applyDecorators(
    UseGuards(
      // phải theo đúng thứ tự JwtAuthGuard->RolesGuard (C1)
      JwtAuthGuard,
      RolesGuard,
    ),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
