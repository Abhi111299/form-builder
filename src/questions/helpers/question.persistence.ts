import { BadRequestException } from '@nestjs/common';
import { normalizeQuestion } from '../utils/question.utils';
import { CreateQuestionDto } from '../dto/create-question.dto';

export async function ensureNoDuplicateInDB(
  tx,
  dto: CreateQuestionDto,
  sectionId: bigint,
) {
  const duplicate = await tx.formQuestion.findFirst({
    where: {
      formId: BigInt(dto.formId),
      sectionId,
      type: dto.type,
      questionText: {
        equals: normalizeQuestion(dto.questionText),
        mode: 'insensitive',
      },
      ...(dto.id ? { NOT: { id: BigInt(dto.id) } } : {}),
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
    where: { questionId: BigInt(dto.id) },
  });

  if (dto.options?.length) {
    await tx.questionOption.createMany({
      data: dto.options.map((opt, index) => ({
        questionId: BigInt(dto.id!),
        optionLabel: opt.label,
        optionValue: opt.value,
        orderNo: opt.orderNo ?? index,
      })),
    });
  }

  await tx.questionRow.deleteMany({
    where: { questionId: BigInt(dto.id) },
  });

  if (dto.rows?.length) {
    await tx.questionRow.createMany({
      data: dto.rows.map((row, index) => ({
        questionId: BigInt(dto.id!),
        rowLabel: row.label,
        orderNo: row.orderNo ?? index,
      })),
    });
  }
}
