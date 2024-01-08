CREATE TABLE `Like` (
	`id` int AUTO_INCREMENT NOT NULL,
	`owner` varchar(255) NOT NULL,
	`recipeId` int NOT NULL,
	`up` tinyint NOT NULL,
	CONSTRAINT `Like_id` PRIMARY KEY(`id`),
	CONSTRAINT `Like_id_key` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `PollQuestion` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT now(3),
	`endsAt` datetime(3),
	`question` varchar(5000) NOT NULL,
	`options` json NOT NULL,
	`ownerEmail` varchar(255) NOT NULL,
	`end` tinyint NOT NULL,
	CONSTRAINT `PollQuestion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Recipe` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rating` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	`ingredients` json NOT NULL,
	`owner` varchar(255) NOT NULL,
	`directions` json NOT NULL,
	CONSTRAINT `Recipe_id` PRIMARY KEY(`id`),
	CONSTRAINT `Recipe_id_key` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `ShortLink` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT now(3),
	`owner` varchar(191) NOT NULL,
	`url` varchar(255) NOT NULL,
	`slug` varchar(191) NOT NULL,
	CONSTRAINT `ShortLink_id` PRIMARY KEY(`id`),
	CONSTRAINT `ShortLink_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Vote` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT now(3),
	`questionId` int NOT NULL,
	`voterToken` varchar(255) NOT NULL,
	`choice` int NOT NULL,
	CONSTRAINT `Vote_id` PRIMARY KEY(`id`),
	CONSTRAINT `Vote_voterToken_questionId_key` UNIQUE(`voterToken`,`questionId`)
);
--> statement-breakpoint
CREATE INDEX `Like_owner_idx` ON `Like` (`owner`);--> statement-breakpoint
CREATE INDEX `PollQuestion_ownerEmail_idx` ON `PollQuestion` (`ownerEmail`);--> statement-breakpoint
CREATE INDEX `Recipe_owner_idx` ON `Recipe` (`owner`);--> statement-breakpoint
CREATE INDEX `ShortLink_slug_idx` ON `ShortLink` (`slug`);--> statement-breakpoint
CREATE INDEX `Vote_questionId_idx` ON `Vote` (`questionId`);--> statement-breakpoint
CREATE INDEX `Vote_voterToken_idx` ON `Vote` (`voterToken`);