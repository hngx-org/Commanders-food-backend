-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `org_id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `profile_picture` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phonenumber` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `lunch_credit_balance` VARCHAR(191) NULL DEFAULT '0',
    `refresh_token` VARCHAR(255) NOT NULL,
    `bank_number` VARCHAR(191) NULL,
    `bank_code` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NULL,
    `bank_region` VARCHAR(191) NULL,
    `currency_code` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_id_key`(`id`),
    INDEX `users_id_idx`(`id`),
    INDEX `users_org_id_idx`(`org_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withdrawals` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `amount` BIGINT NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `withdrawals_id_key`(`id`),
    INDEX `withdrawals_id_idx`(`id`),
    INDEX `withdrawals_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `lunch_price` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL,

    UNIQUE INDEX `organization_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_invites` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `token` VARCHAR(191) NULL,
    `TTL` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

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
