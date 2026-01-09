import { Prisma } from '@prisma/client';

export async function getOrCreateSection(
  tx: Prisma.TransactionClient,
  formId: bigint,
  sectionOrder: number,
) {
  let section = await tx.formSection.findFirst({
    where: {
      formId,
      orderNo: sectionOrder,
    },
  });

  if (!section) {
    section = await tx.formSection.create({
      data: {
        formId,
        orderNo: sectionOrder,
        title:
          sectionOrder === 1
            ? 'Open Section'
            : `Section ${sectionOrder}`,
      },
    });
  }

  return section;
}
