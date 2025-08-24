/*
  Warnings:

  - You are about to drop the column `userId` on the `records` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `records` DROP FOREIGN KEY `records_login_fkey`;

-- DropIndex
DROP INDEX `records_login_fkey` ON `records`;

-- AlterTable
ALTER TABLE `records` DROP COLUMN `userId`,
    MODIFY `login` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `records` ADD CONSTRAINT `records_login_fkey` FOREIGN KEY (`login`) REFERENCES `users`(`login`) ON DELETE SET NULL ON UPDATE CASCADE;
