import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { getOrCreateSection } from './helpers/section.helper';
import { normalizeQuestion } from './utils/question.utils';
import {
  validateDuplicateQuestionsInPayload,
  validateDuplicateSequencesInPayload,
} from './utils/question.validation';

import {
  ensureNoDuplicateInDB,
  replaceOptionsAndRows,
} from './helpers/question.persistence';
import { successResponse } from 'src/common/utils/response.util';


@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(dto: CreateQuestionDto, user: any) {
  // 1️⃣ Verify form ownership
  const formId = BigInt(dto.formId);

  const form = await this.prisma.form.findUnique({
    where: { id: formId },
    select: { adminId: true },
  });

  if (!form || form.adminId !== user.userId) {
    throw new ForbiddenException('You are not allowed to modify this form');
  }

  // 2️⃣ Resolve section (🔥 FIX)
  const sectionOrder = dto.sectionOrder ?? 1;

  const section = await getOrCreateSection(
    this.prisma,
    formId,
    sectionOrder,
  );

  // 3️⃣ Create question
  const question = await this.prisma.formQuestion.create({
    data: {
      formId,
      sectionId: section.id, // ✅ FIXED
      questionText: dto.questionText,
      type: dto.type,
      required: dto.required ?? false,
      sequence: BigInt(dto.sequence),
      settings: dto.settings ?? {},
    },
  });

  // 4️⃣ Create options
  if (dto.options?.length) {
    await this.prisma.questionOption.createMany({
      data: dto.options.map((opt, index) => ({
        questionId: question.id,
        optionLabel: opt.label,
        optionValue: opt.value,
        orderNo: opt.orderNo ?? index,
      })),
    });
  }

  // 5️⃣ Create rows
  if (dto.rows?.length) {
    await this.prisma.questionRow.createMany({
      data: dto.rows.map((row, index) => ({
        questionId: question.id,
        rowLabel: row.label,
        orderNo: row.orderNo ?? index,
      })),
    });
  }

  return {
    message: 'Question created successfully',
    questionId: question.id.toString(),
    sectionId: section.id.toString(),
  };
}
//   async createQuestion(dto: CreateQuestionDto, user: any) {
//   try {
//     // 1️⃣ Verify form ownership
//     const form = await this.prisma.form.findUnique({
//       where: { id: BigInt(dto.formId) },
//       select: { adminId: true },
//     });

//     if (!form || form.adminId !== user.userId) {
//       throw new ForbiddenException('You are not allowed to modify this form');
//     }

//     // 2️⃣ Create question
//     const question = await this.prisma.formQuestion.create({
//       data: {
//         formId: BigInt(dto.formId),
//         sectionId: section.id,
//         questionText: dto.questionText,
//         type: dto.type,
//         required: dto.required ?? false,
//         sequence: BigInt(dto.sequence), // ✔ safe now
//         settings: dto.settings ?? {},
//       },
//     });

//     // 3️⃣ Create options
//     if (dto.options?.length) {
//       await this.prisma.questionOption.createMany({
//         data: dto.options.map((opt, index) => ({
//           questionId: question.id,
//           optionLabel: opt.label,
//           optionValue: opt.value,
//           orderNo: opt.orderNo ?? index,
//         })),
//       });
//     }

//     // 4️⃣ Create rows
//     if (dto.rows?.length) {
//       await this.prisma.questionRow.createMany({
//         data: dto.rows.map((row, index) => ({
//           questionId: question.id,
//           rowLabel: row.label,
//           orderNo: row.orderNo ?? index,
//         })),
//       });
//     }

//     return {
//       message: 'Question created successfully',
//       questionId: question.id.toString(),
//     };
//   } catch (error) {
//     console.error('❌ CREATE QUESTION ERROR:', error);

//     // Prisma known errors (optional but recommended)
//     if (error.code) {
//       throw new Error(`Prisma error: ${error.code}`);
//     }

//     throw error; // rethrow so Nest returns proper response
//   }
// }

// async bulkCreateQuestions(questions: CreateQuestionDto[], user: any) {
//     if (!questions.length) {
//       return { message: 'No questions provided' };
//     }

//     const formId = BigInt(questions[0].formId);

//     const form = await this.prisma.form.findUnique({
//       where: { id: formId },
//       select: { adminId: true },
//     });

//     if (!form || form.adminId !== user.userId) {
//       throw new ForbiddenException('You are not allowed to modify this form');
//     }

//     // ✅ Payload validations
//     validateDuplicateQuestionsInPayload(questions);
//     validateDuplicateSequencesInPayload(questions);

//     const sortedQuestions = [...questions].sort(
//       (a, b) => a.sequence - b.sequence,
//     );

//     await this.prisma.$transaction(async (tx) => {
//       for (const dto of sortedQuestions) {
//         await ensureNoDuplicateInDB(tx, dto);

//         if (dto.id) {
//           await tx.formQuestion.update({
//             where: { id: BigInt(dto.id) },
//             data: {
//               questionText: dto.questionText,
//               type: dto.type,
//               required: dto.required ?? false,
//               sequence: BigInt(dto.sequence),
//               settings: dto.settings ?? {},
//             },
//           });

//           await replaceOptionsAndRows(tx, dto);
//           continue;
//         }

//         await tx.formQuestion.updateMany({
//           where: {
//             formId: BigInt(dto.formId),
//             sectionId: BigInt(dto.sectionId),
//             sequence: { gte: BigInt(dto.sequence) },
//           },
//           data: { sequence: { increment: 1 } },
//         });

//         const question = await tx.formQuestion.create({
//           data: {
//             formId: BigInt(dto.formId),
//             sectionId: BigInt(dto.sectionId),
//             questionText: dto.questionText,
//             type: dto.type,
//             required: dto.required ?? false,
//             sequence: BigInt(dto.sequence),
//             settings: dto.settings ?? {},
//           },
//         });

//         if (dto.options?.length) {
//           await tx.questionOption.createMany({
//             data: dto.options.map((opt, index) => ({
//               questionId: question.id,
//               optionLabel: opt.label,
//               optionValue: opt.value,
//               orderNo: opt.orderNo ?? index,
//             })),
//           });
//         }

//         if (dto.rows?.length) {
//           await tx.questionRow.createMany({
//             data: dto.rows.map((row, index) => ({
//               questionId: question.id,
//               rowLabel: row.label,
//               orderNo: row.orderNo ?? index,
//             })),
//           });
//         }
//       }
//     });

//     return {
//       message: 'Questions created successfully with auto-ordering',
//       total: questions.length,
//     };
//   }

async bulkCreateQuestions(questions: CreateQuestionDto[], user: any) {
  if (!questions.length) {
    return successResponse('No questions provided', { totalCreated: 0 });
  }

  const formId = BigInt(questions[0].formId);

  // 🔐 Ownership check
  const form = await this.prisma.form.findUnique({
    where: { id: formId },
    select: { adminId: true },
  });

  if (!form || form.adminId !== user.userId) {
    throw new ForbiddenException('You are not allowed to modify this form');
  }

  // 🔍 Payload validations
  validateDuplicateQuestionsInPayload(questions);
  validateDuplicateSequencesInPayload(questions);

  // 🔢 Sort payload ONLY by sequence
  const sortedQuestions = questions;

  // 🔥 GLOBAL QUESTION ORDER (cross-section)
  const maxOrder = await this.prisma.formQuestion.aggregate({
    where: { formId },
    _max: { orderNo: true },
  });

  let nextOrderNo: number = (maxOrder._max.orderNo ?? 0) + 1;

  // 🔄 TRANSACTION
  await this.prisma.$transaction(async (tx) => {
    for (const dto of sortedQuestions) {
      const sectionOrder = dto.sectionOrder ?? 1;

      // 🔥 GET / CREATE SECTION
      const section = await getOrCreateSection(
        tx,
        formId,
        sectionOrder,
        dto.sectionTitle,
        dto.sectionDescription,
      );

      // 🚫 DB duplicate check
      await ensureNoDuplicateInDB(tx, dto, section.id);

      // 🔄 UPDATE QUESTION (NO orderNo CHANGE)
      if (dto.id) {
        const existing = await tx.formQuestion.findUnique({
    where: { id: BigInt(dto.id) },
    select: {
      sequence: true,
      sectionId: true,
    },
  });

  if (!existing) {
    throw new BadRequestException('Question not found');
  }
        await tx.formQuestion.update({
          where: { id: BigInt(dto.id) },
          data: {
            questionText: dto.questionText,
            type: dto.type,
            required: dto.required ?? false,
            sequence: BigInt(dto.sequence),
            sectionId: section.id,
            settings: dto.settings ?? {},
          },
        });

        await replaceOptionsAndRows(tx, dto);
        continue;
      }

      // 🔁 SHIFT sequence ONLY inside same section
      await tx.formQuestion.updateMany({
        where: {
          formId,
          sectionId: section.id,
          sequence: { gte: BigInt(dto.sequence) },
        },
        data: { sequence: { increment: 1 } },
      });

      // ➕ CREATE QUESTION (GLOBAL orderNo)
      const question = await tx.formQuestion.create({
        data: {
          formId,
          sectionId: section.id,
          questionText: dto.questionText,
          type: dto.type,
          required: dto.required ?? false,
          sequence: BigInt(dto.sequence),
          orderNo: nextOrderNo,
          settings: dto.settings ?? {},
        },
      });

      nextOrderNo++; // 🔥 increment global order

      // ➕ OPTIONS
      if (dto.options?.length) {
        await tx.questionOption.createMany({
          data: dto.options.map((opt, index) => ({
            questionId: question.id,
            optionLabel: opt.label,
            optionValue: opt.value ?? null,
            orderNo: opt.orderNo ?? index,
          })),
        });
      }

      // ➕ ROWS
      if (dto.rows?.length) {
        await tx.questionRow.createMany({
          data: dto.rows.map((row, index) => ({
            questionId: question.id,
            rowLabel: row.label,
            orderNo: row.orderNo ?? index,
          })),
        });
      }
    }
  });

  // ✅ RESPONSE
  return successResponse(
    'Questions created successfully',
    {
      totalCreated: questions.length,
    },
  );
}



}