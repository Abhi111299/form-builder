import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { FormResponseDto } from './dto/form-response.dto';
import { successResponse } from '../common/utils/response.util';


@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

//   async create(dto: CreateFormDto, user: any) {
//   const data: any = {
//     title: dto.title,
//     description: dto.description,
//     tenantId: user.tenantId,
//     adminId: user.userId,
//   };

//   const form = await this.prisma.form.create({
//     data,
//   });

//   return {
//     ...form,
//     id: form.id.toString(),
//   };
// }
  async create(dto: CreateFormDto, user: any) {
  const form = await this.prisma.form.create({
    data: {
      title: dto.title,
      description: dto.description,
      tenantId: user.tenantId,
      adminId: user.userId,
    },
  });

  const formattedForm = {
    id: form.id.toString(),
    title: form.title,
    description: form.description,
    tenantId: form.tenantId,
    adminId: form.adminId,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  };

  return successResponse(
    'Form created successfully',
    formattedForm, // 👈 single item is OK
    // null,
    // 201,
  );
}

  async getAllFormsByAdmin(
  adminId: string,
  page = 1,
  limit = 10,
) {
  const skip = (page - 1) * limit;

  const [forms, totalItems] = await Promise.all([
    this.prisma.form.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    this.prisma.form.count({
      where: { adminId },
    }),
  ]);

  const items = forms.map((form) => ({
    id: form.id.toString(),
    title: form.title,
    description: form.description ?? undefined,
    adminId: form.adminId,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  }));
  return successResponse(
  'Forms fetched successfully',
  items,
  {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  },
);
}


  async getCompleteForm(formId: number, user: any) {
    const form = await this.prisma.form.findFirst({
      where: {
        id: BigInt(formId),
        adminId: user.userId,
      },
      include: {
        sections: {
          orderBy: { orderNo: 'asc' },
          include: {
            questions: {
              orderBy: { sequence: 'asc' },
              include: {
                options: {
                  orderBy: { orderNo: 'asc' },
                },
                rows: {
                  orderBy: { orderNo: 'asc' },
                },
                images: true,
                parentConditions: true,
                childConditions: true,
              },
            },
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

     const formattedForm =  {
      id: Number(form.id),
      title: form.title,
      description: form.description,
      status: form.status,
      createdAt: form.createdAt,
      sections: form.sections.map((section) => ({
        id: Number(section.id),
        title: section.title,
        description: section.description,
        orderNo: section.orderNo,
        questions: section.questions.map((q) => ({
          id: Number(q.id),
          questionText: q.questionText,
          type: q.type,
          required: q.required,
          sequence: Number(q.sequence),
          settings: q.settings,
          options: q.options.map((opt) => ({
            id: Number(opt.id),
            label: opt.optionLabel,
            value: opt.optionValue,
            orderNo: opt.orderNo,
          })),
          rows: q.rows.map((row) => ({
            id: Number(row.id),
            label: row.rowLabel,
            orderNo: row.orderNo,
          })),
          images: q.images.map((img) => ({
            id: Number(img.id),
            imageUrl: img.imageUrl,
          })),
          conditions: {
            showWhen: q.parentConditions,
            affects: q.childConditions,
          },
        })),
      })),
    };
    return successResponse(
  'Forms fetched successfully',
  formattedForm,
  // {
  //   page,
  //   limit,
  //   totalItems,
  //   totalPages: Math.ceil(totalItems / limit),
  // },
);
  }

  findAll(user: any) {
    return this.prisma.form.findMany({
      where: {
        tenantId: user.tenantId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findMine(user: any) {
    return this.prisma.form.findMany({
      where: {
        tenantId: user.tenantId,
        adminId: user.userId,
      },
    });
  }
}
