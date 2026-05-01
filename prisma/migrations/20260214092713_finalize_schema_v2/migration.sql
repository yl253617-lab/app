/*
  Warnings:

  - You are about to drop the column `userId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `userId`,
    ADD COLUMN `author` VARCHAR(50) NOT NULL DEFAULT '热心网友',
    MODIFY `content` TEXT NOT NULL;

-- DropTable
DROP TABLE `user`;

-- RenameIndex
ALTER TABLE `adminuser` RENAME INDEX `username` TO `adminuser_username_key`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `slug` TO `post_slug_key`;
