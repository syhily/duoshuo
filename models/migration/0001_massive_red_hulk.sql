CREATE TABLE `duoshuo_configs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`create_time` timestamp NOT NULL DEFAULT (now()),
	`update_time` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted` bigint unsigned DEFAULT 0,
	`name` varchar(128) NOT NULL,
	`value` varchar(256) NOT NULL,
	CONSTRAINT `duoshuo_configs_id` PRIMARY KEY(`id`),
	CONSTRAINT `duoshuo_configs_name_unique` UNIQUE(`name`)
);
