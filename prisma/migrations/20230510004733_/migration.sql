/*
  Warnings:

  - You are about to drop the column `lastUpdated` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "lastUpdated",
ADD COLUMN     "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
