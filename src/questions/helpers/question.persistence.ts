import { BadRequestException } from '@nestjs/common';
import { normalizeQuestion } from '../utils/question.utils';
import { CreateQuestionDto } from '../dto/create-question.dto';

export async function ensureNoDuplicateInDB(
  tx,
  dto: CreateQuestionDto,
  sectionId: Number,
) {
  const duplicate = await tx.formQuestion.findFirst({
    where: {
      formId: Number(dto.formId),
      sectionId,
      type: dto.type,
      questionText: {
        equals: normalizeQuestion(dto.questionText),
      },
      ...(dto.id ? { NOT: { id: Number(dto.id) } } : {}),
    },
  });

  if (duplicate) {
    throw new BadRequestException(
      `Question "${dto.questionText}" with type "${dto.type}" already exists in this section`,
    );
  }
}

export async function replaceOptionsAndRows(tx, dto: CreateQuestionDto) {
  if (!dto.id) return;

  await tx.questionOption.deleteMany({
    where: { questionId: Number(dto.id) },
  });

  if (dto.options?.length) {
    await tx.questionOption.createMany({
      data: dto.options.map((opt, index) => ({
        questionId: Number(dto.id!),
        optionLabel: opt.label,
        optionValue: opt.value,
        orderNo: opt.orderNo ?? index,
      })),
    });
  }

  await tx.questionRow.deleteMany({
    where: { questionId: Number(dto.id) },
  });

  if (dto.rows?.length) {
    await tx.questionRow.createMany({
      data: dto.rows.map((row, index) => ({
        questionId: Number(dto.id!),
        rowLabel: row.label,
        orderNo: row.orderNo ?? index,
      })),
    });
  }
}
