import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { FormsModule } from './forms/forms.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // REQUIRED
    }),
    PrismaModule,
    FormsModule,
    AuthModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
