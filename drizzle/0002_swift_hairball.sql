CREATE TABLE `PollQuestion` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`endsAt` datetime(3),
	`question` varchar(5000) NOT NULL,
	`options` json NOT NULL,
	`ownerEmail` varchar(255) NOT NULL,
	`end` boolean NOT NULL);
--> statement-breakpoint
CREATE TABLE `ShortLink` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`owner` varchar(191) NOT NULL,
	`url` varchar(255) NOT NULL,
	`slug` varchar(191) NOT NULL);
--> statement-breakpoint
CREATE TABLE `Vote` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`questionId` varchar(191) NOT NULL,
	`voterToken` varchar(255) NOT NULL,
	`choice` int NOT NULL);
--> statement-breakpoint
CREATE INDEX `PollQuestion_ownerEmail_idx` ON `PollQuestion` (`ownerEmail`);--> statement-breakpoint
CREATE UNIQUE INDEX `ShortLink_slug_key` ON `ShortLink` (`slug`);--> statement-breakpoint
CREATE INDEX `ShortLink_slug_idx` ON `ShortLink` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `Vote_voterToken_questionId_key` ON `Vote` (`voterToken`,`questionId`);--> statement-breakpoint
CREATE INDEX `Vote_voterToken_idx` ON `Vote` (`voterToken`);--> statement-breakpoint
CREATE INDEX `Vote_questionId_idx` ON `Vote` (`questionId`);