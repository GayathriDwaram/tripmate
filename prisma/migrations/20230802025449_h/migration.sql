-- CreateTable
CREATE TABLE `user` (
    `User_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(255) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `Mobile` VARCHAR(255) NOT NULL,
    `Address` VARCHAR(255) NOT NULL,
    `Role` VARCHAR(255) NOT NULL,
    `First_Name` VARCHAR(255) NOT NULL,
    `Last_Name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Email_UNIQUE`(`Email`),
    UNIQUE INDEX `Mobile_UNIQUE`(`Mobile`),
    PRIMARY KEY (`User_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `model` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `plate` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ride` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `vehicle_id` INTEGER NOT NULL,
    `driver_id` INTEGER NOT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `price` FLOAT NOT NULL DEFAULT 0,
    `tip` FLOAT NOT NULL DEFAULT 0,
    `total` FLOAT NOT NULL DEFAULT 0,
    `start_location` VARCHAR(255) NULL,
    `end_location` VARCHAR(255) NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipment_code` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `driver_id` INTEGER NOT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `tip` INTEGER NOT NULL DEFAULT 0,
    `total` INTEGER NOT NULL DEFAULT 0,
    `start_location` VARCHAR(255) NULL,
    `end_location` VARCHAR(255) NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tracking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `shipment_id` INTEGER NOT NULL,
    `current_location` VARCHAR(255) NULL,
    `previous_location` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `points` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 0,
    `type` VARCHAR(255) NOT NULL DEFAULT 'ride',
    `ride_id` INTEGER NULL,
    `shipment_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vehicle` ADD CONSTRAINT `vehicle_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ride` ADD CONSTRAINT `ride_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ride` ADD CONSTRAINT `ride_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ride` ADD CONSTRAINT `ride_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment` ADD CONSTRAINT `shipment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment` ADD CONSTRAINT `shipment_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tracking` ADD CONSTRAINT `tracking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points` ADD CONSTRAINT `points_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points` ADD CONSTRAINT `points_ride_id_fkey` FOREIGN KEY (`ride_id`) REFERENCES `ride`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points` ADD CONSTRAINT `points_shipment_id_fkey` FOREIGN KEY (`shipment_id`) REFERENCES `shipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
