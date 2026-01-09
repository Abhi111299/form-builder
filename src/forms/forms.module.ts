import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
    PrismaModule,
    AuthModule, // 🔥 REQUIRED FOR JwtAuthGuard
  ],
  controllers: [FormsController],
  providers: [FormsService, PrismaService],
})
export class FormsModule {}
