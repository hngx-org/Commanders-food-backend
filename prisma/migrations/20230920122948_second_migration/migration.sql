/*
  Warnings:

  - You are about to drop the column `accountVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[org_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bank_code` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_number` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lunch_credit_balance` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `org_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phonenumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_picture` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `accountVerified`,
    DROP COLUMN `emailVerified`,
    ADD COLUMN `bank_code` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `isAdmin` BOOLEAN NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `lunch_credit_balance` VARCHAR(191) NOT NULL,
    ADD COLUMN `org_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `password_hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `phonenumber` INTEGER NOT NULL,
    ADD COLUMN `profile_picture` VARCHAR(191) NOT NULL,
    ADD COLUMN `refresh_token` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `withdrawals` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `amount` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `withdrawals_id_key`(`id`),
    INDEX `withdrawals_id_idx`(`id`),
    INDEX `withdrawals_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lunch_price` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `organization_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_invites` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `TTL` DATETIME(3) NOT NULL,

    UNIQUE INDEX `organization_invites_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lunches` (
    `id` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `redeemed` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `org_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `lunches_id_key`(`id`),
    INDEX `lunches_id_idx`(`id`),
    INDEX `lunches_senderId_idx`(`senderId`),
    INDEX `lunches_receiverId_idx`(`receiverId`),
    INDEX `lunches_org_id_idx`(`org_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_lunch_wallet` (
    `id` VARCHAR(191) NOT NULL,
    `balance` VARCHAR(191) NOT NULL,
    `org_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `organization_lunch_wallet_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_id_key` ON `users`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_org_id_key` ON `users`(`org_id`);

-- CreateIndex
CREATE INDEX `users_id_idx` ON `users`(`id`);

-- CreateIndex
CREATE INDEX `users_org_id_idx` ON `users`(`org_id`);
