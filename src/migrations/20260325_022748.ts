import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "pages_blocks_media_group_block_media_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_media_group_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"header" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_media_group_block_media_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_media_group_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"header" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_media_group_block_media_items" ADD CONSTRAINT "pages_blocks_media_group_block_media_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_media_group_block_media_items" ADD CONSTRAINT "pages_blocks_media_group_block_media_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_group_block"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_media_group_block" ADD CONSTRAINT "pages_blocks_media_group_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_media_group_block_media_items" ADD CONSTRAINT "_pages_v_blocks_media_group_block_media_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_media_group_block_media_items" ADD CONSTRAINT "_pages_v_blocks_media_group_block_media_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_group_block"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_media_group_block" ADD CONSTRAINT "_pages_v_blocks_media_group_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_group_block_media_items_order_idx" ON "pages_blocks_media_group_block_media_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_group_block_media_items_parent_id_idx" ON "pages_blocks_media_group_block_media_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_group_block_media_items_media_idx" ON "pages_blocks_media_group_block_media_items" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_group_block_order_idx" ON "pages_blocks_media_group_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_group_block_parent_id_idx" ON "pages_blocks_media_group_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_group_block_path_idx" ON "pages_blocks_media_group_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_group_block_media_items_order_idx" ON "_pages_v_blocks_media_group_block_media_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_group_block_media_items_parent_id_idx" ON "_pages_v_blocks_media_group_block_media_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_group_block_media_items_media_idx" ON "_pages_v_blocks_media_group_block_media_items" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_group_block_order_idx" ON "_pages_v_blocks_media_group_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_group_block_parent_id_idx" ON "_pages_v_blocks_media_group_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_group_block_path_idx" ON "_pages_v_blocks_media_group_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_media_group_block_media_items" CASCADE;
  DROP TABLE "pages_blocks_media_group_block" CASCADE;
  DROP TABLE "_pages_v_blocks_media_group_block_media_items" CASCADE;
  DROP TABLE "_pages_v_blocks_media_group_block" CASCADE;`)
}
