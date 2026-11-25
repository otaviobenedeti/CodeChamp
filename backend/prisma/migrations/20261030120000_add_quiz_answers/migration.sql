CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerText" TEXT NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "quiz_answers_userId_answeredAt_idx"
ON "quiz_answers"("userId", "answeredAt");

ALTER TABLE "quiz_answers"
ADD CONSTRAINT "quiz_answers_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
