/*
  Warnings:

  - The primary key for the `organization_invites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[token]` on the table `organization_invites` will be added. If there are existing duplicate values, this will fail.
  - Made the column `token` on table `organization_invites` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `organization_invites` DROP PRIMARY KEY,
    MODIFY `token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organization_invites_token_key` ON `organization_invites`(`token`);
