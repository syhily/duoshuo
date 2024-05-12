CREATE SCHEMA IF NOT EXISTS "duoshuo";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."comments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp (6) with time zone,
	"mask_id" bigint NOT NULL,
	"post_id" bigint NOT NULL,
	"content" text,
	"pending" boolean DEFAULT false,
	"collapsed" boolean DEFAULT false,
	"pinned" boolean DEFAULT false,
	"ip" "inet",
	"ua" text,
	"likes" bigint DEFAULT 0,
	"parent_id" bigint,
	"thread_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."comments_like" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"comment_id" bigint NOT NULL,
	"anonymous_token" char(128),
	"user_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."configs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"name" varchar(128) NOT NULL,
	"value" jsonb NOT NULL,
	CONSTRAINT "configs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."posts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp (6) with time zone,
	"title" varchar(512),
	"request_path" varchar(512) NOT NULL,
	"clicks" bigint DEFAULT 0,
	"likes" bigint DEFAULT 0,
	CONSTRAINT "posts_request_path_unique" UNIQUE("request_path")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."posts_identity" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp (6) with time zone,
	"identity" varchar(128) NOT NULL,
	"post_id" bigint NOT NULL,
	CONSTRAINT "posts_identity_identity_unique" UNIQUE("identity")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."posts_like" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"post_id" bigint NOT NULL,
	"anonymous_token" char(128),
	"user_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp (6) with time zone,
	"email" varchar(256) NOT NULL,
	"nick_name" varchar(64) NOT NULL,
	"registered" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"password" varchar(512),
	"salt" varchar(128),
	"admin" boolean DEFAULT false,
	"friend" boolean DEFAULT false,
	"homepage" varchar(256),
	"last_login_ip" "inet",
	"last_login_ua" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "duoshuo"."users_mask" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"create_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"nick_name" varchar(64) NOT NULL,
	"user_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_mask_id_idx" ON "duoshuo"."comments" ("mask_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_idx" ON "duoshuo"."comments" ("deleted","post_id","thread_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_parent_id_idx" ON "duoshuo"."comments" ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_like_comment_id_idx" ON "duoshuo"."comments_like" ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_like_anonymous_token_idx" ON "duoshuo"."comments_like" ("anonymous_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_like_user_id_id" ON "duoshuo"."comments_like" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_deleted_idx" ON "duoshuo"."posts" ("deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_title_idx" ON "duoshuo"."posts" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_identity_post_id_idx" ON "duoshuo"."posts_identity" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_like_post_id_idx" ON "duoshuo"."posts_like" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_like_anonymous_token_idx" ON "duoshuo"."posts_like" ("anonymous_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_like_user_id_idx" ON "duoshuo"."posts_like" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_deleted_idx" ON "duoshuo"."users" ("deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_mask_nick_name_idx" ON "duoshuo"."users_mask" ("nick_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_mask_user_id_idx" ON "duoshuo"."users_mask" ("user_id");
