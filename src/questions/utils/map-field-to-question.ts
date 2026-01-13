import { CreateQuestionDto } from '../dto/create-question.dto';
import { mapUiTypeToDbType } from './map-ui-type';

export function mapFieldToQuestion(
  formId: number,
  field: any,
  sectionOrder: number,
  sequence: number,
  sectionTitle?: string,
  sectionDescription?: string,
): CreateQuestionDto {
  return {
    id: field.id ? Number(field.id) : undefined,

    formId, // ✅ ALWAYS present

    sectionOrder,
    sequence, // ✅ ALWAYS present

    questionText: field.question,
    type: mapUiTypeToDbType(field.type),
    required: field.required ?? false,

    sectionTitle,
    sectionDescription,

    settings: {
      placeholder: field.placeholder,
      hasOther: field.hasOther,
      fileConfig: field.fileConfig,
    },

    options: field.options?.map((o, i) => ({
      label: o.label,
      orderNo: i,
    })) ?? [],

    rows: field.rows ?? [],
  };
}
