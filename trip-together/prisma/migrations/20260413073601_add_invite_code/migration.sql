/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Trip` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- Add column
ALTER TABLE "Trip" ADD COLUMN "inviteCode" TEXT;

-- Fill word to data
UPDATE "Trip"
SET "inviteCode" = UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 6))
WHERE "inviteCode" IS NULL;

-- Set ใส่ NOT NULL + UNIQUE
ALTER TABLE "Trip" ALTER COLUMN "inviteCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Trip_inviteCode_key" ON "Trip"("inviteCode");