-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `org_id` INTEGER NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `profile_pic` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `lunch_credit_balance` INTEGER NULL,
    `refresh_token` VARCHAR(255) NULL,
    `bank_number` VARCHAR(191) NULL,
    `bank_code` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NULL,
    `bank_region` VARCHAR(191) NULL,
    `currency_code` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_id_idx`(`id`),
    INDEX `users_org_id_idx`(`org_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organizations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL DEFAULT '',
    `lunch_price` DECIMAL(10, 2) NULL,
    `currency_code` VARCHAR(4) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_lunch_wallets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `balance` DECIMAL(10, 2) NOT NULL,
    `org_id` INTEGER NOT NULL,

    UNIQUE INDEX `organization_lunch_wallets_id_key`(`id`),
    UNIQUE INDEX `organization_lunch_wallets_org_id_key`(`org_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withdrawals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `withdrawals_id_key`(`id`),
    INDEX `withdrawals_id_idx`(`id`),
    INDEX `withdrawals_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_invites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `token` VARCHAR(191) NOT NULL,
    `ttl` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `org_id` INTEGER NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lunches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `org_id` INTEGER NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `redeemed` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NULL,
    `note` VARCHAR(191) NULL,

    INDEX `lunches_id_idx`(`id`),
    INDEX `lunches_org_id_idx`(`org_id`),
    INDEX `lunches_sender_id_idx`(`sender_id`),
    INDEX `lunches_receiver_id_idx`(`receiver_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
