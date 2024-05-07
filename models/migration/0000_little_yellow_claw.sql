CREATE TABLE `duoshuo_comments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted` bigint unsigned DEFAULT 0,
	CONSTRAINT `duoshuo_comments_id` PRIMARY KEY(`id`)
);
