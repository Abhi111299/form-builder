import { CreateQuestionDto } from '../dto/create-question.dto';
import { SaveFormUiDto } from '../dto/save-form-ui.dto';
import { mapFieldToQuestion } from './map-field-to-question';

export function mapUiPayloadToQuestions(
  payload: SaveFormUiDto,
): CreateQuestionDto[] {
  const questions: CreateQuestionDto[] = [];

  let sectionOrder = 1;

  // 🔢 sequence per section
  const sectionSequenceMap = new Map<number, number>();

  const nextSequence = (section: number) => {
    const current = sectionSequenceMap.get(section) ?? 1;
    sectionSequenceMap.set(section, current + 1);
    return current;
  };

  for (const item of payload.items) {
    // 🔹 OPEN SECTION FIELD
    if (item.type === 'field') {
      questions.push(
        mapFieldToQuestion(
          payload.id,
          item.data,
          1,
          nextSequence(1),
        ),
      );
    }

    // 🔹 SECTION
    if (item.type === 'section') {
      sectionOrder++;

      for (const field of item.data.fields) {
        questions.push(
          mapFieldToQuestion(
            payload.id,
            field,
            sectionOrder,
            nextSequence(sectionOrder),
            item.data.title,
            item.data.description,
          ),
        );
      }
    }
  }

  return questions;
}
