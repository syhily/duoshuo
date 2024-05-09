CREATE TABLE `duoshuo_comments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted` bigint unsigned DEFAULT 0,
	`mask_id` bigint unsigned NOT NULL,
	`post_id` bigint unsigned NOT NULL,
	`content` longtext,
	`pending` boolean DEFAULT false,
	`collapsed` boolean DEFAULT false,
	`pinned` boolean DEFAULT false,
	`ip` varchar(16),
	`ua` text,
	`likes` bigint unsigned DEFAULT 0,
	`parent_id` bigint unsigned,
	`thread_id` bigint unsigned,
	CONSTRAINT `duoshuo_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `duoshuo_comments_like` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`comment_id` bigint unsigned NOT NULL,
	`anonymous_token` char(128),
	`user_id` bigint unsigned,
	CONSTRAINT `duoshuo_comments_like_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `duoshuo_configs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(128) NOT NULL,
	`value` json NOT NULL,
	CONSTRAINT `duoshuo_configs_id` PRIMARY KEY(`id`),
	CONSTRAINT `duoshuo_configs_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `duoshuo_posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted` bigint unsigned DEFAULT 0,
	`title` varchar(512),
	`request_path` varchar(512) NOT NULL,
	`clicks` bigint unsigned DEFAULT 0,
	`likes` bigint unsigned DEFAULT 0,
	CONSTRAINT `duoshuo_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `duoshuo_posts_request_path_unique` UNIQUE(`request_path`)
);
--> statement-breakpoint
CREATE TABLE `duoshuo_posts_identity` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted` bigint unsigned DEFAULT 0,
	`identity` varchar(128) NOT NULL,
	`post_id` bigint unsigned NOT NULL,
	CONSTRAINT `duoshuo_posts_identity_id` PRIMARY KEY(`id`),
	CONSTRAINT `duoshuo_posts_identity_identity_unique` UNIQUE(`identity`)
);
--> statement-breakpoint
CREATE TABLE `duoshuo_posts_like` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`post_id` bigint unsigned NOT NULL,
	`anonymous_token` char(128),
	`user_id` bigint unsigned,
	CONSTRAINT `duoshuo_posts_like_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `duoshuo_users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted` bigint unsigned DEFAULT 0,
	`email` varchar(256) NOT NULL,
	`nick_name` varchar(64) NOT NULL,
	`registered` boolean DEFAULT false,
	`verified` boolean DEFAULT false,
	`password` varchar(512),
	`salt` varchar(128),
	`admin` boolean DEFAULT false,
	`friend` boolean DEFAULT false,
	`homepage` varchar(256),
	`last_login_ip` varchar(16),
	`last_login_ua` text,
	CONSTRAINT `duoshuo_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `duoshuo_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `duoshuo_users_mask` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`nick_name` varchar(64) NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	CONSTRAINT `duoshuo_users_mask_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `comments_mask_id_idx` ON `duoshuo_comments` (`mask_id`);--> statement-breakpoint
CREATE INDEX `comments_idx` ON `duoshuo_comments` (`deleted`,`post_id`,`thread_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_id_idx` ON `duoshuo_comments` (`parent_id`);--> statement-breakpoint
CREATE INDEX `comments_like_comment_id_idx` ON `duoshuo_comments_like` (`comment_id`);--> statement-breakpoint
CREATE INDEX `comments_like_anonymous_token_idx` ON `duoshuo_comments_like` (`anonymous_token`);--> statement-breakpoint
CREATE INDEX `comments_like_user_id_id` ON `duoshuo_comments_like` (`user_id`);--> statement-breakpoint
CREATE INDEX `posts_deleted_idx` ON `duoshuo_posts` (`deleted`);--> statement-breakpoint
CREATE INDEX `posts_title_idx` ON `duoshuo_posts` (`title`);--> statement-breakpoint
CREATE INDEX `posts_identity_post_id_idx` ON `duoshuo_posts_identity` (`post_id`);--> statement-breakpoint
CREATE INDEX `posts_like_post_id_idx` ON `duoshuo_posts_like` (`post_id`);--> statement-breakpoint
CREATE INDEX `posts_like_anonymous_token_idx` ON `duoshuo_posts_like` (`anonymous_token`);--> statement-breakpoint
CREATE INDEX `posts_like_user_id_idx` ON `duoshuo_posts_like` (`user_id`);--> statement-breakpoint
CREATE INDEX `users_deleted_idx` ON `duoshuo_users` (`deleted`);--> statement-breakpoint
CREATE INDEX `users_mask_nick_name_idx` ON `duoshuo_users_mask` (`nick_name`);--> statement-breakpoint
CREATE INDEX `users_mask_user_id_idx` ON `duoshuo_users_mask` (`user_id`);