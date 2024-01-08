CREATE TABLE `Like` (
	`id` int AUTO_INCREMENT NOT NULL,
	`owner` varchar(255) NOT NULL,
	`recipeId` int NOT NULL,
	`up` tinyint NOT NULL,
	CONSTRAINT `Like_id` PRIMARY KEY(`id`),
	CONSTRAINT `Like_id_key` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE INDEX `Like_owner_idx` ON `Like` (`owner`);