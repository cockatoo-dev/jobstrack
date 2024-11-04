CREATE TABLE `jobs` (
	`jobId` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`companyName` text NOT NULL,
	`jobTitle` text NOT NULL,
	`jobDescription` text NOT NULL,
	`dismissRemind` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `usersInfo`(`userId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `updates` (
	`updateId` text PRIMARY KEY NOT NULL,
	`jobId` text NOT NULL,
	`updateType` text NOT NULL,
	`updateTime` integer NOT NULL,
	`updateDay` integer NOT NULL,
	`updateNotes` text NOT NULL,
	FOREIGN KEY (`jobId`) REFERENCES `jobs`(`jobId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `usersBeta` (
	`username` text PRIMARY KEY NOT NULL,
	`passwordHash` text NOT NULL,
	`passwordUpdateTime` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `usersInfo`(`userId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usersInfo` (
	`userId` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`remindFuture` integer NOT NULL,
	`remindDays` integer NOT NULL,
	`remindOfferDays` integer NOT NULL
);
