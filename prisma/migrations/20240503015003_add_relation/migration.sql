-- AddForeignKey
ALTER TABLE `sale_details` ADD CONSTRAINT `sale_details_egg_id_fkey` FOREIGN KEY (`egg_id`) REFERENCES `eggs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_details` ADD CONSTRAINT `sale_details_pack_id_fkey` FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
