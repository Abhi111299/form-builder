
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FormResponseDto } from './dto/form-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('Forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateFormDto, @Req() req) {
    console.log("####################",req.user);
    return this.formsService.create(dto, req.user);
  }

  @Get()
@Roles('admin')
@ApiBearerAuth()
@ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
@ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
async getAllForms(
  @Req() req,
  @Query() query: PaginationQueryDto,
) {
  return this.formsService.getAllFormsByAdmin(
    req.user.userId,
    query.page ?? 1,
    query.limit ?? 10,
  );
}


  @Get(':formId')
  @Roles('admin')
  async getCompleteForm(
    @Param('formId', ParseIntPipe) formId: number,
    @Req() req,
  ) {
    return this.formsService.getCompleteForm(formId, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.formsService.findAll(req.user);
  }

  @Get('mine')
  findMine(@Req() req) {
    return this.formsService.findMine(req.user);
  }
}
