export interface FormEntity {
  id: bigint;
  title: string;
  description?: string;
  adminId: bigint;
  createdAt: Date;
  updatedAt: Date;
}
