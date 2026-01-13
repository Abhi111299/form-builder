import { CreateQuestionDto } from '../dto/create-question.dto';
import { mapUiTypeToDbType } from './type-mapper';

export function mapFieldToQuestion(
  formId: number,
  field: any,
  sectionOrder: number,
  sequence: number,
): CreateQuestionDto {
  return {
    formId,
    sectionOrder,
    questionText: field.question,
    type: mapUiTypeToDbType(field.type),
    required: field.required ?? false,
    sequence,
    options: field.options?.map((o) => ({
      label: o.label,
    })),
    settings: field.fileConfig ?? {},
  };
}
