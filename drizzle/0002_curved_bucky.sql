ALTER TABLE "users" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_img" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cover_img" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "about" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stx_address_testnet" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stx_address_mainnet" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "btc_address_testnet" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "btc_address_mainnet" text;