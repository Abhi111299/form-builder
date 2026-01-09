/*
  Warnings:

  - A unique constraint covering the columns `[formId,sectionId,sequence]` on the table `form_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "form_questions_formId_sectionId_sequence_key" ON "form_questions"("formId", "sectionId", "sequence");
