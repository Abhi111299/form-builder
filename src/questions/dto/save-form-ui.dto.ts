// src/questions/dto/save-form-ui.dto.ts

import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveFormUiDto {
  @IsNumber()
  id: number; // formId

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsArray()
  items: any[];
}
