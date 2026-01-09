import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      success: true,
      service: 'form-builder-service',
      status: 'UP',
    };
  }
}
