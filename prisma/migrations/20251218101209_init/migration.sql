-- CreateTable
CREATE TABLE "Form" (
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

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSection" (
    "id" BIGSERIAL NOT NULL,
    "formId" BIGINT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "orderNo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestion" (
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

    CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "optionLabel" TEXT NOT NULL,
    "optionValue" TEXT,
    "orderNo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionRow" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "rowLabel" TEXT NOT NULL,
    "orderNo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionImage" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionCondition" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "dependsOnQuestionId" BIGINT NOT NULL,
    "dependsOnOptionId" BIGINT,
    "operator" TEXT NOT NULL,
    "expectedValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "formId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormAnswer" (
    "id" BIGSERIAL NOT NULL,
    "submissionId" BIGINT NOT NULL,
    "questionId" BIGINT NOT NULL,
    "answerText" TEXT,
    "optionId" BIGINT,
    "rowId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerOptionValue" (
    "id" BIGSERIAL NOT NULL,
    "answerId" BIGINT NOT NULL,
    "optionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerOptionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerFile" (
    "id" BIGSERIAL NOT NULL,
    "answerId" BIGINT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridAnswer" (
    "id" BIGSERIAL NOT NULL,
    "submissionId" BIGINT NOT NULL,
    "questionId" BIGINT NOT NULL,
    "rowId" BIGINT NOT NULL,
    "optionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GridAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FormAnswerToGridAnswer" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_FormAnswerToGridAnswer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_tenantId_projectCode_title_key" ON "Form"("tenantId", "projectCode", "title");

-- CreateIndex
CREATE INDEX "_FormAnswerToGridAnswer_B_index" ON "_FormAnswerToGridAnswer"("B");

-- AddForeignKey
ALTER TABLE "FormSection" ADD CONSTRAINT "FormSection_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "FormSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionRow" ADD CONSTRAINT "QuestionRow_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionImage" ADD CONSTRAINT "QuestionImage_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCondition" ADD CONSTRAINT "QuestionCondition_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCondition" ADD CONSTRAINT "QuestionCondition_dependsOnQuestionId_fkey" FOREIGN KEY ("dependsOnQuestionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCondition" ADD CONSTRAINT "QuestionCondition_dependsOnOptionId_fkey" FOREIGN KEY ("dependsOnOptionId") REFERENCES "QuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "QuestionRow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOptionValue" ADD CONSTRAINT "AnswerOptionValue_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "FormAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOptionValue" ADD CONSTRAINT "AnswerOptionValue_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerFile" ADD CONSTRAINT "AnswerFile_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "FormAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridAnswer" ADD CONSTRAINT "GridAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridAnswer" ADD CONSTRAINT "GridAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridAnswer" ADD CONSTRAINT "GridAnswer_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "QuestionRow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridAnswer" ADD CONSTRAINT "GridAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormAnswerToGridAnswer" ADD CONSTRAINT "_FormAnswerToGridAnswer_A_fkey" FOREIGN KEY ("A") REFERENCES "FormAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormAnswerToGridAnswer" ADD CONSTRAINT "_FormAnswerToGridAnswer_B_fkey" FOREIGN KEY ("B") REFERENCES "GridAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
