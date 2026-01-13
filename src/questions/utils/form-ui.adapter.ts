import { SaveFormUiDto } from '../dto/save-form-ui.dto';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { mapFieldToQuestion } from './map-field-to-question';

export function mapUiPayloadToQuestions(
  payload: SaveFormUiDto,
): CreateQuestionDto[] {
  const questions: CreateQuestionDto[] = [];

  let sectionOrder = 1;
  let sequence = 1;

  for (const item of payload.items) {
    // 🔹 TOP-LEVEL FIELD → OPEN SECTION
    if (item.type === 'field') {
      questions.push(
        mapFieldToQuestion(
          payload.id,
          item.data,
          1,
          sequence++,
        ),
      );
    }

    // 🔹 SECTION
    if (item.type === 'section') {
      sectionOrder++;

      let localSequence = 1;

      for (const field of item.data.fields) {
        questions.push(
          mapFieldToQuestion(
            payload.id,
            field,
            sectionOrder,
            localSequence++,
          ),
        );
      }
    }
  }

  return questions;
}
