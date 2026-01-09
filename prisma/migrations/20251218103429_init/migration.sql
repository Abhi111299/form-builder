/*
  Warnings:

  - You are about to drop the `AnswerFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnswerOptionValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GridAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionCondition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionRow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnswerFile" DROP CONSTRAINT "AnswerFile_answerId_fkey";

-- DropForeignKey
ALTER TABLE "AnswerOptionValue" DROP CONSTRAINT "AnswerOptionValue_answerId_fkey";

-- DropForeignKey
ALTER TABLE "AnswerOptionValue" DROP CONSTRAINT "AnswerOptionValue_optionId_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_optionId_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_rowId_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "FormSection" DROP CONSTRAINT "FormSection_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormSubmission" DROP CONSTRAINT "FormSubmission_formId_fkey";

-- DropForeignKey
ALTER TABLE "GridAnswer" DROP CONSTRAINT "GridAnswer_optionId_fkey";

-- DropForeignKey
ALTER TABLE "GridAnswer" DROP CONSTRAINT "GridAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "GridAnswer" DROP CONSTRAINT "GridAnswer_rowId_fkey";

-- DropForeignKey
ALTER TABLE "GridAnswer" DROP CONSTRAINT "GridAnswer_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionCondition" DROP CONSTRAINT "QuestionCondition_dependsOnOptionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionCondition" DROP CONSTRAINT "QuestionCondition_dependsOnQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionCondition" DROP CONSTRAINT "QuestionCondition_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionImage" DROP CONSTRAINT "QuestionImage_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionRow" DROP CONSTRAINT "QuestionRow_questionId_fkey";

-- DropForeignKey
ALTER TABLE "_FormAnswerToGridAnswer" DROP CONSTRAINT "_FormAnswerToGridAnswer_A_fkey";

-- DropForeignKey
ALTER TABLE "_FormAnswerToGridAnswer" DROP CONSTRAINT "_FormAnswerToGridAnswer_B_fkey";

-- DropTable
DROP TABLE "AnswerFile";

-- DropTable
DROP TABLE "AnswerOptionValue";

-- DropTable
DROP TABLE "Form";

-- DropTable
DROP TABLE "FormAnswer";

-- DropTable
DROP TABLE "FormQuestion";

-- DropTable
DROP TABLE "FormSection";

-- DropTable
DROP TABLE "FormSubmission";

-- DropTable
DROP TABLE "GridAnswer";

-- DropTable
DROP TABLE "QuestionCondition";

-- DropTable
DROP TABLE "QuestionImage";

-- DropTable
DROP TABLE "QuestionOption";

-- DropTable
DROP TABLE "QuestionRow";

-- CreateTable
CREATE TABLE "forms" (
    "id" BIGSERIAL NOT NULL,
    "adminId" BIGINT NOT NULL,
    "tenantId" TEXT,
    "projectCode" TEXT NOT NULL,
    "projectId" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_sections" (
    "id" BIGSERIAL NOT NULL,
    "formId" BIGINT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "orderNo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_questions" (
    "id" BIGSERIAL NOT NULL,
    "formId" BIGINT NOT NULL,
    "sectionId" BIGINT NOT NULL,
    "questionText" TEXT NOT NULL,
    "sequence" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "orderNo" INTEGER,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_options" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "optionLabel" TEXT NOT NULL,
    "optionValue" TEXT,
    "orderNo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_rows" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "rowLabel" TEXT NOT NULL,
    "orderNo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_images" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_conditions" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "dependsOnQuestionId" BIGINT NOT NULL,
    "dependsOnOptionId" BIGINT,
    "operator" TEXT NOT NULL,
    "expectedValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "formId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_answers" (
    "id" BIGSERIAL NOT NULL,
    "submissionId" BIGINT NOT NULL,
    "questionId" BIGINT NOT NULL,
    "answerText" TEXT,
    "optionId" BIGINT,
    "rowId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_option_values" (
    "id" BIGSERIAL NOT NULL,
    "answerId" BIGINT NOT NULL,
    "optionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_files" (
    "id" BIGSERIAL NOT NULL,
    "answerId" BIGINT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grid_answers" (
    "id" BIGSERIAL NOT NULL,
    "submissionId" BIGINT NOT NULL,
    "questionId" BIGINT NOT NULL,
    "rowId" BIGINT NOT NULL,
    "optionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grid_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forms_tenantId_projectCode_title_key" ON "forms"("tenantId", "projectCode", "title");

-- AddForeignKey
ALTER TABLE "form_sections" ADD CONSTRAINT "form_sections_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_questions" ADD CONSTRAINT "form_questions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_questions" ADD CONSTRAINT "form_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "form_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_rows" ADD CONSTRAINT "question_rows_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_images" ADD CONSTRAINT "question_images_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_conditions" ADD CONSTRAINT "question_conditions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_conditions" ADD CONSTRAINT "question_conditions_dependsOnQuestionId_fkey" FOREIGN KEY ("dependsOnQuestionId") REFERENCES "form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_conditions" ADD CONSTRAINT "question_conditions_dependsOnOptionId_fkey" FOREIGN KEY ("dependsOnOptionId") REFERENCES "question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "form_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "question_rows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_values" ADD CONSTRAINT "answer_option_values_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "form_answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_values" ADD CONSTRAINT "answer_option_values_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_files" ADD CONSTRAINT "answer_files_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "form_answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grid_answers" ADD CONSTRAINT "grid_answers_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "form_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grid_answers" ADD CONSTRAINT "grid_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grid_answers" ADD CONSTRAINT "grid_answers_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "question_rows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grid_answers" ADD CONSTRAINT "grid_answers_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormAnswerToGridAnswer" ADD CONSTRAINT "_FormAnswerToGridAnswer_A_fkey" FOREIGN KEY ("A") REFERENCES "form_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormAnswerToGridAnswer" ADD CONSTRAINT "_FormAnswerToGridAnswer_B_fkey" FOREIGN KEY ("B") REFERENCES "grid_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
