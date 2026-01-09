/*
  Warnings:

  - You are about to drop the column `projectId` on the `form_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `projectCode` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `forms` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "forms_tenantId_projectCode_title_key";

-- AlterTable
ALTER TABLE "form_submissions" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "forms" DROP COLUMN "projectCode",
DROP COLUMN "projectId",
ALTER COLUMN "adminId" SET DATA TYPE TEXT;
