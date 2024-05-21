/*
  Warnings:

  - You are about to drop the column `id_last_session` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "id_last_session";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "id_last_session" TEXT;
