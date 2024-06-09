/*
  Warnings:

  - You are about to drop the column `status` on the `Payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "status",
ADD COLUMN     "statusPayment" TEXT NOT NULL DEFAULT 'NULL';
