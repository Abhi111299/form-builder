import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateBulkQuestionDto } from './dto/create-bulk-questions.dto';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateQuestionDto, @Req() req) {
    return this.questionsService.createQuestion(dto, req.user);
  }

    @Post('bulk')
    @Roles('admin')
    async bulkCreate(
    @Body() dto: CreateBulkQuestionDto,
    @Req() req,
    ) {
    return this.questionsService.bulkCreateQuestions(dto.questions, req.user);
    }
}
