import { BadRequestException } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { normalizeQuestion } from './question.utils';

export function validateDuplicateQuestionsInPayload(
  questions: CreateQuestionDto[],
) {
  const seen = new Set<string>();

  for (const q of questions) {
    const sectionOrder = q.sectionOrder ?? 1;

    const key = `${q.formId}-${sectionOrder}-${q.type}-${normalizeQuestion(
      q.questionText,
    )}`;

    if (seen.has(key)) {
      throw new BadRequestException(
        `Duplicate question "${q.questionText}" with type "${q.type}" in section ${sectionOrder}`,
      );
    }

    seen.add(key);
  }
}

export function validateDuplicateSequencesInPayload(
  questions: CreateQuestionDto[],
) {
  const seen = new Set<string>();

  for (const q of questions) {
    const sectionOrder = q.sectionOrder ?? 1;

    const key = `${sectionOrder}-${q.sequence}`;

    if (seen.has(key)) {
      throw new BadRequestException(
        `Duplicate sequence ${q.sequence} in section ${sectionOrder}`,
      );
    }

    seen.add(key);
  }
}
