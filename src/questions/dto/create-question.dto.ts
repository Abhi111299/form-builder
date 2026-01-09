import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  formId: string;

  // 🔥 NEW (instead of sectionId)
  @IsOptional()
  @IsNumber()
  sectionOrder?: number; // default = 1

  @IsString()
  questionText: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsNumber()
  sequence: number;

  @IsOptional()
  settings?: any;

  @IsOptional()
  @IsArray()
  options?: {
    label: string;
    value?: string;
    orderNo?: number;
  }[];

  @IsOptional()
  @IsArray()
  rows?: {
    label: string;
    orderNo?: number;
  }[];
}
