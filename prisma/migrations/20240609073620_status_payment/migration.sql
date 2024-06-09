/*
  Warnings:

  - You are about to drop the column `statusPayment` on the `Payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "statusPayment",
ADD COLUMN     "status_payment" TEXT DEFAULT 'NULL';
