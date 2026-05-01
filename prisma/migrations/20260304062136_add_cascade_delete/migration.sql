/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_post_id_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `excerpt` TEXT NULL;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `updatedAt`,
    ADD COLUMN `education` TEXT NULL,
    ADD COLUMN `experience` TEXT NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
