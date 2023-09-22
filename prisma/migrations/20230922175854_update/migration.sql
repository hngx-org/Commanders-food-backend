/*
  Warnings:

  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - Added the required column `currency_code` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `lunches_id_key` ON `lunches`;

-- DropIndex
DROP INDEX `organization_invites_token_key` ON `organization_invites`;

-- DropIndex
DROP INDEX `organizations_id_key` ON `organizations`;

-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `currency_code` VARCHAR(4) NOT NULL,
    MODIFY `name` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` MODIFY `first_name` VARCHAR(255) NULL,
    MODIFY `last_name` VARCHAR(255) NULL,
    MODIFY `profile_pic` VARCHAR(255) NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `phone` VARCHAR(20) NULL;
