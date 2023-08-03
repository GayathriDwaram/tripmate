/*
  Warnings:

  - You are about to alter the column `start_time` on the `ride` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_time` on the `ride` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `start_time` on the `shipment` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_time` on the `shipment` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `ride` MODIFY `start_time` DATETIME NOT NULL,
    MODIFY `end_time` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `shipment` MODIFY `start_time` DATETIME NOT NULL,
    MODIFY `end_time` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `card_number` VARCHAR(255) NOT NULL,
    `cvv` VARCHAR(255) NOT NULL,
    `exp_date` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
