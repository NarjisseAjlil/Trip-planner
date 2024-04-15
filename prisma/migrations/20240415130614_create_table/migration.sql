-- CreateTable
CREATE TABLE `Trips` (
    `id` VARCHAR(191) NOT NULL,
    `prompt` TEXT NOT NULL,
    `output` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
