ALTER TABLE "users" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "uuid" SET NOT NULL;