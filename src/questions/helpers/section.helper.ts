// import { Prisma } from '@prisma/client';

export async function getOrCreateSection(
  tx: any,
  formId: bigint,
  orderNo: number,
  title?: string,
  description?: string,
) {
  let section = await tx.formSection.findFirst({
    where: {
      formId,
      orderNo,
    },
  });

  // 🟢 CREATE SECTION
  if (!section) {
    return tx.formSection.create({
      data: {
        formId,
        orderNo,
        title: title ?? `Section ${orderNo}`,
        description: description ?? null,
      },
    });
  }

  // 🟡 UPDATE TITLE ONLY IF USER PROVIDED IT
  if (
    title &&
    (!section.title || section.title.startsWith('Section '))
  ) {
    return tx.formSection.update({
      where: { id: section.id },
      data: {
        title,
        description: description ?? section.description,
      },
    });
  }

  return section;
}
