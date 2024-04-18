/*
  Warnings:

  - You are about to alter the column `output` on the `Trips` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `Trips` MODIFY `output` JSON NULL;
